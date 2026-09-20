const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (process.env.NODE_ENV === 'production' ? 'https://food.syu.kr' : 'http://localhost:4002')

const REQUEST_TIMEOUT_MS = 10_000

function getErrorMessage(data: unknown, fallbackMessage: string) {
  if (!data || typeof data !== 'object') return fallbackMessage
  const record = data as Record<string, unknown>
  if (typeof record.detail === 'string') return record.detail
  if (typeof record.message === 'string') return record.message
  return fallbackMessage
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  fallbackMessage = '요청을 처리하지 못했어요.',
): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort('timeout'), REQUEST_TIMEOUT_MS)
  const externalSignal = options.signal
  const relayAbort = () => controller.abort(externalSignal?.reason)

  if (externalSignal?.aborted) relayAbort()
  else externalSignal?.addEventListener('abort', relayAbort, { once: true })

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
    })

    const contentType = response.headers.get('content-type') || ''
    const data = contentType.includes('application/json') ? await response.json() : null

    if (!response.ok) throw new Error(getErrorMessage(data, fallbackMessage))
    if (data === null) throw new Error(fallbackMessage)
    return data as T
  } catch (error) {
    if (controller.signal.reason === 'timeout') {
      throw new Error('서버 응답이 늦어지고 있어요. 잠시 후 다시 시도해주세요.')
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
    externalSignal?.removeEventListener('abort', relayAbort)
  }
}
