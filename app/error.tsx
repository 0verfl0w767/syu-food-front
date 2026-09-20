'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="routeStatePage">
      <section className="routeStateCard" role="alert">
        <span aria-hidden="true">!</span>
        <h1>화면을 불러오지 못했어요</h1>
        <p>잠시 후 다시 시도해주세요.</p>
        <button type="button" onClick={reset}>
          다시 시도
        </button>
      </section>
    </main>
  )
}
