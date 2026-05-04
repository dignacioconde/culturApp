import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Music } from 'lucide-react'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', fullName: '', profession: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    const { error } = await signUp(form.email.trim(), form.password, form.fullName.trim(), form.profession.trim())
    setLoading(false)
    if (error) {
      setError('No hemos podido crear la cuenta. Revisa los datos e inténtalo de nuevo.')
      return
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 w-full max-w-md p-6 sm:p-8">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-[var(--color-primary-500)] rounded-xl flex items-center justify-center">
            <Music size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Cachés</h1>
          <p className="text-sm text-gray-500 text-center">Crea tu espacio para organizar proyectos, eventos y cobros.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
