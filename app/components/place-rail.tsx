'use client'

import Image from 'next/image'
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { usePlaceReviews } from '../hooks/use-place-reviews'
import {
  formatCount,
  formatDistance,
  type NaverPlace,
  type PlaceCategory,
  type PlaceMenus,
  type PlaceSortOption,
  type RecommendationSummary,
} from '../lib/domain'
import { PLACE_IMAGE_OVERRIDES } from '../place-image-overrides'
import { ArrowLeftIcon, ArrowRightIcon, HeartIcon } from './icons'

type PlaceRailProps = {
  category: PlaceCategory
  dialogOpen: boolean
  error: string
  loading: boolean
  menusByPlaceId: Record<string, PlaceMenus>
  places: NaverPlace[]
  recommendationMessage: string
  recommendations: RecommendationSummary
  recommendingPlaceId: string | null
  onOpenMenus: (placeId: string) => void
  onOpenMenuSearch: () => void
  onRecommend: (place: NaverPlace) => Promise<void>
}

export function PlaceRail({
  category,
  dialogOpen,
  error,
  loading,
  menusByPlaceId,
  places,
  recommendationMessage,
  recommendations,
  recommendingPlaceId,
  onOpenMenus,
  onOpenMenuSearch,
  onRecommend,
}: PlaceRailProps) {
  const railRef = useRef<HTMLDivElement>(null)
  const [sortOption, setSortOption] = useState<PlaceSortOption>('distance')
  const [activeIndex, setActiveIndex] = useState(0)

  const sortedPlaces = useMemo(() => {
    const list = [...places]
    if (sortOption === 'heart') {
      list.sort((a, b) => {
        const countDifference =
          (recommendations.counts[b.id] ?? 0) - (recommendations.counts[a.id] ?? 0)
        return countDifference || (Number(a.distance) || 9999) - (Number(b.distance) || 9999)
      })
    } else if (sortOption === 'review') {
      list.sort((a, b) => {
        const reviewA = (a.visitorReviewCount ?? 0) + (a.blogReviewCount ?? 0)
        const reviewB = (b.visitorReviewCount ?? 0) + (b.blogReviewCount ?? 0)
        return reviewB - reviewA || (Number(a.distance) || 9999) - (Number(b.distance) || 9999)
      })
    } else {
      list.sort((a, b) => (Number(a.distance) || 9999) - (Number(b.distance) || 9999))
    }
    return list
  }, [places, recommendations.counts, sortOption])

  const activePlaceIndex = activeIndex > 0 ? activeIndex - 1 : null
  const activePlaceId =
    activePlaceIndex !== null ? (sortedPlaces[activePlaceIndex]?.id ?? null) : null
  const { activeReviewIndex, reviewsByPlaceId } = usePlaceReviews(activePlaceId)
  const totalCards = sortedPlaces.length + 1

  const moveTo = useCallback(
    (index: number) => {
      const nextIndex = Math.min(Math.max(index, 0), totalCards - 1)
      const card = railRef.current?.children[nextIndex] as HTMLElement | undefined
      card?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      setActiveIndex(nextIndex)
    },
    [totalCards],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        dialogOpen ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        moveTo(activeIndex - 1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        moveTo(activeIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, dialogOpen, moveTo])

  const handleScroll = useCallback(() => {
    const rail = railRef.current
    if (!rail?.children.length) return

    const center = rail.scrollLeft + rail.clientWidth / 2
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY
    Array.from(rail.children).forEach((element, index) => {
      const card = element as HTMLElement
      const distance = Math.abs(center - (card.offsetLeft + card.offsetWidth / 2))
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })
    setActiveIndex(closestIndex)
  }, [])

  const changeSort = useCallback((option: PlaceSortOption) => {
    setSortOption(option)
    setActiveIndex(0)
    railRef.current?.scrollTo({ left: 0, behavior: 'smooth' })
  }, [])

  if (loading) {
    return (
      <div className="statusCard" role="status">
        <span className="loader" />
        <strong>살펴보는 중</strong>
        <p>사진과 방문자 후기를 가져오고 있어요.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="statusCard" role="alert">
        <span className="statusIcon">!</span>
        <strong>장소를 가져오지 못했어요</strong>
        <p>{error}</p>
      </div>
    )
  }

  if (places.length === 0) {
    return (
      <div className="statusCard">
        <span className="statusIcon">?</span>
        <strong>검색 결과가 없어요</strong>
        <p>후문 400m 안에서 찾은 장소가 없어요.</p>
      </div>
    )
  }

  return (
    <>
      <div className="placeRail" ref={railRef} onScroll={handleScroll}>
        <article className="placeCard introCard">
          <div className="mockCard" aria-hidden="true">
            <div className="mockCardInner">
              <div className="mockCardMark" />
              <div className="mockCardBody">
                <div className="mockTitle" />
                <div className="mockSub" />
              </div>
            </div>
          </div>

          <div className="introCardInner">
            <div className="introCardBg" aria-hidden="true" />
            <div className="introCardContent">
              <div className="introMarkWrap">
                <Image
                  src="/favicon.svg"
                  alt="후문한끼"
                  className="introMarkImg"
                  width={104}
                  height={104}
                  priority
                />
              </div>
              <div className="introCardMain">
                <h2 className="introBrandTitle">후문한끼</h2>
                <p className="introTagline">
                  {category.query === '카페'
                    ? '후문 400m, 공강 시간 & 카공 카페 모아보기.'
                    : '오늘 뭐 먹지? 후문 400m, 가까운 곳부터.'}
                </p>
              </div>
              <div className="introFeatureTips">
                <div className="introHeartTip">
                  <HeartIcon filled size={12} />
                  <span>
                    마음에 드는 곳에 <strong>하트</strong> (하루 3곳)
                  </span>
                </div>
              </div>
              <div className="introCardFooter">
                <button
                  type="button"
                  className="introExploreButton"
                  onClick={() => moveTo(1)}
                  aria-label="첫 번째 장소 둘러보기"
                >
                  <span>{category.query === '카페' ? '카페 둘러보기' : '음식점 둘러보기'}</span>
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </button>
                <button type="button" className="introSearchButton" onClick={onOpenMenuSearch}>
                  메뉴 검색
                </button>
              </div>
              <p className="introContact">
                문의 <a href="mailto:support_team@syu.kr">support_team@syu.kr</a>
              </p>
            </div>
          </div>
        </article>

        {sortedPlaces.map((place, placeIndex) => {
          const imageUrl = PLACE_IMAGE_OVERRIDES[place.id] ?? place.imageUrl
          const backgroundStyle = imageUrl
            ? ({ '--place-image': `url("${imageUrl}")` } as CSSProperties)
            : undefined
          const visitorReviews = formatCount(place.visitorReviewCount)
          const blogReviews = formatCount(place.blogReviewCount)
          const recommendationCount = recommendations.counts[place.id] ?? 0
          const recommendedToday = recommendations.dailyRecommendation.placeIds.includes(place.id)
          const reviewTexts = reviewsByPlaceId[place.id] ?? []
          const placeMenus = menusByPlaceId[place.id]?.menus ?? []
          const visibleReview =
            placeIndex + 1 === activeIndex && reviewTexts.length > 0
              ? reviewTexts[activeReviewIndex % reviewTexts.length]
              : null

          return (
            <article className={`placeCard ${imageUrl ? '' : 'noImage'}`} key={place.id}>
              <div className="placeCardImage" style={backgroundStyle} aria-hidden="true" />
              <div className="placeCardShade" />
              <div className="placeCardTop">
                <span>{place.category}</span>
                {place.microReview && <p className="microReview">“{place.microReview}”</p>}
              </div>
              {visibleReview && (
                <div className="visitorReviewTicker" aria-label="방문자 리뷰">
                  <p
                    className={reviewTexts.length > 1 ? 'rotating' : ''}
                    key={`${place.id}-${activeReviewIndex}`}
                  >
                    “{visibleReview}”
                  </p>
                </div>
              )}
              <div className="placeCardBody">
                <div className="placeMeta">
                  <span>후문에서 {formatDistance(place.distance)}</span>
                </div>
                <h2>{place.name}</h2>
                <div className="reviewRow">
                  {place.visitorReviewScore !== null && (
                    <span className="rating">★ {place.visitorReviewScore.toFixed(1)}</span>
                  )}
                  {visitorReviews && <span>방문자 리뷰 {visitorReviews}</span>}
                  {blogReviews && <span>블로그 리뷰 {blogReviews}</span>}
                </div>
                <p className="address">{place.roadAddress || place.address}</p>
                <div className="placeActions">
                  <a href={place.naverMapUrl} target="_blank" rel="noreferrer">
                    네이버맵 <span aria-hidden="true">↗</span>
                  </a>
                  {place.phone && <a href={`tel:${place.phone}`}>{place.phone}</a>}
                  {placeMenus.length > 0 && (
                    <button
                      type="button"
                      className="viewMenuButton"
                      onClick={() => onOpenMenus(place.id)}
                      aria-label={`${place.name} 메뉴 ${placeMenus.length}개 보기`}
                    >
                      메뉴 {placeMenus.length}
                    </button>
                  )}
                  <button
                    type="button"
                    className={`recommendButton ${recommendedToday ? 'recommended' : ''}`}
                    disabled={
                      recommendedToday ||
                      recommendations.dailyRecommendation.used ||
                      Boolean(recommendingPlaceId)
                    }
                    onClick={() => void onRecommend(place)}
                    aria-label={`${place.name} 추천 ${recommendationCount}개`}
                    title={
                      recommendedToday
                        ? '오늘 이미 추천한 식당이에요'
                        : recommendations.dailyRecommendation.used
                          ? `오늘 추천 가능 횟수(${recommendations.dailyRecommendation.limit || 3}곳)를 모두 사용했어요`
                          : `마음에 드는 곳에 하트! (오늘 남은 횟수: ${Math.max(
                              0,
                              (recommendations.dailyRecommendation.limit || 3) -
                                recommendations.dailyRecommendation.placeIds.length,
                            )}/${recommendations.dailyRecommendation.limit || 3})`
                    }
                  >
                    <HeartIcon filled={recommendedToday} />
                    <b>{recommendingPlaceId === place.id ? '…' : recommendationCount}</b>
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="railControls">
        <p className="railCounter">
          <strong>{activeIndex === 0 ? 'INTRO' : String(activeIndex).padStart(2, '0')}</strong>
          <span>/ {String(sortedPlaces.length).padStart(2, '0')}</span>
        </p>
        <div className="railSortBar" role="radiogroup" aria-label="식당 정렬">
          {(
            [
              ['distance', '거리순'],
              ['heart', '관심순'],
              ['review', '리뷰순'],
            ] as const
          ).map(([option, label]) => (
            <button
              type="button"
              key={option}
              className={`railSortChip ${sortOption === option ? 'active' : ''}`}
              onClick={() => changeSort(option)}
              role="radio"
              aria-checked={sortOption === option}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="railNavButtons">
          <button
            type="button"
            className="railNavButton"
            aria-label="이전 카드"
            disabled={activeIndex === 0}
            onClick={() => moveTo(activeIndex - 1)}
          >
            <ArrowLeftIcon />
          </button>
          <button
            type="button"
            className="railNavButton"
            aria-label="다음 카드"
            disabled={activeIndex === sortedPlaces.length}
            onClick={() => moveTo(activeIndex + 1)}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {recommendationMessage && (
        <p className="recommendationMessage" role="status">
          {recommendationMessage}
        </p>
      )}
    </>
  )
}
