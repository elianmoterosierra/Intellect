# Intellect — Plataforma de Gestión Académica

Aplicación web de gestión académica creada con React y Vite. Permite registrar usuarios, seleccionar un curso, crear y organizar tareas, consultar un calendario mensual y recibir notificaciones basadas en las fechas de entrega.

## Funcionalidades

- Registro, inicio y cierre de sesión con persistencia local.
- Un curso seleccionado por cada usuario.
- Creación de tareas compartidas por todos los miembros de un curso.
- Modal único de creación de tareas (`AddTaskModal/TaskModal.jsx`) reusado desde el dashboard y la sección "Agregar Tareas".
- Descripción con textarea de auto-resize hasta 6 líneas, contador de caracteres en vivo y botón Guardar bloqueado al superar el límite de 2000 caracteres en el modal de creación.
- Sección dedicada para la visualización y gestión de "Agregar Tareas" (`AddTaskSection`).
- Eliminación de tareas del curso desde la sección "Agregar Tareas", con confirmación previa en `ConfirnDelete/ConfirmDelete.jsx`.
- Modal de detalle de tarea (`Common/DetailsModal`) integrado en todos los listados, con estado `completed` en vivo desde el store.
- Constantes centralizadas para la gestión de secciones (`courseSections.js`).
- Completado individual de tareas desde el dashboard, el calendario y el modal de detalle.
- Tareas y progreso guardados en `localStorage`.
- Resumen automático de tareas completadas, pendientes y progreso.
- Notificaciones dinámicas para tareas pendientes, próximas o vencidas.
- Estado visual para tareas vencidas: fondo rojo y texto blanco.
- Calendario mensual que muestra las tareas según su fecha de entrega. Al hacer clic en una tarea del día se cierra el modal del día y se abre el detalle.
- Selector de mes del calendario con botón "Hoy", atajo para volver al mes actual, persistencia del último mes visto por curso entre recargas, y swipe horizontal en móvil.
- Scroll infinito en el calendario móvil con carga perezosa de meses via IntersectionObserver, skeleton grid de aspect-square (sin saltos visuales), y ajuste automático del scroll al anteponer meses (forceVisible + useLayoutEffect).
- Grid de 2 columnas en mobile (repeat 2, 1fr) y 4 en desktop.
- DayCard con aspect-square en mobile, título truncado a 20 caracteres y máximo 3 tareas visibles.
- Límites de texto por contexto (títulos truncados según la ubicación).
- Guard de autenticación con `DashBoardProtected` que redirige a `/` si no hay sesión.
- Menú hamburguesa para navegación mobile con enlaces y auth-gating.
- Perfil de usuario editable: nombre, email y contraseña con flujo de confirmación en 2 pasos.
- Modal de ajustes (`SettingsModal`) con vista "Acerca de" mostrando versión y tecnologías.
- Diseño responsive: navegación completa en escritorio y menú compacto en pantallas pequeñas.

## Tecnologías

