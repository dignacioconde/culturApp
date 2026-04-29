import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useProjects(userId) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true })

    if (error) setError(error)
    else setProjects(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    queueMicrotask(fetchProjects)
  }, [userId, fetchProjects])

  const createProject = async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...projectData, user_id: userId })
      .select()
      .single()

    if (!error) setProjects((prev) => [...prev, data])
    return { data, error }
  }

  const updateProject = async (id, projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single()

    if (!error) setProjects((prev) => prev.map((p) => (p.id === id ? data : p)))
    return { data, error }
  }

  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) setProjects((prev) => prev.filter((p) => p.id !== id))
    return { error }
  }

  return { projects, loading, error, createProject, updateProject, deleteProject, refetch: fetchProjects }
}
