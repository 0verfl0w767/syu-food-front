export type NaverPlace = {
  id: string
  name: string
  category: string
  roadAddress: string
  address: string
  phone: string
  distance: string
  visitorReviewCount: number | null
  blogReviewCount: number | null
  visitorReviewScore: number | null
  imageUrl: string | null
  imageUrls: string[]
  microReview: string | null
  naverMapUrl: string
}

export type NaverResponse = {
  meta: {
    totalCount: number
    cached: boolean
    ratingNotice: string
  }
  documents: NaverPlace[]
}

export type NaverReviewsResponse = {
  placeId: string
  placeName: string
  reviews: string[]
  meta: {
    cached: boolean
    notice: string
  }
}

export type RecommendationSummary = {
  counts: Record<string, number>
  dailyRecommendation: {
    used: boolean
    usedCount: number
    limit: number
    placeIds: string[]
  }
}

export type MenuItem = {
  name: string
  price: number | null
  priceType: string | null
  description: string | null
  imageUrl: string | null
  recommended: boolean
  category?: string | null
  cuisine?: string | null
}

export type PlaceMenus = {
  placeName: string
  menus: MenuItem[]
  menuImageAvailable: boolean
}

export type MenusResponse = {
  meta: {
    placeCount: number
    placesWithMenus: number
    totalMenuCount: number
    notice: string
  }
  places: Record<string, PlaceMenus>
}

export type EnrichedMenuItem = {
  id: string
  menu: MenuItem
  placeId: string
  placeName: string
  placeCategory: string
  distance: string
}

export type PlaceCardItem = {
  placeId: string
  placeName: string
  placeCategory: string
  distance: string
  imageUrl: string | null
  tags: {
    name: string
    price: number | null
    recommended: boolean
    isMatch: boolean
  }[]
  remainingCount: number
}

export type PlaceSortOption = 'distance' | 'heart' | 'review'

export const BACK_GATE = { x: 127.10926224864942, y: 37.64384622248226 }
export const MAX_DISTANCE_METERS = 400

export const categories = [
  { label: '후문 음식점', query: '음식점' },
  { label: '후문 카페', query: '카페' },
  { label: '메뉴 검색', query: '전체' },
] as const

export type PlaceCategory = (typeof categories)[number]

export const MENU_SUBCATEGORIES = [
  '전체',
  '밥류',
  '면류',
  '한식',
  '중식',
  '일식',
  '양식',
  '분식',
  '카페·디저트',
] as const

export type MenuSubcategory = (typeof MENU_SUBCATEGORIES)[number]

const NON_MEAL_MENU_CATEGORIES = new Set(['디저트류', '음료류', '주류'])

export function formatCount(value: number | null) {
  return value === null ? null : new Intl.NumberFormat('ko-KR').format(value)
}

