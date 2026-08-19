# Intellect — Plataforma de Gestión Académica

Aplicación web de gestión académica creada con React, Vite y Supabase, acompañada de un backend en Node/Express para servicios auxiliares (como envío de correos). Permite registrar usuarios, seleccionar un curso, crear y organizar tareas compartidas, consultar un calendario mensual interactivo y recibir notificaciones basadas en las fechas de entrega. La persistencia de datos (usuarios, tareas, cursos y progreso) se gestiona a través de Supabase, mientras que el tema visual y estados de sesión efímeros se manejan localmente.

## Funcionalidades

- Registro, inicio y cierre de sesión seguro mediante **Supabase Auth** y sincronización de perfiles en la tabla `public.usuarios`.
- Envío automático de correo de bienvenida tras el registro mediante el servidor backend Express y Nodemailer.
- Un curso seleccionado por cada usuario (sincronizado en `usuarios.selected_course_id`).
- Modal de seguridad (`CourseAccessModal`) que solicita un código de verificación (`code_verification`) para validar y autorizar la unión de un usuario a un curso.
- Catálogo de cursos cargado en tiempo real desde Supabase (`public.cursos`) en la página de selección; `data.ts` se conserva como referencia estática para el detalle del dashboard.
- Creación de tareas compartidas persistidas en Supabase (`public.tasks`) para todos los miembros de un curso.
- Roles y permisos: `admin` universal en `usuarios.is_admin` y `manager` por curso en `course_members`.
- Solo un admin o el manager del curso puede ver y usar las acciones de crear, editar o eliminar tareas.
- Modal único de creación de tareas (`AddTaskModal/TaskModal.tsx`) reusado desde el dashboard y la sección "Agregar Tareas".
- Descripción con textarea de auto-resize hasta 6 líneas, contador de caracteres en vivo y botón Guardar bloqueado al superar el límite de 2000 caracteres en el modal de creación.
- Sección dedicada para la visualización y gestión de "Agregar Tareas" (`AddTaskSection`).
- Eliminación de tareas del curso desde la sección "Agregar Tareas", con confirmación previa en `ConfirnDelete/ConfirmDelete.tsx`.
- Modal de detalle de tarea (`Common/DetailsModal`) integrado en todos los listados, con estado `completed` en vivo desde el store.
- Constantes centralizadas para la gestión de secciones (`courseSections.ts`).
- Completado individual de tareas desde el dashboard, el calendario y el modal de detalle (persistido en `usuarios.task_status` en Supabase).
- Resumen automático de tareas completadas, pendientes y progreso.
- Notificaciones dinámicas para tareas pendientes **no vencidas**, ordenadas por fecha de entrega (urgentes si vencen hoy o mañana).
- "Próximas Tareas" ordena el listado con `useMemo`: primero las pendientes no vencidas por fecha de entrega y luego las completadas.
- Estado visual para tareas vencidas: fondo rojo y texto blanco.
- Calendario mensual que muestra las tareas según su fecha de entrega. Al hacer clic en una tarea del día se cierra el modal del día y se abre el detalle.
- Selector de mes del calendario con botón "Hoy", atajo para volver al mes actual, persistencia del último mes visto por curso entre recargas (`sessionStorage`), y swipe horizontal en móvil.
- Scroll infinito en el calendario móvil con carga perezosa de meses via IntersectionObserver, skeleton grid de aspect-square (sin saltos visuales), y ajuste automático del scroll al anteponer meses (forceVisible + useLayoutEffect).
- Grid de 2 columnas en mobile (repeat 2, 1fr) y 4 en desktop.
- DayCard con aspect-square en mobile, título truncado a 20 caracteres y máximo 3 tareas visibles.
- Límites de texto por contexto (títulos truncados según la ubicación).
- Guard de autenticación con `DashBoardProtected` que redirige a `/` si no hay sesión.
- Menú hamburguesa para navegación mobile con enlaces y auth-gating.
- Perfil de usuario editable: nombre, email y contraseña con flujo de confirmación en 2 pasos.
- Confirmación en 2 pasos al abandonar un curso, con protección contra borrado accidental.
- Modal de ajustes (`SettingsModal`) con vista "Acerca de" mostrando versión y tecnologías.
- Diseño responsive: navegación completa en escritorio y menú compacto en pantallas pequeñas.

