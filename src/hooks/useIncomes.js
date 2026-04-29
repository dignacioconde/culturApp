import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useIncomes(userId, { projectId = null, eventId = null, eventIds = null } = {}) {
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const eventIdsKey = eventIds?.length ? eventIds.slice().sort().join(',') : ''

  const fetchIncomes = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('incomes').select('*').eq('user_id', userId)

    if (projectId && eventIdsKey) {
      query = query.or(`project_id.eq.${projectId},event_id.in.(${eventIdsKey})`)
    } else if (projectId) {
      query = query.eq('project_id', projectId)
    } else if (eventId) {
      query = query.eq('event_id', eventId)
    }

    query = query.order('expected_date', { ascending: true })

    const { data, error } = await query
    if (error) setError(error)
    else setIncomes(data)
    setLoading(false)
  }, [userId, projectId, eventId, eventIdsKey])

  useEffect(() => {
    if (!userId) return
    queueMicrotask(fetchIncomes)
  }, [userId, fetchIncomes])

  const createIncome = async (incomeData) => {
    const { data, error } = await supabase
      .from('incomes')
      .insert({ ...incomeData, user_id: userId })
      .select()
      .single()

    if (!error) setIncomes((prev) => [...prev, data])
    return { data, error }
  }

  const updateIncome = async (id, incomeData) => {
    const { data, error } = await supabase
      .from('incomes')
      .update(incomeData)
      .eq('id', id)
      .select()
      .single()

    if (!error) setIncomes((prev) => prev.map((i) => (i.id === id ? data : i)))
    return { data, error }
  }

  const deleteIncome = async (id) => {
    const { error } = await supabase.from('incomes').delete().eq('id', id)
    if (!error) setIncomes((prev) => prev.filter((i) => i.id !== id))
    return { error }
  }

  return { incomes, loading, error, createIncome, updateIncome, deleteIncome, refetch: fetchIncomes }
}
