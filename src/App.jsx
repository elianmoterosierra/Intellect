import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout/Layout'
import DashBoardProtected from './ProtectedRoutes/DashBoardProtected'
// Lazy imports: cada página se descarga solo cuando el usuario la visita
const HomePage = lazy(() => import('./page/home'))
const CoursePage = lazy(() => import('./page/SelectCourse').then(m => ({ default: m.CoursePage })))
const Course = lazy(() => import('./page/Course'))
// Pantalla de carga mientras el chunk se descarga
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'var(--bg-primary, #0f0f1a)',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255,255,255,0.1)',
        borderTopColor: '#7c3aed',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/course" element={<DashBoardProtected><CoursePage /></DashBoardProtected>} />

          </Route>
          <Route path="/course-dashboard/:courseId" element={<DashBoardProtected><Course /></DashBoardProtected>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
