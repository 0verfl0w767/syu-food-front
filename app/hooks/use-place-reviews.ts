'use client'

import { useEffect, useRef, useState } from 'react'

import { apiRequest } from '../lib/api'
import type { NaverReviewsResponse } from '../lib/domain'

export function usePlaceReviews(activePlaceId: string | null) {
  const requestedPlaceIds = useRef(new Set<string>())
  const [reviewsByPlaceId, setReviewsByPlaceId] = useState<Record<string, string[]>>({})
  const [activeReviewIndex, setActiveReviewIndex] = useState(0)
  const activeReviews = activePlaceId ? (reviewsByPlaceId[activePlaceId] ?? []) : []

  useEffect(() => {
    if (!activePlaceId || requestedPlaceIds.current.has(activePlaceId)) return

    const controller = new AbortController()
    const timer = window.setTimeout(() => {
      requestedPlaceIds.current.add(activePlaceId)
      apiRequest<NaverReviewsResponse>(
        `/api/naver-map/place/${activePlaceId}/reviews`,
        { signal: controller.signal },
        '방문자 리뷰를 불러오지 못했어요.',
      )
        .then((reviewData) => {
          setReviewsByPlaceId((current) => ({
            ...current,
            [activePlaceId]: reviewData.reviews.slice(0, 5),
          }))
        })
        .catch((caughtError: unknown) => {
          if (caughtError instanceof Error && caughtError.name === 'AbortError') {
            requestedPlaceIds.current.delete(activePlaceId)
            return
          }
          setReviewsByPlaceId((current) => ({ ...current, [activePlaceId]: [] }))
        })
    }, 250)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [activePlaceId])

  useEffect(() => {
    if (activeReviews.length <= 1) return

    const interval = window.setInterval(() => {
      setActiveReviewIndex((current) => (current + 1) % activeReviews.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [activePlaceId, activeReviews.length])

  return { activeReviewIndex, reviewsByPlaceId }
}
