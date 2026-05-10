export const DEFAULT_AUTH_REDIRECT_BASE_URL = 'https://culturapp-rho.vercel.app'

function isLocalHostname(hostname) {
  const normalizedHostname = hostname.toLowerCase()

  return (
    normalizedHostname === 'localhost' ||
    normalizedHostname === '0.0.0.0' ||
    normalizedHostname === '::1' ||
    normalizedHostname === '[::1]' ||
    normalizedHostname.startsWith('127.') ||
    normalizedHostname.endsWith('.localhost')
  )
}

export function resolveAuthRedirectBaseUrl(rawBaseUrl, { allowLocalhost = false } = {}) {
  const configuredBaseUrl = typeof rawBaseUrl === 'string' ? rawBaseUrl.trim() : ''

  if (!configuredBaseUrl) {
    return DEFAULT_AUTH_REDIRECT_BASE_URL
  }

  try {
    const parsedBaseUrl = new URL(configuredBaseUrl)

    if (parsedBaseUrl.protocol !== 'https:' && parsedBaseUrl.protocol !== 'http:') {
      return DEFAULT_AUTH_REDIRECT_BASE_URL
    }

    if (!allowLocalhost && isLocalHostname(parsedBaseUrl.hostname)) {
      return DEFAULT_AUTH_REDIRECT_BASE_URL
    }

    parsedBaseUrl.search = ''
    parsedBaseUrl.hash = ''

    return parsedBaseUrl.toString().replace(/\/$/, '')
  } catch {
    return DEFAULT_AUTH_REDIRECT_BASE_URL
  }
}

export function buildEmailConfirmationRedirect(baseUrl) {
  return `${baseUrl}/login?confirmed=1`
}
