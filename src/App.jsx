import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useProfile } from './hooks/useProfile'
import { ScrollLockProvider } from './hooks/useScrollLock'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Onboarding from './pages/Auth/Onboarding'
import Dashboard from './pages/Dashboard/Dashboard'
import CalendarEvents from './pages/Calendar/CalendarEvents'
import CalendarProjects from './pages/Calendar/CalendarProjects'
import EventList from './pages/Events/EventList'
import EventDetail from './pages/Events/EventDetail'
import ProjectList from './pages/Projects/ProjectList'
import ProjectDetail from './pages/Projects/ProjectDetail'
import ContractorList from './pages/Contractors/ContractorList'
import Work from './pages/Work/Work'
import Settings from './pages/Settings/Settings'
import Data from './pages/Data/Data'
import AdminInvites from './pages/Admin/AdminInvites'

function PrivateRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Cargando...</div>
  if (!user) return <Navigate to="/login" replace />
  return <ProfileGate user={user} requireAdmin={requireAdmin}>{children}</ProfileGate>
}

function ProfileGate({ user, requireAdmin, children }) {
  const location = useLocation()
  const { profile, loading, error, refetch } = useProfile(user?.id)
  const isOnboardingRoute = location.pathname === '/onboarding'
  const onboardingJustCompleted = location.state?.onboardingCompleted === true

  useEffect(() => {
    if (onboardingJustCompleted) refetch()
  }, [onboardingJustCompleted, refetch])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">Cargando perfil...</div>
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-[var(--color-ink)]">No hemos podido cargar tu perfil</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Tu sesión está activa, pero falta la fila de perfil necesaria para usar Cachés. Vuelve a intentarlo y, si sigue igual, avísanos para repararlo.
          </p>
          <button
            type="button"
            onClick={refetch}
            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--color-red)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-red-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!profile.onboarding_completed && !isOnboardingRoute && !onboardingJustCompleted) {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />
  }

  if (requireAdmin && profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--color-paper)] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-[var(--color-paper-mid)] bg-[var(--color-surface)] p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-[var(--color-ink)]">No tienes acceso a esta zona</h1>
          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            Esta pantalla es solo para cuentas administradoras de la beta.
          </p>
          <Link
            to="/dashboard"
            className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-[var(--color-red)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-red-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] focus-visible:ring-offset-2"
          >
            Volver a Inicio
          </Link>
        </div>
      </div>
    )
  }

  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <ScrollLockProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/onboarding" element={<PrivateRoute><Onboarding /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/calendar" element={<Navigate to="/calendar/events" replace />} />
        <Route path="/calendar/events" element={<PrivateRoute><CalendarEvents /></PrivateRoute>} />
        <Route path="/calendar/projects" element={<PrivateRoute><CalendarProjects /></PrivateRoute>} />
        <Route path="/events" element={<PrivateRoute><EventList /></PrivateRoute>} />
        <Route path="/events/:id" element={<PrivateRoute><EventDetail /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><ProjectList /></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
        <Route path="/contractors" element={<PrivateRoute><ContractorList /></PrivateRoute>} />
        <Route path="/work" element={<PrivateRoute><Work /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/data" element={<PrivateRoute><Data /></PrivateRoute>} />
        <Route path="/admin/invitaciones" element={<PrivateRoute requireAdmin><AdminInvites /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </ScrollLockProvider>
  )
}
