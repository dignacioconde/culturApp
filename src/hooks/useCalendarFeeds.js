import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const providerLabels = {
  apple: 'Apple Calendar',
  google: 'Google Calendar',
  outlook: 'Outlook',
  other: 'Otro calendario',
}

function feedError(message) {
  return { message }
}

export function buildCalendarFeedUrls(feedToken) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  if (!supabaseUrl || !feedToken) return null

  const httpsUrl = `${supabaseUrl.replace(/\/$/, '')}/functions/v1/calendar-feed?token=${encodeURIComponent(feedToken)}`
  return {
    httpsUrl,
    webcalUrl: httpsUrl.replace(/^https:/, 'webcal:'),
  }
}

export function useCalendarFeeds(userId) {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [creatingProvider, setCreatingProvider] = useState(null)
  const [revokingId, setRevokingId] = useState(null)
  const [error, setError] = useState(null)
  const [createdLinks, setCreatedLinks] = useState({})

  const fetchFeeds = useCallback(async () => {
    if (!userId) {
      setFeeds([])
      setLoading(false)
      return { data: [], error: null }
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('calendar_feeds')
      .select('id,label,provider,scope,revoked_at,last_accessed_at,created_at')
      .eq('user_id', userId)
      .is('revoked_at', null)
      .order('created_at', { ascending: false })

    setLoading(false)
    if (error) {
      setError(error)
      return { data: null, error }
    }

    setError(null)
    setFeeds(data ?? [])
    return { data: data ?? [], error: null }
  }, [userId])

  useEffect(() => {
    queueMicrotask(fetchFeeds)
  }, [fetchFeeds])

  const createFeed = useCallback(async (provider) => {
    if (!userId) return { data: null, error: feedError('Necesitas iniciar sesión para crear un enlace.') }

    const providerLabel = providerLabels[provider] ?? providerLabels.other
    setCreatingProvider(provider)
    const { data, error } = await supabase.rpc('create_calendar_feed', {
      feed_provider: provider,
      feed_label: `Cachés - Agenda (${providerLabel})`,
    })
    setCreatingProvider(null)

    if (error) {
      setError(error)
      return { data: null, error }
    }

    const feed = data?.[0]
    const urls = buildCalendarFeedUrls(feed?.feed_token)
    const safeFeed = feed ? {
      id: feed.id,
      label: feed.label,
      provider: feed.provider,
      scope: feed.scope,
      created_at: feed.created_at,
      revoked_at: null,
      last_accessed_at: null,
    } : null

    if (safeFeed) {
      setFeeds((current) => [safeFeed, ...current])
      if (urls) {
        setCreatedLinks((current) => ({ ...current, [safeFeed.id]: urls }))
      }
    }

    setError(null)
    return { data: safeFeed ? { feed: safeFeed, urls } : null, error: null }
  }, [userId])

  const revokeFeed = useCallback(async (feedId) => {
    if (!userId) return { data: null, error: feedError('Necesitas iniciar sesión para desactivar un enlace.') }

    setRevokingId(feedId)
    const { data, error } = await supabase.rpc('revoke_calendar_feed', { feed_id: feedId })
    setRevokingId(null)

    if (error) {
      setError(error)
      return { data: null, error }
    }

    const revoked = data?.[0]
    setFeeds((current) => current.filter((feed) => feed.id !== feedId))
    setCreatedLinks((current) => {
      const next = { ...current }
      delete next[feedId]
      return next
    })
    setError(null)

    return { data: revoked, error: null }
  }, [userId])

  return {
    feeds,
    loading,
    creatingProvider,
    revokingId,
    error,
    createdLinks,
    createFeed,
    revokeFeed,
    refetch: fetchFeeds,
  }
}
