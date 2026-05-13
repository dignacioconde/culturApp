import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { normalizeContractorName } from '../lib/contractors'

const CONTRACTOR_SELECT = 'id,user_id,name,billing_name,tax_id,email,phone,billing_address,notes,created_at'

export function isContractorsSchemaMissing(error) {
  const message = `${error?.message ?? ''} ${error?.details ?? ''}`.toLowerCase()
  return error?.code === '42P01' ||
    error?.code === '42703' ||
    error?.code === 'PGRST204' ||
    error?.code === 'PGRST205' ||
    message.includes('contractors') && (
      message.includes('does not exist') ||
      message.includes('schema cache') ||
      message.includes('could not find')
    )
}

function portabilityError(message) {
  return { message }
}

function cleanText(value) {
  const trimmed = String(value ?? '').trim()
  return trimmed === '' ? null : trimmed
}

function sanitizeContractorData(contractorData) {
  const rest = { ...(contractorData ?? {}) }
  delete rest.user_id
  delete rest.id
  delete rest.created_at

  return {
    name: String(rest.name ?? '').trim(),
    billing_name: cleanText(rest.billing_name),
    tax_id: cleanText(rest.tax_id),
    email: cleanText(rest.email),
    phone: cleanText(rest.phone),
    billing_address: cleanText(rest.billing_address),
    notes: cleanText(rest.notes),
  }
}

function sortContractors(rows = []) {
  return [...rows].sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }))
}

export function useContractors(userId) {
  const [contractors, setContractors] = useState([])
  const [loading, setLoading] = useState(Boolean(userId))
  const [error, setError] = useState(null)

  const fetchContractors = useCallback(async () => {
    if (!userId) {
      setContractors([])
      setLoading(false)
      return { data: [], error: null }
    }

    setLoading(true)
    const { data, error } = await supabase
      .from('contractors')
      .select(CONTRACTOR_SELECT)
      .eq('user_id', userId)
      .order('name', { ascending: true })

    if (error) {
      setError(error)
      setLoading(false)
      return { data: null, error }
    }

    const nextContractors = sortContractors(data ?? [])
    setContractors(nextContractors)
    setError(null)
    setLoading(false)
    return { data: nextContractors, error: null }
  }, [userId])

  useEffect(() => {
    queueMicrotask(fetchContractors)
  }, [fetchContractors])

  const createContractor = async (contractorData) => {
    if (!userId) return { data: null, error: portabilityError('Necesitas una sesión activa.') }

    const payload = sanitizeContractorData(contractorData)
    if (!payload.name) return { data: null, error: portabilityError('Pon un nombre para el contratante.') }

    const { data, error } = await supabase
      .from('contractors')
      .insert({ ...payload, user_id: userId })
      .select(CONTRACTOR_SELECT)
      .single()

    if (!error) setContractors((prev) => sortContractors([...prev, data]))
    return { data, error }
  }

  const updateContractor = async (id, contractorData) => {
    const payload = sanitizeContractorData(contractorData)
    if (!payload.name) return { data: null, error: portabilityError('Pon un nombre para el contratante.') }

    const { data, error } = await supabase
      .from('contractors')
      .update(payload)
      .eq('id', id)
      .select(CONTRACTOR_SELECT)
      .single()

    if (!error) setContractors((prev) => sortContractors(prev.map((contractor) => (contractor.id === id ? data : contractor))))
    return { data, error }
  }

  const deleteContractor = async (id) => {
    const { error } = await supabase.from('contractors').delete().eq('id', id)
    if (!error) setContractors((prev) => prev.filter((contractor) => contractor.id !== id))
    return { error }
  }

  const findOrCreateContractor = async (name) => {
    const normalized = normalizeContractorName(name)
    if (!normalized) return { data: null, error: portabilityError('Pon un nombre para el contratante.') }

    const existing = contractors.find((contractor) => normalizeContractorName(contractor.name) === normalized)
    if (existing) return { data: existing, error: null }

    const created = await createContractor({ name })
    if (!created.error) return created

    if (created.error?.code !== '23505') return created

    const fresh = await fetchContractors()
    const duplicate = fresh.data?.find((contractor) => normalizeContractorName(contractor.name) === normalized)
    return duplicate ? { data: duplicate, error: null } : created
  }

  return {
    contractors,
    loading,
    error,
    schemaReady: !isContractorsSchemaMissing(error),
    createContractor,
    updateContractor,
    deleteContractor,
    findOrCreateContractor,
    refetch: fetchContractors,
  }
}
