'use client'

import { useCallback, useEffect, useState } from 'react'

import { apiRequest } from '../lib/api'
import {
  BACK_GATE,
  MAX_DISTANCE_METERS,
  type MenusResponse,
  type NaverPlace,
  type NaverResponse,
  type PlaceCategory,
  type PlaceMenus,
  type RecommendationSummary,
  isCafeCategory,
} from '../lib/domain'

const EMPTY_RECOMMENDATIONS: RecommendationSummary = {
  counts: {},
  dailyRecommendation: { used: false, usedCount: 0, limit: 3, placeIds: [] },
}

export function useFoodData(selectedCategory: PlaceCategory) {
  const [places, setPlaces] = useState<NaverPlace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [recommendations, setRecommendations] =
    useState<RecommendationSummary>(EMPTY_RECOMMENDATIONS)
  const [recommendingPlaceId, setRecommendingPlaceId] = useState<string | null>(null)
  const [recommendationMessage, setRecommendationMessage] = useState('')
  const [menusByPlaceId, setMenusByPlaceId] = useState<Record<string, PlaceMenus>>({})
  const [menusMeta, setMenusMeta] = useState<MenusResponse['meta'] | null>(null)
  const [menuLoadError, setMenuLoadError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    apiRequest<RecommendationSummary>(
      '/api/recommendations',
      { signal: controller.signal },
      '추천 기록을 불러오지 못했어요.',
    )
      .then(setRecommendations)
      .catch((caughtError: unknown) => {
        if (caughtError instanceof Error && caughtError.name !== 'AbortError') {
          setRecommendationMessage(caughtError.message)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    apiRequest<MenusResponse>(
      '/api/naver-map/menus',
      { signal: controller.signal },
      '메뉴 정보를 불러오지 못했어요.',
    )
      .then((menuData) => {
        setMenusByPlaceId(menuData.places)
        setMenusMeta(menuData.meta)
      })
      .catch((caughtError: unknown) => {
        if (caughtError instanceof Error && caughtError.name !== 'AbortError') {
          setMenuLoadError(caughtError.message)
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({
      query: selectedCategory.query === '전체' ? '음식점' : selectedCategory.query,
      x: String(BACK_GATE.x),
      y: String(BACK_GATE.y),
      radius: String(MAX_DISTANCE_METERS),
      page: '1',
    })

    queueMicrotask(() => {
      if (!controller.signal.aborted) {
        setLoading(true)
        setError('')
      }
    })

    apiRequest<NaverResponse>(
      `/api/naver-map/coordinate?${params}`,
      { signal: controller.signal },
      '음식점 정보를 불러오지 못했어요.',
    )
      .then((naverData) => {
        const categoryPlaces =
          selectedCategory.query === '음식점'
            ? naverData.documents.filter((place) => !isCafeCategory(place.category))
            : selectedCategory.query === '카페'
              ? naverData.documents.filter((place) => isCafeCategory(place.category))
              : naverData.documents

        setPlaces(
          categoryPlaces.filter((place) => {
            const meters = Number(place.distance)
            return Number.isFinite(meters) && meters <= MAX_DISTANCE_METERS
          }),
        )
      })
      .catch((caughtError: unknown) => {
        if (caughtError instanceof Error && caughtError.name !== 'AbortError') {
          setError(caughtError.message)
          setPlaces([])
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [selectedCategory])

  const recommendPlace = useCallback(
    async (place: NaverPlace) => {
      const alreadyRecommended = recommendations.dailyRecommendation.placeIds.includes(place.id)
      if (alreadyRecommended || recommendations.dailyRecommendation.used || recommendingPlaceId)
        return

      setRecommendingPlaceId(place.id)
      setRecommendationMessage('')

      try {
        const nextRecommendations = await apiRequest<RecommendationSummary>(
          `/api/recommendations/${place.id}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ placeName: place.name, category: place.category }),
          },
          '추천을 기록하지 못했어요.',
        )
        setRecommendations(nextRecommendations)
        setRecommendationMessage(
          `${place.name}에 추천했어요. (${nextRecommendations.dailyRecommendation.usedCount}/${nextRecommendations.dailyRecommendation.limit})`,
        )
      } catch (caughtError) {
        if (caughtError instanceof Error) setRecommendationMessage(caughtError.message)
      } finally {
        setRecommendingPlaceId(null)
      }
    },
    [recommendations, recommendingPlaceId],
  )

  return {
    error,
    loading,
    menuLoadError,
    menusByPlaceId,
    menusMeta,
    places,
    recommendationMessage,
    recommendations,
    recommendPlace,
    recommendingPlaceId,
  }
}
