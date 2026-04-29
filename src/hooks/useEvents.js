import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useEvents(userId, projectId = null) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)

    if (projectId) query = query.eq('project_id', projectId)

    query = query.order('start_datetime', { ascending: true })

    const { data, error } = await query
    if (error) setError(error)
    else setEvents(data)
    setLoading(false)
  }, [userId, projectId])

  useEffect(() => {
    if (!userId) return
    queueMicrotask(fetchEvents)
  }, [userId, fetchEvents])

  const createEvent = async (eventData) => {
    const { data, error } = await supabase
      .from('events')
      .insert({ ...eventData, user_id: userId })
      .select()
      .single()

    if (!error) setEvents((prev) => [...prev, data].sort((a, b) =>
      a.start_datetime.localeCompare(b.start_datetime)
    ))
    return { data, error }
  }

  const updateEvent = async (id, eventData) => {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', id)
      .select()
      .single()

    if (!error) setEvents((prev) => prev.map((e) => (e.id === id ? data : e)))
    return { data, error }
  }

  const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (!error) setEvents((prev) => prev.filter((e) => e.id !== id))
    return { error }
  }

  return { events, loading, error, createEvent, updateEvent, deleteEvent, refetch: fetchEvents }
}