## Tecnologías

| Herramienta | Propósito |
|---|---|
| React 19 | Interfaz de usuario |
| Vite 8 | Servidor de desarrollo y build de frontend |
| TypeScript | Tipado estático estricto (`strict`, `noUncheckedIndexedAccess`) |
| `@vitejs/plugin-react` + `@rolldown/plugin-babel` | Pipeline de React con Babel |
| `babel-plugin-react-compiler` | React Compiler (memoización automática) |
| React Router 8 | Rutas de la SPA |
| Zustand 5 | Estado global reactivo |
| Supabase (`supabase-js`) | Base de datos PostgreSQL, Auth y Row Level Security (RLS) |
| Node.js + Express 5 | Servidor backend para APIs auxiliares (`http://localhost:3000`) |
| Nodemailer + Zod | Envío de correos transaccionales y validación de esquemas |
| Tailwind CSS 3 | Estilos semánticos y animaciones |
| ESLint + typescript-eslint | Análisis estático del código |

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/course` | Selección de curso |
| `/course-dashboard/:courseId` | Dashboard, tareas, calendario y notificaciones del curso |

Las páginas principales, secciones y el calendario se cargan con `React.lazy()` y `Suspense`.

## Estado y persistencia

### Autenticación y Perfil — `src/store/AuthStore.ts`

Gestiona las credenciales mediante **Supabase Auth** y el perfil en la tabla `public.usuarios`:

- `login({ email, password })`: autenticación JWT vía `supabase.auth.signInWithPassword`.
- `register({ name, email, password })`: crea la cuenta en `supabase.auth.signUp`, inserta la fila en `usuarios` (`id`, `name`, `gmail`) y envía un email de bienvenida mediante el endpoint backend `POST /api/email/send`.
- `logout()`: revoca la sesión con `supabase.auth.signOut()`.
- `restoreSession()`: sincroniza la sesión al arrancar la app o ante eventos de `onAuthStateChange`.
- `setSelectedCourse(courseId)`: actualiza `usuarios.selected_course_id`.
- `toggleTaskStatus(courseId, taskId)`: conmuta el estado de completado en `usuarios.task_status`.
- `updateUser(field, value)`: actualiza el nombre en `usuarios` y sincroniza email o contraseña en `supabase.auth.updateUser`.
- `fetchProfile(userId)`: carga el perfil y sus filas de `course_members`, y construye `user.courseRoles`.

Cada perfil guarda su progreso individual en el campo jsonb `usuarios.task_status` (mapeado a `user.taskStatusByCourse`):

```js
taskStatusByCourse: {
  [courseId]: {
    [taskId]: { completed: true },
  },
}
```

### Curso — `src/store/courseStore.ts`

Mantiene el estado visual del curso seleccionado y lo sincroniza con `user.selectedCourseId` de `AuthStore` y la base de datos:

- `verifyAndSelect(courseId, code)`: valida el código de seguridad contra la columna `code_verification` en `public.cursos` de Supabase; si es válido, ejecuta `handleSelect(courseId)` para unirse al curso.
- `handleSelect(courseId)`: actualiza `selected_course_id` en Supabase y el store.
- `handleLeave(courseId)`: desvincula el curso asociado al usuario.

### Roles y permisos

La autorización combina dos niveles:

- `usuarios.is_admin`: administrador universal. Si es `true`, puede gestionar tareas en cualquier curso.
- `course_members`: membresía por curso con `role` (`student` o `manager`). Un `manager` solo puede
  gestionar tareas del curso cuyo `course_id` tiene asignado.

En el frontend, `AuthStore.fetchProfile()` convierte las membresías en:

```ts
courseRoles: {
  "1": "manager",
  "4": "student",
}
```

`src/utils/permission.ts` expone `canManageCourse(user, courseId)`. `Course.tsx` lo usa para
proteger `AddTaskSection` y `AddTaskModal`; `SideNav`, `BottomNav`, `Dashboard` y `DayModal`
ocultan también sus controles de creación cuando el usuario no tiene permiso.

La interfaz no sustituye la seguridad de Supabase. Las políticas RLS de `tasks` vuelven a validar
el permiso en cada INSERT, UPDATE y DELETE. Las políticas de `course_members` permiten leer las
membresías propias y al admin leerlas todas. Estas políticas ya existen en la base de datos: si se
revisa el proyecto, comprobar primero el dashboard y no ejecutar de nuevo los `CREATE POLICY`.

### Tareas — `src/store/taskStorage.ts`

Persiste las definiciones de tareas en la tabla `public.tasks` de Supabase:

- `fetchTasks()` obtiene todas las tareas de la base de datos y las indexa por `courseId` en memoria.
- `addTask(courseId, task)` inserta la tarea en Supabase y actualiza el estado local.
- `deleteTask(courseId, taskId)` elimina la tarea de Supabase y del estado local.

### UI — `src/store/uiStore.ts`

Controla el estado de apertura y cierre de modales de interfaz:

- `isAddTaskModalOpen` / `openAddTaskModal()` / `closeAddTaskModal()`
- `isPerfilModalOpen` / `openPerfilModal()` / `closePerfilModal()`

Los modales se abren mediante acciones globales desde cualquier componente (Header, BottomNav, AppBar).

### Tema — `src/store/themeStore.ts`

Gestiona el dark mode (ver sección [Dark Mode](#dark-mode-implementado)):

- `isDark`, `toggleTheme()`, `setTheme(dark)`, `initTheme()`.
- `toggleThemeAt(x, y)` cambia el tema con una animación circular de la **View Transitions API** (`document.startViewTransition`); si no hay soporte o `prefers-reduced-motion`, cae a cambio directo.
- Aplica/quita la clase `.dark` en `document.documentElement` y persiste en `localStorage('theme')`; `initTheme()` sigue `prefers-color-scheme` la primera vez.

El estado `completed` no se guarda en la tarea compartida: se deriva desde el perfil del usuario autenticado.

Cada tarea incluye, como mínimo:

```js
{
  id: crypto.randomUUID(),
  title: 'Terminar informe',
  subtitle: 'Física',
  dueDate: '2026-07-24T23:59:00.000Z',
  hour: '24 jul',
}
```

### Tareas compartidas y progreso individual

La aplicación combina las tareas de `tasksByCourse[courseId]` (de `taskStorage.ts`) con `user.taskStatusByCourse[courseId]` (de `AuthStore.ts`) antes de renderizar el dashboard, calendario o notificaciones. De este modo, si un estudiante completa una tarea, los demás estudiantes del curso continúan viéndola como pendiente.

## Catálogo de cursos

- `src/components/SelectCourse/Course-card/Course-Card.tsx` consulta en tiempo real `supabase.from("cursos").select("id, title, description, icon")` al montar el componente y renderiza las tarjetas `CourseCard`.
- `src/data/data.ts` (`courseData`) se utiliza como catálogo de respaldo y referencia en `Course.tsx` para resolver metadatos al renderizar el dashboard del curso.
- Los arrays `notification` de cada `Course` y `src/data/notifications.json` no se leen en runtime (históricos/referencia).

## Estados de tareas

`src/utils/taskStatus.ts` calcula los estados en cada render según la fecha de entrega:

| Estado | Condición | Apariencia |
|---|---|---|
| `overdue` | La fecha ya pasó | Rojo, texto blanco y badge “Tarea vencida” |
| `tomorrow` | Vence mañana | Ámbar con alerta |
| `dayAfterTomorrow` | Vence en dos días | Esmeralda |
| `normal` | Resto de casos | Estilo neutro |

Las tareas completadas no se muestran como vencidas.

## Límites de texto

Los títulos y descripciones se truncan según el contexto para mantener una interfaz ordenada:

| Campo | Ubicación | Límite |
|---|---|---|
| Título | Dashboard / AddTaskSection | 20 caracteres |
| Título | Calendario (DayCard) | 15 caracteres |
| Título | Notificaciones | 10 caracteres |
| Subtítulo | Dashboard / AddTaskSection | 30 caracteres |
| Título (input) | Modal crear tarea | 30 caracteres |
| Descripción (textarea) | Modal crear tarea | 2000 caracteres (contador en vivo, crece hasta 6 líneas) |

## Notificaciones

`src/utils/taskNotifications.ts` crea notificaciones desde las **tareas pendientes no vencidas** del usuario:

- Excluye tareas completadas y vencidas (requiere `dueDate` presente y `días ≥ 0`).
- Ordena por fecha de entrega.
- Marca como urgentes las tareas que vencen hoy o mañana (≤ 1 día).
- Alimenta la tarjeta de notificaciones del dashboard (primeras 4).

No se usan notificaciones estáticas para el dashboard.

## Calendario

El calendario usa la misma información compartida de `taskStorage.ts`; no tiene un store independiente. Antes de mostrar una tarea, combina su definición con el progreso del usuario actual.

### Desktop
- `CalendarSection.tsx` administra el mes visible con HeaderCalendar + flechas de navegación y persiste el último mes visto por curso en `sessionStorage` (clave `intellect.calendar.lastMonth.<courseId>`). Al recargar la pestaña se restaura; al cerrar el navegador vuelve al mes actual.
- `Day.tsx` + `DayCard.tsx` filtran las tareas del curso por fecha.
- Grid de 4 columnas.

### Mobile (scroll infinito)
- `CalendarSection.tsx` mantiene una lista `months` con los meses visibles. Dos centinelas (top/bottom) con `IntersectionObserver` cargan meses anteriores/siguientes sin límite.
- `MonthGroup.tsx` renderiza cada mes con lazy loading via `IntersectionObserver` (rootMargin 600px). Mientras no está cerca del viewport, muestra un skeleton grid con celdas `aspect-square` vacías que ocupan la misma altura que el contenido real, evitando reflows al hacer la transición.
- Al anteponer un mes (centinela superior), se activa `forceVisible` para que el nuevo mes renderice inmediatamente sus `DayCards`, y un `useLayoutEffect` ajusta el `scrollTop` para mantener la posición visual.
- Grid de 2 columnas (`repeat(2, 1fr)`) en mobile.
- `DayCard` usa `aspect-square md:aspect-auto`, trunca títulos a 20 caracteres y muestra máximo 3 tareas.

### Componentes compartidos
- `DayModal.tsx` muestra, crea y completa tareas del día seleccionado.
- Al hacer clic en una tarea del `DayModal` se cierra el modal del día y se abre el detalle (`Common/DetailsModal`).
- El `date-selector` del header expone un botón "Hoy" (deshabilitado cuando ya estás en el mes actual) y soporte de swipe horizontal en móvil (`Hooks/useSwipe.ts`).

## Estructura del proyecto

La estructura completa de archivos se detalla en la sección siguiente. Los directorios principales son:

- `src/store/` — Stores de Zustand (auth, cursos, tareas, UI, tema)
- `src/utils/` — Helpers puros (fechas, estados, notificaciones)
- `src/data/` — `data.ts` (catálogo de referencia de cursos) y `notifications.json` (histórico)
- `src/Hooks/` — Hooks personalizados (calendario, swipe, búsqueda, media query, animación de modales)
- `src/page/` — Páginas (home, selección de curso, dashboard del curso)
- `src/components/` — Componentes de UI organizados por dominio
- `src/ProtectedRoutes/` — Guard de autenticación para rutas protegidas

## Rutas de archivos

```text
backend/
├── server.ts                 # Servidor Express (puerto 3000)
├── api/
│   └── Config.ts             # Configuración de transporte SMTP con Nodemailer
├── controller/
│   └── emailController.ts    # Controlador de envío de emails
├── middleware/
│   └── validar.ts            # Middleware de validación con Zod
├── models/
│   └── emailSchema.ts        # Esquema de validación para correo
└── routes/
    └── emailRoutes.ts        # Rutas (/api/email/send)