| Herramienta | Propósito |
|---|---|
| React 19 | Interfaz de usuario |
| Vite 8 | Servidor de desarrollo y build |
| `@vitejs/plugin-react` + `@rolldown/plugin-babel` | Pipeline de React con Babel |
| `babel-plugin-react-compiler` | React Compiler (memoización automática) |
| React Router 8 | Rutas de la SPA |
| Zustand 5 | Estado global y persistencia local |
| Tailwind CSS 3 | Estilos y animaciones |
| ESLint | Análisis estático del código |

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/course` | Selección de curso |
| `/course-dashboard/:courseId` | Dashboard, tareas, calendario y notificaciones del curso |

Las páginas principales, secciones y el calendario se cargan con `React.lazy()` y `Suspense`.

## Estado y persistencia

### Autenticación — `src/store/AuthStore.js`

Gestiona los usuarios y la sesión actual en `localStorage`:

- `users`: cuentas registradas.
- `auth`: sesión activa con `isLoggedIn` y `user`.
- `login({ email, password })` e `register({ name, email, password })`.
- `logout()` para cerrar sesión.
- `setSelectedCourse(courseId)` para asociar el curso seleccionado al usuario.
- `toggleTaskStatus(courseId, taskId)` para guardar el estado individual de una tarea.

Cada perfil guarda su progreso en `user.taskStatusByCourse`, sin modificar la tarea compartida:

```js
taskStatusByCourse: {
  [courseId]: {
    [taskId]: { completed: true },
  },
}
```

> La autenticación es local y de demostración. Las contraseñas se almacenan en `localStorage`; no es adecuada para producción sin un backend seguro.

### Curso — `src/store/courseStore.js`

Mantiene el estado visual del curso seleccionado y lo sincroniza con `user.selectedCourseId` de `AuthStore`.

- `handleSelect(courseId)` selecciona un curso.
- `handleLeave(courseId)` elimina el curso asociado a la sesión.

### Tareas — `src/store/taskStorage.js`

Es la única fuente de las definiciones de tareas. Las guarda bajo la clave `tasksByCourse` en `localStorage` y las agrupa por curso, por lo que todos los usuarios del mismo curso ven la misma lista.

- `addTask(courseId, task)` crea una tarea.
- `deleteTask(courseId, taskId)` elimina una tarea.

### UI — `src/store/uiStore.js`

Controla el estado de apertura y cierre de modales de interfaz:

- `isAddTaskModalOpen` / `openAddTaskModal()` / `closeAddTaskModal()`
- `isPerfilOpen` / `openPerfil()` / `closePerfil()`

Los modales se abren mediante acciones globales desde cualquier componente (Header, BottomNav, AppBar).

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

La aplicación combina las tareas de `tasksByCourse[courseId]` con `user.taskStatusByCourse[courseId]` antes de renderizar el dashboard, calendario o notificaciones. De este modo, si un estudiante completa una tarea, los demás estudiantes del curso continúan viéndola como pendiente.

## Estados de tareas

`src/utils/taskStatus.js` calcula los estados en cada render según la fecha de entrega:

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

`src/utils/taskNotifications.js` crea notificaciones desde las tareas pendientes del usuario:

- Ordena por fecha de entrega.
- Marca como urgentes las tareas vencidas, de hoy o de mañana.
- Alimenta tanto la tarjeta de notificaciones del dashboard como el panel de la campana.

No se usan notificaciones estáticas para el dashboard.

## Calendario

El calendario usa la misma información compartida de `taskStorage.js`; no tiene un store independiente. Antes de mostrar una tarea, combina su definición con el progreso del usuario actual.

### Desktop
- `CalendarSection.jsx` administra el mes visible con HeaderCalendar + flechas de navegación y persiste el último mes visto por curso en `sessionStorage` (clave `intellect.calendar.lastMonth.<courseId>`). Al recargar la pestaña se restaura; al cerrar el navegador vuelve al mes actual.
- `Day.jsx` + `DayCard.jsx` filtran las tareas del curso por fecha.
- Grid de 4 columnas.

### Mobile (scroll infinito)
- `CalendarSection.jsx` mantiene una lista `months` con los meses visibles. Dos centinelas (top/bottom) con `IntersectionObserver` cargan meses anteriores/siguientes sin límite.
- `MonthGroup.jsx` renderiza cada mes con lazy loading via `IntersectionObserver` (rootMargin 600px). Mientras no está cerca del viewport, muestra un skeleton grid con celdas `aspect-square` vacías que ocupan la misma altura que el contenido real, evitando reflows al hacer la transición.
- Al anteponer un mes (centinela superior), se activa `forceVisible` para que el nuevo mes renderice inmediatamente sus `DayCards`, y un `useLayoutEffect` ajusta el `scrollTop` para mantener la posición visual.
- Grid de 2 columnas (`repeat(2, 1fr)`) en mobile.
- `DayCard` usa `aspect-square md:aspect-auto`, trunca títulos a 20 caracteres y muestra máximo 3 tareas.

### Componentes compartidos
- `DayModal.jsx` muestra, crea y completa tareas del día seleccionado.
- Al hacer clic en una tarea del `DayModal` se cierra el modal del día y se abre el detalle (`Common/DetailsModal`).
- El `date-selector` del header expone un botón "Hoy" (deshabilitado cuando ya estás en el mes actual) y soporte de swipe horizontal en móvil (`Hooks/useSwipe.js`).

## Estructura relevante

```text
src/
├── store/
│   ├── AuthStore.js          # Sesión, curso seleccionado y progreso individual
│   ├── courseStore.js        # Estado de selección del curso
│   ├── taskStorage.js        # Tareas compartidas y persistentes por curso
│   └── uiStore.js            # Apertura/cierre de modales (addTask, perfil)
├── utils/
│   ├── courseSections.js     # Constantes de las secciones de navegación
│   ├── taskStatus.js         # Estados visuales de las tareas
│   ├── taskNotifications.js  # Notificaciones derivadas de tareas
│   └── dateNavigation.js     # Navegación de mes + persistencia del mes visto
├── data/
│   └── data.jsx              # Datos fijos de los cursos
├── ProtectedRoutes/
│   └── DashBoardProtected.jsx # Guard de rutas protegidas
├── page/
│   ├── home.jsx
│   ├── SelectCourse.jsx
│   └── Course.jsx
└── components/
    ├── Header/               # Navegación principal y autenticación
    ├── Form/                 # Login y registro
    ├── Perfil/               # Perfil editable + modales de edición y confirmación
    ├── SettingsModal/        # Ajustes con vista "Acerca de"
    └── Course/
        ├── Common/           # DetailsModal (detalle de tarea) + ExitModal (salir del curso)
        ├── AddTaskSection/   # Sección "Agregar Tareas" (TaskList + ConfirmDelete + AddTaskButton)
        ├── DasboardSection/  # Dashboard, tareas, notificaciones y modal único de creación
        └── CalendarSection/  # Calendario y modal de día
