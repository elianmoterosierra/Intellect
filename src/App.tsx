import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Layout } from './components/Layout/Layout'
import DashBoardProtected from './ProtectedRoutes/DashBoardProtected'
import CourseEntryRedirect from './ProtectedRoutes/CourseEntryRedirect'
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

    let initializationStarted = false
    let dataLoadPromise: Promise<void> | null = null

    const restoreAndLoadData = (): Promise<void> => {
      if (dataLoadPromise) return dataLoadPromise

      initializationStarted = true
      dataLoadPromise = (async () => {
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
      })().finally(() => {
        dataLoadPromise = null
      })

      return dataLoadPromise
    }

    void restoreAndLoadData()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        void restoreAndLoadData()
      }
      // getSession() above already handles the initial session. Supabase also
      // emits INITIAL_SESSION, so ignoring it here prevents a duplicate load.
      if (event === 'INITIAL_SESSION' && session && !initializationStarted) {
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
            <Route path="/" element={<CourseEntryRedirect><HomePage /></CourseEntryRedirect>} />
            <Route path="/course" element={<CourseEntryRedirect><DashBoardProtected><CoursePage /></DashBoardProtected></CourseEntryRedirect>} />

          </Route>
          <Route path="/course-dashboard/:courseId" element={<DashBoardProtected><Course /></DashBoardProtected>} />

          <Route path="*" element={
            <>
              <h1 className='text-5xl font-bold text-center mt-32'>404 - Pagina No Encontrada</h1>
              <button onClick={() => window.history.back()} className="text-center mt-4">Volver</button>
            </>

          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
