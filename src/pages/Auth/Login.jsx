import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Drama } from 'lucide-react'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const confirmed = searchParams.get('confirmed') === '1'

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email.trim() || !form.password) {
      setError('Introduce tu email y contraseña para entrar.')
      return
    }
    setLoading(true)
    const { error } = await signIn(form.email.trim(), form.password)
    setLoading(false)
    if (error) {
      if (error.code === 'email_not_confirmed' || error.message?.toLowerCase().includes('email not confirmed')) {
        setError('Confirma tu email antes de entrar.')
        return
      }
      setError('Email o contraseña incorrectos.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-page p-4">
      <div className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-primary">
            <Drama size={20} className="text-surface-page" />
          </div>
          <h1 className="font-display text-2xl font-semibold leading-tight text-text-primary">Cachés</h1>
          <p className="text-center text-sm text-text-secondary">Accede a tus proyectos, eventos y previsión económica.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {confirmed && (
            <p className="rounded-2xl bg-success-soft px-3 py-2 text-sm text-success">
              Email confirmado. Ya puedes entrar en Cachés.
            </p>
          )}
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            autoComplete="email"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Tu contraseña"
            autoComplete="current-password"
            required
          />
          {error && <p className="rounded-2xl bg-danger-soft px-3 py-2 text-sm text-danger">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full justify-center mt-1">
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-accent-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