src/
├── App.tsx
├── main.tsx
├── types.ts
├── index.css
├── assets/
│   ├── gemini-svg.svg
│   ├── hero.png
│   ├── logo_sin_fondo.png
│   └── react.svg
├── data/
│   ├── data.ts
│   └── notifications.json
├── Hooks/
│   ├── useAddTaskForm.ts     # Manejo del formulario de creación de tarea
│   ├── useAddTaskModal.ts    # Estado y autofocus para el modal de tareas
│   ├── useCourseNavigation.ts# Navegación entre secciones y buscador del curso
│   ├── useDaysInMonth.ts
│   ├── useMediaQuery.ts      # Hook para detectar media queries
│   ├── useModalAnimation.ts  # Animación de entrada/salida de modales
│   ├── useMonthDay.ts
│   ├── useSearchFilter.ts    # Filtro de búsqueda por título/subtítulo
│   └── useSwipe.ts           # Detección de swipe horizontal
├── lib/
│   └── supabase.ts           # Cliente Supabase (Auth, Database, Storage)
├── page/
│   ├── home.tsx
│   ├── SelectCourse.tsx
│   ├── Course.tsx
│   ├── PageLoader.tsx        # Fallback visual de carga para Suspense
│   └── css/Calendar.css
├── ProtectedRoutes/
│   └── DashBoardProtected.tsx# Guard de rutas protegidas (requiere sesión)
├── store/
│   ├── AuthStore.ts          # Autenticación Supabase + perfil usuarios
│   ├── courseStore.ts        # Sincronización del curso activo
│   ├── taskStorage.ts        # CRUD de tareas compartidas en Supabase
│   ├── themeStore.ts         # Dark mode (clase .dark + persistencia en localStorage)
│   └── uiStore.ts            # Control de apertura/cierre de modales
├── utils/
│   ├── courseSections.ts
│   ├── dateNavigation.ts     # Navegación de mes + persistencia en sessionStorage
│   ├── permission.ts          # Regla admin/manager para gestionar tareas por curso
│   ├── taskNotifications.ts
│   └── taskStatus.ts
└── components/
    ├── Layout/Layout.tsx
    ├── Header/header.tsx
    ├── Footer/Footer.tsx
    ├── Button/{ButtonPrincipal.tsx, ButtonSecondary.tsx}
    ├── CardRol/RoleCard.tsx
    ├── Form/
    │   ├── FormSection.tsx
    │   └── modales/
    │       ├── Login.tsx
    │       └── Register.tsx
    ├── Home/
    │   ├── hero/hero.tsx
    │   ├── Role/RoleSection.tsx
    │   ├── CallToAction/CallToAction.tsx
    │   ├── hamburgerMenu/HamburgerMenu.tsx  # Menú mobile slide-in
    │   └── features/
    │       ├── featuresSection.tsx
    │       ├── CalendarCard/Calendar.tsx
    │       ├── ManagementCard/ManagementCard.tsx
    │       └── Progress/Progress.tsx
    ├── Perfil/
    │   ├── Perfil.tsx
    │   ├── ButtonLogout/ButtonLogout.tsx
    │   ├── FieldEditModal.tsx            # Edición de campo del perfil
    │   └── PasswordConfirmModal.tsx      # Confirmación de contraseña previa
    ├── SelectCourse/
    │   ├── Hero/Hero.tsx
    │   ├── CourseAccessModal/
    │   │   └── CourseAccessModal.tsx     # Modal de seguridad con código para unirse al curso
    │   └── Course-card/
    │       ├── Course-Card.tsx
    │       └── Card/CourseCard.tsx
    ├── SettingsModal/
    │   └── SettingsModal.tsx             # Ajustes + vista "Acerca de"
    ├── ThemeToggle/
    │   └── ThemeToggle.tsx               # Interruptor dark mode (sol/luna)
    └── Course/
        ├── Common/
        │   ├── DetailsModal/DetailsModal.tsx  # Detalle de tarea (reusado en toda la app)
        │   └── ExitModal/ExitModal.tsx        # Confirmación al salir del curso
        ├── AddTaskSection/
        │   ├── AddTaskSection.tsx
        │   ├── ConfirnDelete/ConfirmDelete.tsx
        │   ├── DeleteTaskButton/DeleteTask.tsx
        │   └── TaskList/TaskList.tsx
        ├── DashboardSection/
        │   ├── Dashboard.tsx
        │   ├── Header/HeaderDashboard.tsx
        │   ├── Notification/Notification.tsx
        │   ├── SideNav/SideNav.tsx
        │   ├── TaskSummary/TaskSummary.tsx
        │   ├── AppBar(mobile)/AppBar.tsx
        │   ├── AppBar(mobile)/SearchDropdown.tsx     # Búsqueda de tareas con autocompletado
        │   ├── BottomNav(mobile)/BottomNav.tsx
        │   └── UpcomingTasks/
        │       ├── UpcomingTasks.tsx
        │       ├── AddTask/AddTaskButton.tsx
        │       ├── AddTaskModal/TaskModal.tsx
        │       └── TaskItem/TaskItem.tsx
        └── CalendarSection/
            ├── CalendarSection.tsx
            ├── MonthGroup.tsx            # Grupo de mes con skeleton y lazy loading
            ├── Header/HeaderCalendar.tsx
            └── Day/
                ├── Day.tsx
                ├── DayCard/DayCard.tsx
                └── DayModal/
                    ├── DayModal.tsx
                    └── DayModalComponents/
                        ├── AddTask.tsx
                        ├── FormTask.tsx
                        └── TaskList/TaskList.tsx
