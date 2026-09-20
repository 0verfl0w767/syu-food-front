'use client'

import { useCallback, useMemo, useState } from 'react'

import { useDialogFocus } from '../hooks/use-dialog-focus'
import {
  type MenuItem,
  type NaverPlace,
  formatCount,
  formatDistance,
  getMenuEmoji,
} from '../lib/domain'
import { CloseIcon } from './icons'

type MenuDialogProps = {
  place: NaverPlace
  menus: MenuItem[]
  notice?: string
  onClose: () => void
}

export function MenuDialog({ place, menus, notice, onClose }: MenuDialogProps) {
  const [category, setCategory] = useState('전체')
  const [search, setSearch] = useState('')
  const closeDialog = useCallback(() => onClose(), [onClose])
  const dialogRef = useDialogFocus(closeDialog)

  const categories = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of menus) {
      const itemCategory = item.category?.trim() || '기타'
      counts[itemCategory] = (counts[itemCategory] ?? 0) + 1
    }
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
  }, [menus])

  const filteredMenus = useMemo(() => {
    let list = menus
    if (category !== '전체') {
      list = list.filter((item) => (item.category?.trim() || '기타') === category)
    }
    const query = search.trim().toLocaleLowerCase('ko-KR')
    return query
      ? list.filter((item) => item.name.toLocaleLowerCase('ko-KR').includes(query))
      : list
  }, [category, menus, search])

  const groupedMenus = useMemo(() => {
    const groups: { category: string; items: MenuItem[] }[] = []
    const map = new Map<string, MenuItem[]>()
    for (const item of menus) {
      const itemCategory = item.category?.trim() || '기타'
      let items = map.get(itemCategory)
      if (!items) {
        items = []
        map.set(itemCategory, items)
        groups.push({ category: itemCategory, items })
      }
      items.push(item)
    }
    return groups
  }, [menus])

  const resetFilters = () => {
    setSearch('')
    setCategory('전체')
  }

  return (
    <div className="menuDialogBackdrop" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="menuDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-dialog-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="menuDialogHeader">
          <div className="menuDialogHeaderLeft">
            <div className="menuDialogMetaBadges">
              <span className="dialogPlaceCategory">{place.category}</span>
              {place.distance && (
                <span className="dialogPlaceDist">후문 {formatDistance(place.distance)}</span>
              )}
              {place.visitorReviewScore !== null && (
                <span className="dialogPlaceRating">★ {place.visitorReviewScore.toFixed(1)}</span>
              )}
              {place.visitorReviewCount !== null && (
                <span className="dialogPlaceReviews">
                  리뷰 {formatCount(place.visitorReviewCount)}
                </span>
              )}
            </div>
            <h2 id="menu-dialog-title" className="menuDialogTitle">
              {place.name}
            </h2>
            {(place.roadAddress || place.address) && (
              <p className="dialogPlaceAddress">
                {place.roadAddress || place.address}
                {place.phone && ` · ${place.phone}`}
              </p>
            )}
          </div>
          <button
            type="button"
            className="menuDialogCloseButton"
            onClick={onClose}
            aria-label="메뉴 닫기"
            data-dialog-initial-focus
          >
            <CloseIcon size={18} />
          </button>
        </header>

        <div className="menuDialogToolbar">
          <div className="dialogSearchField">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`${place.name} 메뉴 검색 (${menus.length}개)`}
              aria-label={`${place.name} 메뉴 검색`}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} aria-label="검색어 지우기">
                <CloseIcon size={13} />
              </button>
            )}
          </div>

          {categories.length > 1 && (
            <div className="dialogCategoryBar" aria-label="메뉴 분류 선택">
              <button
                type="button"
                aria-pressed={category === '전체'}
                className={`dialogCatButton ${category === '전체' ? 'active' : ''}`}
                onClick={() => setCategory('전체')}
              >
                전체 <span className="catCount">{menus.length}</span>
              </button>
              {categories.map(({ name, count }) => (
                <button
                  type="button"
                  key={name}
                  aria-pressed={category === name}
                  className={`dialogCatButton ${category === name ? 'active' : ''}`}
                  onClick={() => setCategory(name)}
                >
                  <span>
                    {getMenuEmoji(name)} {name}
                  </span>
                  <span className="catCount">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="menuDialogBody">
          {filteredMenus.length === 0 ? (
            <div className="dialogEmptyState">
              <span className="emptyIcon">?</span>
              <strong>&apos;{search}&apos; 검색 결과가 없어요</strong>
              <p>다른 키워드로 검색하거나 필터를 초기화해보세요.</p>
              <button type="button" onClick={resetFilters}>
                전체 메뉴 보기
              </button>
            </div>
          ) : category === '전체' && !search.trim() && groupedMenus.length > 1 ? (
            <div className="dialogGroupList">
              {groupedMenus.map((group) => (
                <section key={group.category} className="dialogSection">
                  <div className="dialogSectionHeader">
                    <span className="dialogSectionEmoji">{getMenuEmoji(group.category)}</span>
                    <h3 className="dialogSectionTitle">{group.category}</h3>
                    <span className="dialogSectionCount">{group.items.length}</span>
                  </div>
                  <MenuCards menus={group.items} fallbackCategory={group.category} />
                </section>
              ))}
            </div>
          ) : (
            <MenuCards menus={filteredMenus} />
          )}
        </div>

        <footer>
          <p>{notice || '네이버 플레이스 등록 정보 기준이며 실제 메뉴·가격과 다를 수 있습니다.'}</p>
          <a href={place.naverMapUrl} target="_blank" rel="noreferrer">
            네이버맵에서 확인 <span aria-hidden="true">↗</span>
          </a>
        </footer>
      </section>
    </div>
  )
}

function MenuCards({ menus, fallbackCategory }: { menus: MenuItem[]; fallbackCategory?: string }) {
  return (
    <div className="dialogCardsGrid">
      {menus.map((menu, index) => {
        const category = menu.category || fallbackCategory || '메뉴'
        return (
          <div className="dialogMenuCard" key={`${menu.name}-${index}`}>
            <div className="dialogMenuCardTop">
              <span className="dialogMenuCardEmoji">{getMenuEmoji(category, menu.name)}</span>
              <strong className="dialogMenuCardTitle">{menu.name}</strong>
              {menu.recommended && <span className="dialogRecommendedBadge">추천</span>}
            </div>
            {menu.description && <p className="dialogMenuCardDesc">{menu.description}</p>}
            <div className="dialogMenuCardBottom">
              {menu.price ? (
                <span className="dialogMenuCardPrice">{menu.price.toLocaleString()}원</span>
              ) : (
                <span className="dialogMenuCardCategoryTag">{category}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
