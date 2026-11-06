import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

export function useProjects(userId) {
  // Estos cambios de estado provocan un nuevo render de la página que usa el hook.
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // useCallback conserva esta función entre renders mientras no cambie userId.
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true })

    // El filtro limita la consulta y RLS en Supabase protege los datos en el servidor.
    if (error) setError(error)
    else setProjects(data)
    setLoading(false)
  }, [userId])

  useEffect(() => {
    if (!userId) return
    // Consultamos cuando ya conocemos al usuario o cambia la función de consulta.
    queueMicrotask(fetchProjects)
  }, [userId, fetchProjects])

  const createProject = async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...projectData, user_id: userId })
      .select()
      .single()

    // La forma funcional recibe el estado más reciente, incluso tras una operación asíncrona.
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
