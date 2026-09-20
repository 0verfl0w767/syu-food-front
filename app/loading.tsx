export default function Loading() {
  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: '100vh',
        background: 'var(--paper, #f4f0e7)',
      }}
      role="status"
      aria-label="로딩 중"
    >
      <span className="loader" />
    </div>
  )
}