```

## Scripts

```bash
npm run dev       # Inicia Vite y el servidor backend Express (concurrentemente con tsx watch)
npm run build     # Genera el build de producción
npm run preview   # Sirve el build generado
npm run lint      # Ejecuta ESLint (flat config + typescript-eslint)
npm run typecheck # Chequeo de tipos con tsc -b --noEmit
```

## Verificación

Antes de publicar cambios, ejecuta en este orden:

```bash
npm run lint
npm run typecheck
npm run build
```

## Despliegue

- `vercel.json` define un rewrite SPA (`/` → `/index.html`) para que el router funcione en Vercel.
- `index.html` aún mantiene `lang="en"`, título `elian-proyect` y favicon `/favicon2.svg`; si se desea identidad "Intellect", ajustarlos al rebrandear.

---

# Dark Mode (implementado)

> Estado: **completado y activo**. Guía técnica resumida en `AGENTS.md` (sección "Theming (dark mode)").

## Resumen

Un **switch para modo oscuro** que cambia **toda la página** (no solo un componente) en las páginas **home**, **selectcourse** y **course** (dashboard completo: sidebar, calendario, modales, bottom nav, etc.), con un estado global **Zustand** compartido (`themeStore`).

### Paleta oscura (variables aplicadas cuando el tema oscuro está activo)

| Rol | Valor |
|---|---|
| Fondo | `#0E1320` (azul-negro profundo) |
| Superficie/tarjetas | `#1A2032` |
| Bordes | `#2A3247` |
| Acento (texto/links) | `#5B8DEF` |
| Acento fuerte (botón primario) | `#3A6FE0` |
| Texto principal | `#F1F3F8` |
| Texto secundario | `#9AA4BC` |

