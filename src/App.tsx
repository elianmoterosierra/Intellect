import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout/Layout'
import DashBoardProtected from './ProtectedRoutes/DashBoardProtected'
import { useThemeStore } from './store/themeStore'
import { useAuthStore } from './store/AuthStore'
import { supabase } from './lib/supabase'
import { PageLoader } from './page/PageLoader.tsx'
import { useTaskStore } from './store/taskStorage'
import { useSubjectStore } from './store/subjectStorage'
// Lazy imports: cada página se descarga solo cuando el usuario la visita
const HomePage = lazy(() => import('./page/home'))
const CoursePage = lazy(() => import('./page/SelectCourse').then(m => ({ default: m.CoursePage })))
const Course = lazy(() => import('./page/Course'))

// Pantalla de carga mientras el chunk se descarga


function App() {
    useEffect(() => {
    useThemeStore.getState().initTheme()

    const restoreAndLoadData = async () => {
      await useAuthStore.getState().restoreSession()

      if (useAuthStore.getState().isLoggedIn) {
        const selectedCourseId = useAuthStore.getState().user?.selectedCourseId ?? null
        await Promise.all([
          useSubjectStore.getState().loadSubjects(selectedCourseId),
          useTaskStore.getState().fetchTasks(),
        ])
      } else {
        useSubjectStore.getState().clearSubjects()
        useTaskStore.getState().clearTasks()
      }
    }

    void restoreAndLoadData()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
        void restoreAndLoadData()
      }
      if (event === 'SIGNED_OUT') {
        useSubjectStore.getState().clearSubjects()
        useTaskStore.getState().clearTasks()
        useAuthStore.setState({ isLoggedIn: false, sessionReady: true, user: null })
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

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
