import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom'
import { AlertTriangle, Drama, Home, RefreshCw, ShieldAlert } from 'lucide-react'
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
import Updates from './pages/Updates/Updates'
import AdminInvites from './pages/Admin/AdminInvites'
import { Button } from './components/ui/Button'

function GateLoader({ label = 'Cargando...' }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-page px-4 text-text-secondary">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-subtle bg-surface-card px-6 py-5 text-center shadow-sm">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft text-accent-primary">
          <Drama size={22} strokeWidth={1.6} aria-hidden="true" />
          <span className="absolute inset-0 rounded-full border-2 border-accent-primary/20 border-t-accent-primary motion-safe:animate-spin" aria-hidden="true" />
        </div>
        <p className="text-sm font-medium">{label}</p>
      </div>
    </div>
  )
}

function GateCard({ icon: Icon, title, description, action }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface-page px-4 py-8">
      <section className="w-full max-w-md rounded-2xl border border-border-subtle bg-surface-card p-6 text-center text-text-primary shadow-sm sm:p-8">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-primary">
          <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold leading-tight">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </section>
    </div>
  )
}

function PrivateRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth()
  if (loading) return <GateLoader />
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
    return <GateLoader label="Cargando perfil..." />
  }

  if (error || !profile) {
    return (
      <GateCard
        icon={AlertTriangle}
        title="No hemos podido cargar tu perfil"
        description="Tu sesión está activa, pero falta la fila de perfil necesaria para usar Cachés. Vuelve a intentarlo y, si sigue igual, avísanos para repararlo."
        action={
          <Button
            type="button"
            onClick={refetch}
            className="mx-auto"
          >
            <RefreshCw size={16} />
            Reintentar
          </Button>
        }
      />
    )
  }

  if (!profile.onboarding_completed && !isOnboardingRoute && !onboardingJustCompleted) {
    return <Navigate to="/onboarding" replace state={{ from: location.pathname }} />
  }

  if (requireAdmin && profile.role !== 'admin') {
    return (
      <GateCard
        icon={ShieldAlert}
        title="No tienes acceso a esta zona"
        description="Esta pantalla es solo para cuentas administradoras de la beta."
        action={
          <Link
            to="/dashboard"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent-primary px-4 py-2 text-sm font-medium leading-none text-primary-foreground shadow-sm transition-colors hover:bg-accent-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2"
          >
            <Home size={16} />
            Volver a Inicio
          </Link>
        }
      />
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
        <Route path="/novedades" element={<PrivateRoute><Updates /></PrivateRoute>} />
        <Route path="/admin/invitaciones" element={<PrivateRoute requireAdmin><AdminInvites /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
    </ScrollLockProvider>
  )
}