### Decisiones de diseño (acordadas con el usuario)

- **Alcance:** refactorizar TODOS los componentes de Home, SelectCourse y Course.
- **Mecanismo:** Variables CSS + clase `.dark` (no variantes `dark:` de Tailwind).
- **Persistencia:** guardar en `localStorage` (`theme`); la primera carga usa `prefers-color-scheme`.
- **Switch:** toggle con track + thumb e iconos sol/luna (Material Symbols), igual al estilo de la app.

### Ubicación del switch

- **Header** (desktop, se renderiza en home y selectcourse): a la **izquierda** del span con el icono de ajustes.
- **HamburgerMenu** (mobile): **arriba** del icono de ajustes.
- **SideNav** (sidebar del Course): **arriba** del icono de ajustes.

## Implementación (completado)

- [x] **`themeStore.ts`** (`src/store/themeStore.ts`, Zustand): `isDark`, `toggleTheme()`, `setTheme(dark)`, `initTheme()`. Persiste en `localStorage` (`theme`); `initTheme()` sigue `prefers-color-scheme` la primera vez y aplica/quita `.dark` en `document.documentElement`.
- [x] **`tailwind.config.ts`:** escalas vars (`gray/blue/green/red/amber/yellow/emerald`) + tokens semánticos (`page`, `surface`, `muted`, `muted-hover`, `muted-strong`, `muted-strong-hover`, `line`, `line-soft`, `ink`, `ink-soft`, `ink-faint`, `brand`, `brand-strong`, `brand-hover`, `brand-soft` 12%, `brand-tint` 8%, `brand-ring` 20%, `brand-faint` 6%, `on-brand`, `danger`), todo vía `rgb(var(--x) / <alpha-value>)`.

