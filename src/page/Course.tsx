import { useState, useRef, useEffect, lazy, Suspense } from 'react';
import type { FormEvent } from 'react';
import { BottomNav } from '../components/Course/DashboardSection/BottomNav(mobile)/BottomNav';
import { SideNav } from '../components/Course/DashboardSection/SideNav/SideNav';
import { AppBar } from '../components/Course/DashboardSection/AppBar(mobile)/AppBar';
import { useParams, Link, Navigate } from 'react-router';
import { useAuthStore } from '../store/AuthStore';
import { courseData } from '../data/data';
import { COURSE_SECTIONS } from '../utils/courseSections';
import type { SectionKey } from '../utils/courseSections';
import { useTaskStore } from '../store/taskStorage';
import { useUIStore } from '../store/uiStore';
import { AddTaskModal } from '../components/Course/DashboardSection/UpcomingTasks/AddTaskModal/TaskModal';
import { DetailsModal } from '../components/Course/Common/DetailsModal/DetailsModal';
import type { TaskWithCompleted } from '../types';

const CalendarSection = lazy(() => import('../components/Course/CalendarSection/CalendarSection'));
const Dashboard = lazy(() => import('../components/Course/DashboardSection/Dashboard'));
const AddTaskSection = lazy(() => import('../components/Course/AddTaskSection/AddTaskSection'));

function getTodayInputValue() {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default function Course() {
  const { courseId } = useParams();
  const { user } = useAuthStore();
  const course = courseData.find(c => c.id === Number(courseId));
  const [activeSection, setActiveSection] = useState<SectionKey>(COURSE_SECTIONS.DASHBOARD);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<TaskWithCompleted | null>(null);

  const addTask = useTaskStore((state) => state.addTask);
  const isAddTaskModalOpen = useUIStore(s => s.isAddTaskModalOpen);
  const closeAddTaskModal = useUIStore(s => s.closeAddTaskModal);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const today = getTodayInputValue();


  const handleSectionChange = (section: SectionKey): void => {
    setIsSearchOpen(false);
    setActiveSection(section);
  };
  const closeModal = (): void => {
    closeAddTaskModal();
    setError('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!course) return;

    if (subtitle.length > 2000) {
      setError(`Te has excedido por ${subtitle.length - 2000} caracteres: ${subtitle.length}/2000`);
      return;
    }

    if (!title.trim() || !dueDate) {
      setError('Escribe un título y selecciona una fecha de entrega.');
      return;
    }

    const date = new Date(`${dueDate}T23:59:00`);
    addTask(course.id, {
      id: crypto.randomUUID(),
      title: title.trim(),
      subtitle: subtitle.trim() || 'Sin descripción',
      dueDate: date.toISOString(),
      hour: date.toLocaleDateString('es-DO', { day: 'numeric', month: 'short' }),
    });

    setTitle('');
    setSubtitle('');
    setDueDate('');
    closeModal();
  };

  useEffect(() => {
    if (!isAddTaskModalOpen) return;

    titleInputRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAddTaskModal();
        setError('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddTaskModalOpen, closeAddTaskModal]);

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
      <SideNav courseId={courseId} activeSection={activeSection} onSectionChange={handleSectionChange} />

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
              <Dashboard course={course} />
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

          {activeSection === 'Agregar Tareas' && (
            <Suspense fallback={<div className="p-10 text-center text-ink-soft">Cargando tareas...</div>}>
              <AddTaskSection courseId={course.id} />
            </Suspense>
          )}


        </main>
      </div>

      {/* ===== BOTTOM NAV (mobile only) ===== */}
      <BottomNav activeSection={activeSection} onSectionChange={handleSectionChange} />

      {isAddTaskModalOpen && (
        <AddTaskModal closeModal={closeModal} handleSubmit={handleSubmit} titleInputRef={titleInputRef} title={title} setTitle={setTitle} subtitle={subtitle} setSubtitle={setSubtitle} dueDate={dueDate} setDueDate={setDueDate} today={today} error={error} />
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