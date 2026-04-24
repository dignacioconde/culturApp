import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useExpenses(userId, { projectId = null, eventId = null, eventIds = null } = {}) {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const eventIdsKey = eventIds?.length ? eventIds.slice().sort().join(',') : ''

  const fetchExpenses = useCallback(async () => {
    setLoading(true)
    let query = supabase.from('expenses').select('*').eq('user_id', userId)

    if (projectId && eventIdsKey) {
      query = query.or(`project_id.eq.${projectId},event_id.in.(${eventIdsKey})`)
    } else if (projectId) {
      query = query.eq('project_id', projectId)
    } else if (eventId) {
      query = query.eq('event_id', eventId)
    }

    query = query.order('expense_date', { ascending: true })

    const { data, error } = await query
    if (error) setError(error)
    else setExpenses(data)
    setLoading(false)
  }, [userId, projectId, eventId, eventIdsKey])

  useEffect(() => {
    if (!userId) return
    fetchExpenses()
  }, [userId, fetchExpenses])

  const createExpense = async (expenseData) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...expenseData, user_id: userId })
      .select()
      .single()

    if (!error) setExpenses((prev) => [...prev, data])
    return { data, error }
  }

  const updateExpense = async (id, expenseData) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(expenseData)
      .eq('id', id)
      .select()
      .single()

    if (!error) setExpenses((prev) => prev.map((e) => (e.id === id ? data : e)))
    return { data, error }
  }

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) setExpenses((prev) => prev.filter((e) => e.id !== id))
    return { error }
  }

  return { expenses, loading, error, createExpense, updateExpense, deleteExpense, refetch: fetchExpenses }
}
