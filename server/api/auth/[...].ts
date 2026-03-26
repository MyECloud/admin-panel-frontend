export default defineEventHandler(async (event) => {
  const apiBaseURL = process.env.NUXT_PUBLIC_API_BASE_URL

  if (!apiBaseURL) {
    throw createError({
      statusCode: 500,
      statusMessage: 'NUXT_PUBLIC_API_BASE_URL is not configured'
    })
  }

  const path = getRouterParam(event, '_')
  const query = getQuery(event)
  const queryString = new URLSearchParams(query as Record<string, string>).toString()
  const targetURL = `${apiBaseURL}/${path}${queryString ? `?${queryString}` : ''}`

  const authHeader = getRequestHeader(event, 'authorization')
  console.log(`[Auth Proxy] ${event.method} ${targetURL} | Auth: ${authHeader ? 'Bearer ***' : 'NONE'}`)

  return proxyRequest(event, targetURL)
})
