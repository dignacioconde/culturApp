import { describe, expect, it } from 'vitest'
import {
  buildEmailConfirmationRedirect,
  DEFAULT_AUTH_REDIRECT_BASE_URL,
  resolveAuthRedirectBaseUrl,
} from './authRedirect'

describe('auth redirect helpers', () => {
  it('uses the production URL when no URL is configured', () => {
    expect(resolveAuthRedirectBaseUrl()).toBe(DEFAULT_AUTH_REDIRECT_BASE_URL)
    expect(resolveAuthRedirectBaseUrl('')).toBe(DEFAULT_AUTH_REDIRECT_BASE_URL)
  })

  it('keeps a valid public URL and removes trailing slash, query and hash', () => {
    expect(resolveAuthRedirectBaseUrl('https://app.caches.es/?foo=1#section')).toBe('https://app.caches.es')
  })

  it('falls back to production for localhost URLs by default', () => {
    expect(resolveAuthRedirectBaseUrl('http://localhost:5173')).toBe(DEFAULT_AUTH_REDIRECT_BASE_URL)
    expect(resolveAuthRedirectBaseUrl('http://127.0.0.1:5173')).toBe(DEFAULT_AUTH_REDIRECT_BASE_URL)
    expect(resolveAuthRedirectBaseUrl('http://0.0.0.0:5173')).toBe(DEFAULT_AUTH_REDIRECT_BASE_URL)
  })

  it('allows localhost only when explicitly requested', () => {
    expect(resolveAuthRedirectBaseUrl('http://localhost:5173', { allowLocalhost: true })).toBe('http://localhost:5173')
  })

  it('falls back to production for invalid URLs', () => {
    expect(resolveAuthRedirectBaseUrl('/login')).toBe(DEFAULT_AUTH_REDIRECT_BASE_URL)
    expect(resolveAuthRedirectBaseUrl('mailto:hola@caches.es')).toBe(DEFAULT_AUTH_REDIRECT_BASE_URL)
  })

  it('builds the email confirmation redirect', () => {
    expect(buildEmailConfirmationRedirect('https://app.caches.es')).toBe('https://app.caches.es/login?confirmed=1')
  })
})
