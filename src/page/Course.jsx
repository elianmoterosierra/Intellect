import { useState, lazy, Suspense } from 'react';
import { BottomNav } from '../components/Course/DasboardSection/BottomNav(mobile)/BottomNav';
import { SideNav } from '../components/Course/DasboardSection/SideNav/SideNav';
import { AppBar } from '../components/Course/DasboardSection/AppBar(mobile)/AppBar';
import { NotificationPanel } from '../components/Course/DasboardSection/NotificationPanel/NotificationPanel';
import { useParams, Link } from 'react-router';
import { courseData } from '../data/data';

const CalendarSection = lazy(() => import('../components/Course/CalendarSection/CalendarSection'));
const Dashboard = lazy(() => import('../components/Course/DasboardSection/Dashboard/Dashboard'));

export default function Course() {
  const { courseId } = useParams();
  const course = courseData.find(c => c.id === Number(courseId));
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  if (!course) return (
    <div className="flex flex-col items-center justify-center h-screen text-[#424754]">
      Curso no encontrado
      <Link to="/course" className="bg-transparent border-none text-[#0058be] text-md leading-4 tracking-widest font-semibold cursor-pointer hover:underline mt-4">
        Volver a Cursos
      </Link>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden font-[Inter,sans-serif] bg-[#f9f9ff] text-[#191b23] antialiased">
      {/* ===== SIDENAV (desktop) ===== */}
      <SideNav courseId={courseId} activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-col flex-1 w-full md:ml-64">

        {/* TopAppBar (mobile only) */}
        <AppBar onToggleNotifications={() => setIsNotificationOpen(v => !v)} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#f9f9ff]">
          {activeSection === 'dashboard' && (
            <Suspense fallback={<div className="p-10 text-center text-[#424754]">Cargando dashboard...</div>}>
              <Dashboard course={course} />
            </Suspense>
          )}

          {activeSection === 'calendar' && (
            <Suspense fallback={<div className="p-10 text-center text-[#424754]">Cargando calendario...</div>}>
              <CalendarSection onToggleNotifications={() => setIsNotificationOpen(v => !v)} />
            </Suspense>
          )}

          {activeSection === 'tasks' && (
            <div className="p-4 md:p-10 text-[#424754]">
              <h2 className="text-xl font-semibold text-[#191b23] mb-2">Tasks</h2>
              <p>Sección de tareas — Próximamente</p>
            </div>
          )}

          {activeSection === 'administration' && (
            <div className="p-4 md:p-10 text-[#424754]">
              <h2 className="text-xl font-semibold text-[#191b23] mb-2">Administration</h2>
              <p>Administración — Próximamente</p>
            </div>
          )}
        </main>
      </div>

      {/* ===== NOTIFICATION PANEL (global) ===== */}
      {isNotificationOpen && <NotificationPanel onClose={() => setIsNotificationOpen(false)} />}

      {/* ===== BOTTOM NAV (mobile only) ===== */}
      <BottomNav activeSection={activeSection} onSectionChange={setActiveSection} />
    </div>
  );
}
