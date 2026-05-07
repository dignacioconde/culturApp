import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Drama } from 'lucide-react'

function registerErrorMessage(error) {
  const rawMessage = error?.message?.toLowerCase() ?? ''

  if (rawMessage.includes('invalid login credentials') || rawMessage.includes('already registered')) {
    return 'Ese email ya está registrado. Inicia sesión o usa otro email.'
  }

  if (rawMessage.includes('email rate limit') || rawMessage.includes('rate limit')) {
    return 'Hemos enviado demasiados emails seguidos. Espera un minuto y vuelve a intentarlo.'
  }

  if (rawMessage.includes('error sending confirmation email') || rawMessage.includes('smtp')) {
    return 'La cuenta no se ha podido crear porque ha fallado el email de confirmación. Revisa la configuración SMTP de Supabase.'
  }

  if (
    rawMessage.includes('beta_invite_code_invalid_or_redeemed') ||
    rawMessage.includes('beta_invite_code_required')
  ) {
    return 'El código de invitación no es válido, ha caducado o ya se ha usado.'
  }

  return 'No hemos podido crear la cuenta. Revisa el código de invitación y tus datos.'
}

export default function Register() {
  const { signUp } = useAuth()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    profession: '',
    betaInviteCode: searchParams.get('invite') ?? '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmationEmail, setConfirmationEmail] = useState('')

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.fullName.trim()) {
      setError('Indica tu nombre para crear el perfil.')
      return
    }
    if (!form.email.trim()) {
      setError('Introduce un email válido.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (!form.betaInviteCode.trim()) {
      setError('Introduce tu código de invitación para acceder a la beta.')
      return
    }
    setLoading(true)
    const { error } = await signUp(
      form.email.trim(),
      form.password,
      form.fullName.trim(),
      form.profession.trim(),
      form.betaInviteCode.trim(),
    )
    setLoading(false)
    if (error) {
      setError(registerErrorMessage(error))
      return
    }
    setConfirmationEmail(form.email.trim())
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[var(--color-primary-500)] rounded-xl flex items-center justify-center">
            <Drama size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Cachés</h1>
          <p className="text-sm text-gray-500 text-center">Crea tu espacio para organizar proyectos, eventos y cobros.</p>
        </div>

        {confirmationEmail ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            <p className="font-medium">Te hemos enviado un email para confirmar tu cuenta.</p>
            <p className="mt-2">
              Revisa {confirmationEmail} y abre el enlace de confirmación. Después podrás iniciar sesión.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Código de invitación *"
              type="text"
              name="betaInviteCode"
              value={form.betaInviteCode}
              onChange={handleChange}
              placeholder="CACHES-BETA-..."
              autoComplete="one-time-code"
              required
            />
            <Input
              label="Nombre completo *"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Ana García"
              autoComplete="name"
              required
            />
            <Input
              label="Profesión"
              type="text"
              name="profession"
              value={form.profession}
              onChange={handleChange}
              placeholder="Música, fotógrafa, actriz..."
              autoComplete="organization-title"
            />
            <Input
              label="Email *"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
            <Input
              label="Contraseña *"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-gray-500">La contraseña debe tener al menos 6 caracteres.</p>
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full justify-center mt-1">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </form>
        )}

        <p className="text-sm text-center text-gray-500 mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-[var(--color-primary-500)] font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
