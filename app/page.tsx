import BodyPage from './body'

export default function Page() {
  return (
    <main className="homePage">
      <div className="seoIntro">
        <h1>삼육대학교 후문 맛집·카페 추천, 후문한끼</h1>
        <p>
          삼육대 후문 400m 이내의 음식점과 카페를 메뉴로 검색하고 거리, 사진, 전체 메뉴·가격, 방문자
          후기와 함께 탐색해보세요.
        </p>
      </div>
      <BodyPage />
    </main>
  )
}