export function formatDistance(value: string) {
  const meters = Number(value)
  if (!Number.isFinite(meters)) return '후문 근처'
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export function isCafeCategory(category: string) {
  return /카페|디저트|베이커리/.test(category)
}

export function normalizeMenuText(value: string) {
  return value.normalize('NFKC').replace(/\s+/g, '').toLocaleLowerCase('ko-KR')
}

export function isRandomMealCandidate(item: EnrichedMenuItem) {
  const category = item.menu.category?.trim()
  if (category) return !NON_MEAL_MENU_CATEGORIES.has(category)

  const menuName = normalizeMenuText(item.menu.name)
  return !/커피|라떼|콜드브루|에이드|주스|스무디|쉐이크|아이스티|밀크티|케이크|타르트|빙수|아이스크림|마카롱|쿠키|브라우니|티라미수|와플|크로플|소주|맥주|막걸리|하이볼|와인/.test(
    menuName,
  )
}

export function getCategoryEmoji(category: string, name: string): string {
  const target = `${category} ${name}`
  if (/중식|중국|중화|짜장|짬뽕/.test(target)) return '🍜'
  if (/일식|초밥|스시|돈가스|라멘/.test(target)) return '🍣'
  if (/카페|디저트|베이커리|커피/.test(target)) return '☕'
  if (/피자|파스타|양식|스테이크|버거/.test(target)) return '🍕'
  if (/분식|떡볶이/.test(target)) return '🍢'
  if (/치킨|통닭/.test(target)) return '🍗'
  if (/고기|삼겹살|갈비/.test(target)) return '🥩'
  if (/찌개|탕|국밥|감자탕/.test(target)) return '🍲'
  return '🍚'
}

export function getMenuEmoji(category?: string | null, name = ''): string {
  const target = `${category ?? ''} ${name}`.toLowerCase()
  if (/짜장|짬뽕|라멘|라면|면|우동|소바|모밀|국수|파스타|스파게티|쌀국수|팟타이/.test(target))
    return '🍜'
  if (/볶음밥|비빔밥|알밥|초밥|스시|김밥|솥밥|리조또|오므라이스|덮밥|밥류|밥/.test(target))
    return '🍚'
  if (/탕수|깐풍|라조|튀김|가라아게|카츠|돈까스|치킨|통닭/.test(target)) return '🍗'
  if (/만두|교자|춘권|딤섬/.test(target)) return '🥟'
  if (/찌개|탕|국|전골|나베|순두부|감자탕/.test(target)) return '🍲'
  if (/고기|삼겹|갈비|스테이크|구이|불고기/.test(target)) return '🥩'
  if (/피자/.test(target)) return '🍕'
  if (/버거|샌드위치|토스트/.test(target)) return '🥪'
  if (/떡볶이|순대|어묵|분식/.test(target)) return '🍢'
  if (/샐러드/.test(target)) return '🥗'
  if (/새우|해산물|생선|회|조개|낙지|오징어/.test(target)) return '🦐'
  if (/커피|라떼|에이드|주스|차|티|음료/.test(target)) return '☕'
  if (/디저트|케이크|와플|크로플|빙수|쿠키|베이커리|빵/.test(target)) return '🍰'
  if (/맥주|소주|주류|하이볼|와인/.test(target)) return '🍺'
  return '🍽️'
}

export function formatTagPrice(price: number | null | undefined): string | null {
  if (!price || price <= 0) return null
  if (price >= 1000) {
    return price % 1000 === 0 ? `${price / 1000}.0` : `${(price / 1000).toFixed(1)}`
  }
  return `${price}`
}

export function matchesMenuSubcategory(
  subcategory: MenuSubcategory,
  placeCategory: string,
  placeName: string,
  menu: MenuItem,
): boolean {
  if (subcategory === '전체') return true

  const category = menu.category || ''
  const cuisine = menu.cuisine || ''
  const menuName = (menu.name || '').toLowerCase()
  const placeMeta = `${(placeCategory || '').toLowerCase()} ${(placeName || '').toLowerCase()}`

  switch (subcategory) {
    case '밥류':
      if (category) {
        return (
          category === '밥류' ||
          category === '찌개·전골류' ||
          (category === '국·탕류' && !/잡탕|어묵탕|오뎅탕|조개탕|홍합탕/.test(menuName))
        )
      }
      if (/탕수|꿔바로우|버거|샌드위치/.test(menuName)) return false
      return /밥|덮밥|볶음밥|비빔밥|솥밥|컵밥|주먹밥|오므라이스|필라프|도리아|리조또|알밥|김밥|찌개|순두부|청국장|비지찌개|부대찌개|국밥|해장국|설렁탕|곰탕|갈비탕|추어탕|임자탕|삼계탕|감자탕/.test(
        menuName,
      )
    case '면류':
      if (category) return category === '면류'
      if (
        /(?:볶음밥|짜장밥|짬뽕밥|우동밥|잡채밥|국밥|알밥|덮밥|김밥|주먹밥|비빔밥)$/.test(menuName)
      )
        return false
      return /면|라멘|라면|파스타|스파게티|우동|국수|짬뽕|짜장|냉면|소바|모밀|칼국수|팟타이|쫄면|수제비|쌀국수|울면|마라면|마라탕|탄탄멘|아부라소바|마제소바|분짜|짬짜면|탕짜면|탕볶면|탕짬면|볶짬면|볶짜면/.test(
        menuName,
      )
    case '중식':
      return cuisine
        ? cuisine === '중식'
        : /중식|중국|중화|중국관|홍원|맛차이나|우육면/.test(placeMeta)
    case '일식':
      return cuisine
        ? cuisine === '일식'
        : /일식|일본|돈가스|초밥|스시|라멘|토리코코로|출구없는덮밥집|호또/.test(placeMeta)
    case '양식':
      if (cuisine) return cuisine === '양식' || category === '피자류'
      return /양식|이탈리아|피자|파스타|스테이크|도로시화덕피자|오렌지몽키|스테이564|맘스터치|샌두|에이펙스피자/.test(
        placeMeta,
      )
    case '분식':
      if (category === '분식류') return true
      if (cuisine === '중식' && /만두/.test(menuName)) return false
      return (
        /분식|떡볶이|꿈꾸는떡볶이|마녀떡볶이/.test(placeMeta) ||
        /떡볶이|라볶이|순대|튀김|오뎅|어묵|김밥|쫄면/.test(menuName)
      )
    case '카페·디저트':
      if (cuisine === '카페·디저트' || category === '디저트류' || category === '음료류') return true
      if (/냉면/.test(menuName)) return false
      return /카페|디저트|베이커리|커피|보나리베|카페공강|하이오|투썸|달콤|린스테이블|이디야|매머드|바글바글|스마일하우스|애버그린/.test(
        placeMeta,
      )
    case '한식':
      if (cuisine) return cuisine === '한식'
      if (/피자|파스타|스파게티|버거|샌드위치|핫도그|리조또/.test(menuName)) return false
      return /한식|고기|육류|찌개|국밥|갈비|닭갈비|하늘지기|다람이임자탕|세상만사 감자탕|최고집해물찜칼국수|담터추어탕|담터쭈꾸미|참맛집|스마일 닭갈비|직진닭강정|후라이드참잘하는집/.test(
        placeMeta,
      )
    default:
      return true
  }
}
