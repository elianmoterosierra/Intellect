import { useEffect, useState, lazy, Suspense } from 'react';
import { BottomNav } from '../components/Course/DashboardSection/BottomNav(mobile)/BottomNav';
import { SideNav } from '../components/Course/DashboardSection/SideNav/SideNav';
import { AppBar } from '../components/Course/DashboardSection/AppBar(mobile)/AppBar';
import { useParams, Link, Navigate } from 'react-router';
import { useAuthStore } from '../store/AuthStore';
import { useSubjectStore } from '../store/subjectStorage';
import { courseData } from '../data/data';
import { useCourseNavigation } from '../Hooks/useCourseNavigation';
import { useAddTaskModal } from '../Hooks/useAddTaskModal';
import { useAddTaskForm } from '../Hooks/useAddTaskForm';
import { AddTaskModal } from '../components/Course/DashboardSection/UpcomingTasks/AddTaskModal/TaskModal';
import { DetailsModal } from '../components/Course/Common/DetailsModal/DetailsModal';
import type { TaskWithCompleted } from '../types';
import { canManageCourse } from '../utils/permission';

const CalendarSection = lazy(() => import('../components/Course/CalendarSection/CalendarSection'));
const Dashboard = lazy(() => import('../components/Course/DashboardSection/Dashboard'));
const AddTaskSection = lazy(() => import('../components/Course/AddTaskSection/AddTaskSection'));

export default function Course() {
  const { courseId } = useParams();
  const { user } = useAuthStore();

  const canManageTasks = canManageCourse(user, courseId ?? '');;
  const course = courseData.find(c => c.id === Number(courseId));
  const [selectedTask, setSelectedTask] = useState<TaskWithCompleted | null>(null);

  useEffect(() => {
    if (course) {
      void useSubjectStore.getState().loadSubjects(course.id);
    }
  }, [course]);

  const { activeSection, handleSectionChange, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery } = useCourseNavigation();
  const { isOpen: isAddTaskModalOpen, close: closeAddTaskModal, titleInputRef } = useAddTaskModal();
  const {
    title, setTitle,
    subtitle, setSubtitle,
    subjectId, setSubjectId,
    subjects, availableDates,
    dueDate, setDueDate,
    error, handleSubmit,
  } = useAddTaskForm(Number(courseId), closeAddTaskModal);

  if (String(user?.selectedCourseId) !== courseId) {
    return <Navigate to="/course" replace />;
  }

  if (!course) return (
    <div className="flex flex-col items-center justify-center h-screen text-ink-soft">
      Curso no encontrado
      <Link to="/course" className="bg-transparent border-none text-brand text-md leading-4 tracking-widest font-semibold cursor-pointer hover:underline mt-4">
        Volver a Cursos
      </Link>
    </div>
  );



  return (
    <div className="flex h-screen overflow-hidden font-[Inter,sans-serif] bg-page text-ink antialiased">
      {/* ===== SIDENAV (desktop) ===== */}
      <SideNav courseId={courseId} activeSection={activeSection} onSectionChange={handleSectionChange} canManageCourse={canManageTasks} />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-col flex-1 w-full md:ml-64">

        {/* TopAppBar (mobile only) */}
        <AppBar
          activeSection={activeSection}
          onToggleSearch={() => setIsSearchOpen(v => !v)}
          isSearchOpen={isSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          courseId={course.id}
          setSelectedTask={setSelectedTask}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-page pb-16 md:pb-0">
          {activeSection === 'dashboard' && (
            <Suspense fallback={<div className="p-10 text-center text-ink-soft">Cargando dashboard...</div>}>
              <Dashboard course={course} canManageTasks={canManageTasks} />
            </Suspense>
          )}

          {activeSection === 'calendar' && (
            <Suspense fallback={<div className="p-10 text-center text-ink-soft">Cargando calendario...</div>}>
              <CalendarSection
                courseId={course.id}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setSelectedTask={setSelectedTask}

              />
            </Suspense>
          )}

          {activeSection === 'Agregar Tareas' && canManageTasks && (
            <Suspense fallback={<div className="p-10 text-center text-ink-soft">Cargando tareas...</div>}>
              <AddTaskSection courseId={course.id} />
            </Suspense>
          )}


        </main>
      </div>

      {/* ===== BOTTOM NAV (mobile only) ===== */}
      <BottomNav activeSection={activeSection} onSectionChange={handleSectionChange} canManageTasks={canManageTasks} />

      {isAddTaskModalOpen && canManageTasks && (
        <AddTaskModal closeModal={closeAddTaskModal} handleSubmit={handleSubmit} titleInputRef={titleInputRef} title={title} setTitle={setTitle} subtitle={subtitle} setSubtitle={setSubtitle} subjectId={subjectId} setSubjectId={setSubjectId} subjects={subjects} availableDates={availableDates} dueDate={dueDate} setDueDate={setDueDate} error={error} />
      )}

      {selectedTask && (
        <DetailsModal
          task={selectedTask}
          courseId={course.id}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
