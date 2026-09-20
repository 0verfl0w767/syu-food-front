'use client'

import { type CSSProperties, useCallback, useMemo, useState } from 'react'

import {
  MAX_DISTANCE_METERS,
  MENU_SUBCATEGORIES,
  formatDistance,
  formatTagPrice,
  getCategoryEmoji,
  isRandomMealCandidate,
  matchesMenuSubcategory,
  normalizeMenuText,
  type EnrichedMenuItem,
  type MenuSubcategory,
  type NaverPlace,
  type PlaceCardItem,
  type PlaceMenus,
} from '../lib/domain'
import { PLACE_IMAGE_OVERRIDES } from '../place-image-overrides'
import { CloseIcon, DiceIcon } from './icons'
import { RandomMenuDialog } from './random-menu-dialog'

type MenuBoardProps = {
  menuLoadError: string
  menusByPlaceId: Record<string, PlaceMenus>
  places: NaverPlace[]
  onSelectPlace: (placeId: string) => void
}

export function MenuBoard({
  menuLoadError,
  menusByPlaceId,
  places,
  onSelectPlace,
}: MenuBoardProps) {
  const [menuSearch, setMenuSearch] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<MenuSubcategory>('전체')
  const [visiblePlaceLimit, setVisiblePlaceLimit] = useState(15)
  const [randomPickedItem, setRandomPickedItem] = useState<EnrichedMenuItem | null>(null)
  const normalizedMenuSearch = normalizeMenuText(menuSearch)

  const allEnrichedMenus = useMemo(() => {
    const placeMap = new Map(places.map((place) => [place.id, place]))
    const menus: EnrichedMenuItem[] = []

    Object.entries(menusByPlaceId).forEach(([placeId, placeMenuData]) => {
      const place = placeMap.get(placeId)
      if (!place) return
      const meters = Number(place.distance)
      if (Number.isFinite(meters) && meters > MAX_DISTANCE_METERS) return

      placeMenuData.menus.forEach((menu, index) => {
        menus.push({
          id: `${placeId}-${index}`,
          menu,
          placeId,
          placeName: place.name || placeMenuData.placeName,
          placeCategory: place.category || '',
          distance: place.distance || '',
        })
      })
    })

    return menus
  }, [menusByPlaceId, places])

  const filteredMenus = useMemo(
    () =>
      allEnrichedMenus.filter((item) => {
        if (
          selectedSubcategory !== '전체' &&
          !matchesMenuSubcategory(
            selectedSubcategory,
            item.placeCategory,
            item.placeName,
            item.menu,
          )
        ) {
          return false
        }
        if (!normalizedMenuSearch) return true
        return normalizeMenuText(`${item.menu.name} ${item.placeName}`).includes(
          normalizedMenuSearch,
        )
      }),
    [allEnrichedMenus, normalizedMenuSearch, selectedSubcategory],
  )

  const groupedPlaceMenus = useMemo(() => {
    const placeMap = new Map(places.map((place) => [place.id, place]))
    const result: PlaceCardItem[] = []

    Object.entries(menusByPlaceId).forEach(([placeId, placeMenuData]) => {
      const place = placeMap.get(placeId)
      if (!place) return
      const meters = Number(place.distance)
      if (Number.isFinite(meters) && meters > MAX_DISTANCE_METERS) return

      const placeName = place.name || placeMenuData.placeName
      const placeCategory = place.category || '음식점'
      const matchingMenus = [] as typeof placeMenuData.menus
      const otherMenus = [] as typeof placeMenuData.menus

      placeMenuData.menus.forEach((menu) => {
        const matchesSubcategory =
          selectedSubcategory === '전체' ||
          matchesMenuSubcategory(selectedSubcategory, placeCategory, placeName, menu)
        const matchesSearch =
          !normalizedMenuSearch ||
          normalizeMenuText(`${menu.name} ${placeName}`).includes(normalizedMenuSearch)
        ;(matchesSubcategory && matchesSearch ? matchingMenus : otherMenus).push(menu)
      })

      const hasFilter = selectedSubcategory !== '전체' || Boolean(normalizedMenuSearch)
      if (hasFilter && matchingMenus.length === 0) return

      const tags: PlaceCardItem['tags'] = []
      const seenNames = new Set<string>()
      for (const [menuList, isMatch] of [
        [matchingMenus, hasFilter],
        [otherMenus, false],
      ] as const) {
        menuList.forEach((menu) => {
          if (tags.length >= 8 || seenNames.has(menu.name)) return
          seenNames.add(menu.name)
          tags.push({
            name: menu.name,
            price: menu.price,
            recommended: menu.recommended,
            isMatch,
          })
        })
      }

      result.push({
        placeId,
        placeName,
        placeCategory,
        distance: place.distance || '',
        imageUrl: PLACE_IMAGE_OVERRIDES[placeId] ?? place.imageUrl,
        tags,
        remainingCount: Math.max(0, placeMenuData.menus.length - tags.length),
      })
    })

    return result.sort((a, b) => (Number(a.distance) || 9999) - (Number(b.distance) || 9999))
  }, [menusByPlaceId, normalizedMenuSearch, places, selectedSubcategory])

  const displayedPlaces = groupedPlaceMenus.slice(0, visiblePlaceLimit)

  const resetVisiblePlaces = useCallback(() => setVisiblePlaceLimit(15), [])
  const updateMenuSearch = useCallback(
    (value: string) => {
      setMenuSearch(value)
      resetVisiblePlaces()
    },
    [resetVisiblePlaces],
  )
  const updateSubcategory = useCallback(
    (subcategory: MenuSubcategory) => {
      setSelectedSubcategory(subcategory)
      resetVisiblePlaces()
    },
    [resetVisiblePlaces],
  )
  const resetFilters = useCallback(() => {
    setMenuSearch('')
    setSelectedSubcategory('전체')
    resetVisiblePlaces()
  }, [resetVisiblePlaces])

  const pickRandomMenu = useCallback(() => {
    const filteredMeals = filteredMenus.filter(isRandomMealCandidate)
    const allMeals = allEnrichedMenus.filter(isRandomMealCandidate)
    const pool = filteredMeals.length > 0 ? filteredMeals : allMeals
    if (pool.length === 0) return

    let nextItem = pool[Math.floor(Math.random() * pool.length)]
    for (let attempt = 0; pool.length > 1 && nextItem.id === randomPickedItem?.id; attempt += 1) {
      nextItem = pool[Math.floor(Math.random() * pool.length)]
      if (attempt >= 8) break
    }
    setRandomPickedItem(nextItem)
  }, [allEnrichedMenus, filteredMenus, randomPickedItem?.id])

  const closeRandomDialog = useCallback(() => setRandomPickedItem(null), [])
  const viewRandomPlace = useCallback(
    (placeId: string) => {
      closeRandomDialog()
      onSelectPlace(placeId)
    },
    [closeRandomDialog, onSelectPlace],
  )

  return (
    <div className="menuBoard">
      <div className="menuFinder">
        <div className="menuSearchField">
          <span aria-hidden="true">⌕</span>
          <input
            id="menu-search"
            type="search"
            value={menuSearch}
            onChange={(event) => updateMenuSearch(event.target.value)}
            placeholder="찌개, 덮밥, 파스타…"
            aria-label="메뉴 검색"
          />
          {menuSearch && (
            <button
              type="button"
              onClick={() => updateMenuSearch('')}
              aria-label="메뉴 검색 지우기"
            >
              <CloseIcon size={14} />
            </button>
          )}
        </div>
        <div className="menuSubcategoryBar" role="tablist" aria-label="메뉴 분류">
          {MENU_SUBCATEGORIES.map((subcategory) => (
            <button
              type="button"
              key={subcategory}
              role="tab"
              aria-selected={selectedSubcategory === subcategory}
              className={`subcategoryButton ${selectedSubcategory === subcategory ? 'active' : ''}`}
              onClick={() => updateSubcategory(subcategory)}
            >
              {subcategory}
            </button>
          ))}
        </div>
        <div className="menuFinderToolbar">
          <p id="menu-search-summary" role="status">
            {menuLoadError
              ? '메뉴를 불러오지 못했어요.'
              : groupedPlaceMenus.length === 0
                ? '일치하는 메뉴가 없어요.'
                : `${selectedSubcategory !== '전체' ? `${selectedSubcategory} · ` : ''}${
                    normalizedMenuSearch ? `‘${menuSearch.trim()}’ 검색 ` : ''
                  }식당 ${groupedPlaceMenus.length}곳 · 메뉴 ${filteredMenus.length}개`}
          </p>
          {allEnrichedMenus.length > 0 && (
            <button
              type="button"
              className="randomPickButton"
              onClick={pickRandomMenu}
              aria-label="랜덤 식사 메뉴 뽑기"
            >
              <DiceIcon size={14} />
              <span>랜덤 뽑기</span>
            </button>
          )}
        </div>
      </div>

      {groupedPlaceMenus.length === 0 ? (
        <div className="statusCard menuEmptyState">
          <span className="statusIcon">?</span>
          <strong>일치하는 메뉴가 없어요</strong>
          <p>다른 메뉴명이나 분류를 선택해보세요.</p>
          {(menuSearch || selectedSubcategory !== '전체') && (
            <button type="button" onClick={resetFilters}>
              전체 메뉴 보기
            </button>
          )}
        </div>
      ) : (
        <div className="menuPlaceList">
          {displayedPlaces.map((item) => {
            const categoryEmoji = getCategoryEmoji(item.placeCategory, item.placeName)
            const thumbnailStyle = item.imageUrl
              ? ({ backgroundImage: `url("${item.imageUrl}")` } as CSSProperties)
              : undefined

            return (
              <article
                className="menuPlaceCard"
                key={item.placeId}
                onClick={() => onSelectPlace(item.placeId)}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelectPlace(item.placeId)
                  }
                }}
              >
                <div
                  className={`menuPlaceThumb ${!item.imageUrl ? 'noImage' : ''}`}
                  style={thumbnailStyle}
                  aria-label={`${item.placeName} 사진`}
                >
                  {!item.imageUrl && <span className="menuPlaceThumbEmoji">{categoryEmoji}</span>}
                </div>
                <div className="menuPlaceBody">
                  <header className="menuPlaceHeader">
                    <div className="menuPlaceTitleRow">
                      <strong className="menuPlaceName">{item.placeName}</strong>
                      <span className="menuPlaceCategory">{item.placeCategory}</span>
                    </div>
                    {item.distance && (
                      <span className="menuPlaceDist">후문 {formatDistance(item.distance)}</span>
                    )}
                  </header>
                  <div className="menuTagList">
                    {item.tags.map((tag, index) => {
                      const priceText = formatTagPrice(tag.price)
                      return (
                        <span
                          key={`${tag.name}-${index}`}
                          className={`menuTagChip ${tag.isMatch ? 'highlight' : ''} ${
                            tag.recommended ? 'recommended' : ''
                          }`}
                        >
                          <span className="tagHash">#</span>
                          <span className="tagName">{tag.name}</span>
                          {priceText && <span className="tagPrice">{priceText}</span>}
                        </span>
                      )
                    })}
                    {item.remainingCount > 0 && (
                      <span className="menuTagMoreChip">+{item.remainingCount}개 더보기</span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
          {groupedPlaceMenus.length > displayedPlaces.length && (
            <div className="loadMoreContainer">
              <button
                type="button"
                className="loadMoreMenusButton"
                onClick={() => setVisiblePlaceLimit((current) => current + 15)}
              >
                식당 더보기 (+{Math.min(15, groupedPlaceMenus.length - displayedPlaces.length)})
              </button>
            </div>
          )}
        </div>
      )}

      {randomPickedItem && (
        <RandomMenuDialog
          item={randomPickedItem}
          selectedSubcategory={selectedSubcategory}
          onClose={closeRandomDialog}
          onReroll={pickRandomMenu}
          onViewPlace={viewRandomPlace}
        />
      )}
    </div>
  )
}