```

## Rutas de archivos

```text
src/
├── App.jsx
├── main.jsx
├── index.css
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── data/
│   ├── data.jsx
│   └── notifications.json
├── Hooks/
│   ├── useDaysInMonth.jsx
│   ├── useMediaQuery.js         # Hook para detectar media queries
│   ├── useMonthDay.jsx
│   └── useSwipe.js              # Hook reutilizable para detectar swipe horizontal
├── page/
│   ├── home.jsx
│   ├── SelectCourse.jsx
│   ├── Course.jsx
│   └── css/Calendar.css
├── ProtectedRoutes/
│   └── DashBoardProtected.jsx   # Guard de rutas protegidas (redirige a / si no hay sesión)
├── store/
│   ├── AuthStore.js
│   ├── courseStore.js
│   ├── taskStorage.js
│   └── uiStore.js               # Control de apertura/cierre de modales
├── utils/
│   ├── courseSections.js
│   ├── dateNavigation.js        # Navegación de mes + persistencia en sessionStorage
│   ├── taskNotifications.js
│   └── taskStatus.js
└── components/
    ├── Layout/Layout.jsx
    ├── Header/header.jsx
    ├── Footer/Footer.jsx
    ├── Button/{ButtonPrincipal.jsx, ButtonSecondary.jsx}
    ├── CardRol/RoleCard.jsx
    ├── Form/
    │   ├── FormSection.jsx
    │   └── modales/
    │       ├── Login.jsx
    │       └── Reguister.jsx
    ├── Home/
    │   ├── hero/hero.jsx
    │   ├── Role/RoleSection.jsx
    │   ├── CallToAction/CallToAction.jsx
    │   ├── hamburgerMenu/HamburgerMenu.jsx  # Menú mobile slide-in
    │   └── features/
    │       ├── featuresSection.jsx
    │       ├── CalendarCard/Calendar.jsx
    │       ├── ManagementCard/ManagementCard.jsx
    │       └── Progress/Progress.jsx
    ├── Perfil/
    │   ├── Perfil.jsx
    │   ├── ButtonLogout/ButtonLogout.jsx
    │   ├── FieldEditModal.jsx            # Edición de campo del perfil
    │   └── PasswordConfirmModal.jsx      # Confirmación de contraseña previa
    ├── SelectCourse/
    │   ├── Hero/Hero.jsx
    │   └── Course-card/
    │       ├── Course-Card.jsx
    │       └── Card/CourseCard.jsx
    ├── SettingsModal/
    │   └── SettingsModal.jsx             # Ajustes + vista "Acerca de"
    └── Course/
        ├── Common/
        │   ├── DetailsModal/DetailsModal.jsx  # Detalle de tarea (reusado en toda la app)
        │   └── ExitModal/ExitModal.jsx        # Confirmación al salir del curso
        ├── AddTaskSection/
        │   ├── AddTaskSection.jsx
        │   ├── ConfirnDelete/ConfirmDelete.jsx
        │   ├── DeleteTaskButton/DeleteTask.jsx
        │   └── TaskList/TaskList.jsx
        ├── DasboardSection/
        │   ├── Dashboard.jsx
        │   ├── Header/HeaderDashboard.jsx
        │   ├── Notification/Notification.jsx
        │   ├── NotificationPanel/NotificationPanel.jsx
        │   ├── SideNav/SideNav.jsx
        │   ├── TaskSummary/TaskSummary.jsx
        │   ├── AppBar(mobile)/AppBar.jsx
        │   ├── BottomNav(mobile)/BottomNav.jsx
        │   └── UpcomingTasks/
        │       ├── UpcomingTasks.jsx
        │       ├── AddTask/AddTaskButton.jsx
        │       ├── AddTaskModal/TaskModal.jsx
        │       └── TaskItem/TaskItem.jsx
        └── CalendarSection/
            ├── CalendarSection.jsx
            ├── MonthGroup.jsx            # Grupo de mes con skeleton y lazy loading
            ├── Header/HeaderCalendar.jsx
            └── Day/
                ├── Day.jsx
                ├── DayCard/DayCard.jsx
                └── DayModal/
                    ├── DayModal.jsx
                    └── DayModalComponents/
                        ├── AddTask.jsx
                        ├── FormTask.jsx
                        └── TaskList/TaskList.jsx
```

## Scripts

```bash
npm run dev      # Inicia Vite en desarrollo
npm run build    # Genera el build de producción
npm run preview  # Sirve el build generado
npm run lint     # Ejecuta ESLint
```

## Verificación

Antes de publicar cambios, ejecuta:

```bash
npm run lint
npm run build
```