> Estas clases semánticas se usan así: `bg-page`, `bg-surface`, `text-ink`, `text-ink-soft`, `text-brand`, `bg-brand-strong`, `hover:bg-brand-hover`, `border-line`, `border-line-soft`, `bg-muted`, `bg-muted-strong`, etc.

- [x] **`src/index.css`:** variables de **todas** las escalas (`gray/blue/green/red/amber/yellow/emerald` 50-950) y tokens semánticos en bloques `:root` (claro) y `.dark` (oscuro), usando tripletes `N N N` (Tailwind los consume como `rgb(var(--x) / <alpha-value>)`). Se reemplazó la media query `@media (prefers-color-scheme: dark)` por el bloque `.dark` para no pelear con la elección explícita del usuario.
- [x] **`src/page/css/Calendar.css`:** bloque `.dark { ... }` al final que sobreescribe sus propias variables (`--primary`, `--background`, `--surface-container-low`, `--outline`, etc.) + estilos extra (`.day-card.today`, `.modal-task-item:hover`, `.status-success`, `.status-pending`, `.task-pill.green/.orange`).
- [x] **`src/page/css/Calendar.css`:** la variable de superficie se renombró a **`--cal-surface`**. Antes se llamaba `--surface` (igual que el token semántico global de Tailwind) y, al cargarse este CSS, `bg-surface` compilaba `rgb(#f9f9ff / 1)` (inválido) y todas las modales quedaban transparentes en dark y al volver a light.
- [x] **`.vscode/settings.json`:** `tailwindCSS.experimental.configFile` ahora apunta a `./tailwind.config.ts` (antes apuntaba a un `.js` inexistente y el IntelliSense no cargaba ningún config).
- [x] **`src/components/ThemeToggle/ThemeToggle.tsx`:** switch sol/luna que lee `useThemeStore` (clases `text-ink-soft hover:bg-brand-tint hover:text-brand active:scale-95`) y llama `toggleThemeAt(x, y)` con la **View Transitions API** para la transición circular desde el centro del icono (con fallback a cambio directo si el navegador no soporta `document.startViewTransition` o hay `prefers-reduced-motion`).
- [x] **`src/App.tsx`:** `useEffect` llama `useThemeStore.getState().initTheme()`.
- [x] **Switch colocado** en Header (desktop, antes de ajustes), HamburgerMenu (fila "Modo oscuro") y SideNav (fila "Modo oscuro").
- [x] **Refactor de ~30 componentes** (`Header`, `Hero`, `SelectCourse`, `Perfil`, `Dashboard`, `SideNav`, `CalendarSection`, `TaskModal`, `DayModal`, `AddTaskSection`, `FormTask`, `SearchDropdown`, `Notification`, `FormSection`, `Register`, `Login`, etc.) reemplazando colores hardcodeados por los tokens semánticos.
- [x] **`vite.config.ts`:** se añadió `build: { cssMinify: false }`. Era una mitigación para el CSS inválido que generaba `daisyui` 5.7.16 (`.dropdown-content: [object Object]`); queda inerte tras quitar el plugin. ⚠️ Problema **preexistente**, no del dark mode.
- [x] **`tailwind.config.ts`:** se **eliminó** `plugins: [require('daisyui')]`. No se usa ninguna clase daisyUI y el plugin rompía el build (`lightningcss`) **y** el Tailwind IntelliSense (su `require` en scope ESM hacía fallar la carga del config en la extensión). Con el plugin fuera, el autocompletado de tokens semánticos (`bg-surface`, `text-ink`, etc.) funciona.

