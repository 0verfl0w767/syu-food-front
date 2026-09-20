import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="routeStatePage">
      <section className="routeStateCard">
        <span aria-hidden="true">404</span>
        <h1>페이지를 찾을 수 없어요</h1>
        <p>주소를 다시 확인하거나 메인 화면으로 돌아가주세요.</p>
        <Link href="/">메인 화면으로</Link>
      </section>
    </main>
  )
}
