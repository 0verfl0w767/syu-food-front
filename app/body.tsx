'use client'

import { useCallback, useMemo, useState } from 'react'

import { MenuBoard } from './components/menu-board'
import { MenuDialog } from './components/menu-dialog'
import { PlaceRail } from './components/place-rail'
import { useFoodData } from './hooks/use-food-data'
import { categories, type NaverPlace } from './lib/domain'

function BodyPage() {
  const [selectedCategory, setSelectedCategory] = useState<(typeof categories)[number]>(
    categories[0],
  )
  const [selectedMenuPlaceId, setSelectedMenuPlaceId] = useState<string | null>(null)
  const {
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
  } = useFoodData(selectedCategory)
  const isMenuTab = selectedCategory.label === '메뉴 검색'

  const selectedMenuPlace = useMemo(() => {
    if (!selectedMenuPlaceId) return null
    const place = places.find((item) => item.id === selectedMenuPlaceId)
    if (place) return place

    const menuData = menusByPlaceId[selectedMenuPlaceId]
    if (!menuData) return null
    return {
      id: selectedMenuPlaceId,
      name: menuData.placeName,
      category: '음식점',
      roadAddress: '',
      address: '',
      phone: '',
      distance: '',
      visitorReviewCount: null,
      blogReviewCount: null,
      visitorReviewScore: null,
      imageUrl: null,
      imageUrls: [],
      microReview: null,
      naverMapUrl: `https://map.naver.com/p/search/${encodeURIComponent(menuData.placeName)}`,
    } satisfies NaverPlace
  }, [menusByPlaceId, places, selectedMenuPlaceId])

  const changeCategory = useCallback((category: (typeof categories)[number]) => {
    setSelectedCategory(category)
    setSelectedMenuPlaceId(null)
  }, [])

  const openMenuSearch = useCallback(() => {
    const menuCategory = categories.find((category) => category.label === '메뉴 검색')
    if (menuCategory) changeCategory(menuCategory)
  }, [changeCategory])

  const openMenuDialog = useCallback((placeId: string) => setSelectedMenuPlaceId(placeId), [])
  const closeMenuDialog = useCallback(() => setSelectedMenuPlaceId(null), [])

  return (
    <section className="placeSection" aria-label="삼육대학교 후문 400m 이내 음식점과 카페">
      <div className="categorySwitch" aria-label="장소 종류">
        {categories.map((category) => (
          <button
            className={selectedCategory.label === category.label ? 'active' : ''}
            key={category.label}
            onClick={() => changeCategory(category)}
            aria-pressed={selectedCategory.label === category.label}
          >
            {category.label}
          </button>
        ))}
      </div>

      {isMenuTab ? (
        <MenuBoard
          menuLoadError={menuLoadError}
          menusByPlaceId={menusByPlaceId}
          places={places}
          onSelectPlace={openMenuDialog}
        />
      ) : (
        <PlaceRail
          key={selectedCategory.label}
          category={selectedCategory}
          dialogOpen={Boolean(selectedMenuPlace)}
          error={error}
          loading={loading}
          menusByPlaceId={menusByPlaceId}
          places={places}
          recommendationMessage={recommendationMessage}
          recommendations={recommendations}
          recommendingPlaceId={recommendingPlaceId}
          onOpenMenus={openMenuDialog}
          onOpenMenuSearch={openMenuSearch}
          onRecommend={recommendPlace}
        />
      )}

      {selectedMenuPlace && (
        <MenuDialog
          key={selectedMenuPlace.id}
          place={selectedMenuPlace}
          menus={menusByPlaceId[selectedMenuPlace.id]?.menus ?? []}
          notice={menusMeta?.notice}
          onClose={closeMenuDialog}
        />
      )}

      <footer className="siteFooter">
        <p>© 2026 SYU KR. All rights reserved.</p>
        <p>정보 제공: 네이버맵</p>
      </footer>
    </section>
  )
}

export default BodyPage
