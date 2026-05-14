import { createClient } from 'npm:@supabase/supabase-js@2'
import { buildEventsIcs } from '../../../src/lib/calendarIcs.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function textResponse(body: string, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(body, {
    status,
    headers: {
      ...corsHeaders,
      ...extraHeaders,
    },
  })
}

function getFeedToken(req: Request) {
  const url = new URL(req.url)
  const queryToken = url.searchParams.get('token')
  if (queryToken) return queryToken.trim()

  const pathToken = url.pathname.split('/').filter(Boolean).at(-1)
  if (pathToken && pathToken !== 'calendar-feed') return decodeURIComponent(pathToken).trim()

  return ''
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value)
  const hash = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return textResponse('Método no permitido.', 405, { 'Content-Type': 'text/plain; charset=utf-8' })
  }

  const token = getFeedToken(req)
  if (!token) {
    return textResponse('Falta el token del calendario.', 400, { 'Content-Type': 'text/plain; charset=utf-8' })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[calendar-feed:config]', { hasUrl: Boolean(supabaseUrl), hasAnonKey: Boolean(supabaseAnonKey) })
    return textResponse('Feed no configurado.', 500, { 'Content-Type': 'text/plain; charset=utf-8' })
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const tokenHash = await sha256Hex(token)
  const { data, error } = await supabase.rpc('get_calendar_feed_events', { feed_token_hash: tokenHash })

  if (error) {
    console.error('[calendar-feed:rpc]', { code: error.code, message: error.message })
    return textResponse('No se ha podido generar el calendario.', 500, { 'Content-Type': 'text/plain; charset=utf-8' })
  }

  const rows = data ?? []
  if (rows.length === 0) {
    return textResponse('Calendario no encontrado o desactivado.', 404, { 'Content-Type': 'text/plain; charset=utf-8' })
  }

  const feedLabel = rows[0]?.feed_label ?? 'Cachés - Agenda'
  const ics = buildEventsIcs({
    calendarName: feedLabel,
    generatedAt: new Date(),
    events: rows.map((row) => ({
      id: row.event_id,
      name: row.event_name,
      status: row.event_status,
      category: row.event_category,
      start_datetime: row.start_datetime,
      end_datetime: row.end_datetime,
      project_name: row.project_name,
    })),
  })

  if (req.method === 'HEAD') {
    return textResponse('', 200, {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Cache-Control': 'private, max-age=300',
      'Content-Disposition': 'inline; filename="caches-agenda.ics"',
    })
  }

  return textResponse(ics, 200, {
    'Content-Type': 'text/calendar; charset=utf-8',
    'Cache-Control': 'private, max-age=300',
    'Content-Disposition': 'inline; filename="caches-agenda.ics"',
  })
})
