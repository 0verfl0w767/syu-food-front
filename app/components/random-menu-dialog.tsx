'use client'

import { useCallback } from 'react'

import { useDialogFocus } from '../hooks/use-dialog-focus'
import { type EnrichedMenuItem, type MenuSubcategory, formatDistance } from '../lib/domain'
import { CloseIcon, DiceIcon, ExternalLinkIcon, RefreshIcon } from './icons'

type RandomMenuDialogProps = {
  item: EnrichedMenuItem
  selectedSubcategory: MenuSubcategory
  onClose: () => void
  onReroll: () => void
  onViewPlace: (placeId: string) => void
}

export function RandomMenuDialog({
  item,
  selectedSubcategory,
  onClose,
  onReroll,
  onViewPlace,
}: RandomMenuDialogProps) {
  const closeDialog = useCallback(() => onClose(), [onClose])
  const dialogRef = useDialogFocus(closeDialog)

  return (
    <div className="randomModalBackdrop" onMouseDown={onClose}>
      <section
        ref={dialogRef}
        className="randomModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="random-modal-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="randomModalHeader">
          <div className="randomBadge">
            <DiceIcon size={14} />
            <span>랜덤 메뉴 뽑기</span>
          </div>
          <button
            type="button"
            className="randomCloseButton"
            onClick={onClose}
            aria-label="닫기"
            data-dialog-initial-focus
          >
            <CloseIcon size={16} />
          </button>
        </header>

        <div className="randomModalBody">
          <span className="randomSubcategoryTag">
            {selectedSubcategory !== '전체' && selectedSubcategory !== '카페·디저트'
              ? `${selectedSubcategory} 추천`
              : '오늘의 한 끼 추천'}
          </span>
          <h2 id="random-modal-title" className="randomMenuName">
            {item.menu.name}
          </h2>
          <div className="randomPlaceInfo">
            <span className="randomPlaceName">{item.placeName}</span>
            {item.distance && (
              <>
                <span className="randomPlaceDivider">·</span>
                <span className="randomPlaceDistance">후문 {formatDistance(item.distance)}</span>
              </>
            )}
          </div>
        </div>

        <footer className="randomModalActions">
          <button type="button" className="randomRerollButton" onClick={onReroll}>
            <RefreshIcon size={15} />
            <span>다시 뽑기</span>
          </button>
          <button
            type="button"
            className="randomViewPlaceButton"
            onClick={() => onViewPlace(item.placeId)}
          >
            <span>가게 메뉴 보기</span>
            <ExternalLinkIcon size={14} />
          </button>
        </footer>
      </section>
    </div>
  )
}