## Verificado / notas

1. **Revisión visual** del dark mode en las vistas del curso (Dashboard, Calendario, Agregar Tareas): completada; los componentes usan tokens semánticos.
2. **Ajuste fino:** header desktop de Home/SelectCourse usa `bg-surface/90` (#1A2032 en dark + blur) en vez de `bg-white/85`. Seguir usando tokens (nunca hex/rgba sueltos, salvo los permitidos en AGENTS.md).
3. **Nota:** NUNCA renombrar typos históricos (`AddTaskSection`, `ConfirnDelete`). Mantener capitalización.
4. `vite.config.ts` conserva `build: { cssMinify: false }`: mitigación inerte del problema preexistente con `daisyui`, hoy innecesaria tras eliminar el plugin (no reintroducir daisyUI).

## Verificación (causa raíz del error de build)

Al terminar, ejecutar en orden: `npm run lint` → `npm run typecheck` → `npm run build`.

> `npm run build` ya no falla: se eliminó `plugins: [require('daisyui')]` de `tailwind.config.ts` (era la causa del `Error: ... [object Object]` con `lightningcss`). `vite.config.ts` mantiene `build: { cssMinify: false }`, hoy innecesario.

## Estados clave

| Token | Claro | Oscuro |
|---|---|---|
| `page` | `248 250 252` | `14 19 32` (`#0E1320`) |
| `surface` | `255 255 255` | `26 32 50` (`#1A2032`) |
| `muted` | `242 243 253` | `35 43 63` |
| `line` | `194 198 214` | `42 50 71` (`#2A3247`) |
| `ink` | `25 27 35` | `241 243 248` (`#F1F3F8`) |
| `ink-soft` | `66 71 84` | `154 164 188` (`#9AA4BC`) |
| `brand` | `0 88 190` (`#0058be`) | `91 141 239` (`#5B8DEF`) |
| `brand-strong` | `0 88 190` | `58 111 224` (`#3A6FE0`) |

> Los tokens se guardan como tripleta RGB (`0 88 190`) porque el config las consume como `rgb(var(--x) / <alpha-value>)`. Si un token es `rgba` fijo (e.g. `brand-soft` = `rgb(var(--brand) / 0.12)`), mejorar el nombre en el config.
