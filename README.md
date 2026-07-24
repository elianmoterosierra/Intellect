# Intellect — Plataforma de Gestión Académica

Aplicación web de gestión académica creada con React y Vite. Permite registrar usuarios, seleccionar un curso, crear y organizar tareas, consultar un calendario mensual y recibir notificaciones basadas en las fechas de entrega.

## Funcionalidades

- Registro, inicio y cierre de sesión con persistencia local.
- Un curso seleccionado por cada usuario.
- Creación de tareas compartidas por todos los miembros de un curso.
- Completado individual de tareas desde el dashboard y el calendario.
- Tareas y progreso guardados en `localStorage`.
- Resumen automático de tareas completadas, pendientes y progreso.
- Notificaciones dinámicas para tareas pendientes, próximas o vencidas.
- Estado visual para tareas vencidas: fondo rojo y texto blanco.
- Calendario mensual que muestra las tareas según su fecha de entrega.
- Diseño responsive: navegación completa en escritorio y menú compacto en pantallas pequeñas.

## Tecnologías

| Herramienta | Propósito |
|---|---|
| React 19 | Interfaz de usuario |
| Vite 8 | Servidor de desarrollo y build |
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

Las páginas principales y el calendario se cargan con `React.lazy()` y `Suspense`.

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

## Notificaciones

`src/utils/taskNotifications.js` crea notificaciones desde las tareas pendientes del usuario:

- Ordena por fecha de entrega.
- Marca como urgentes las tareas vencidas, de hoy o de mañana.
- Alimenta tanto la tarjeta de notificaciones del dashboard como el panel de la campana.

No se usan notificaciones estáticas para el dashboard.

## Calendario

El calendario usa la misma información compartida de `taskStorage.js`; no tiene un store independiente. Antes de mostrar una tarea, combina su definición con el progreso del usuario actual.

- `CalendarSection.jsx` administra el mes visible.
- `Day.jsx` genera los días mediante `useMonthDay`.
- `DayCard.jsx` filtra las tareas del curso por fecha.
- `DayModal.jsx` muestra, crea y completa tareas del día seleccionado.

## Estructura relevante

```text
src/
├── store/
│   ├── AuthStore.js          # Sesión, curso seleccionado y progreso individual
│   ├── courseStore.js        # Estado de selección del curso
│   └── taskStorage.js        # Tareas compartidas y persistentes por curso
├── utils/
│   ├── taskStatus.js         # Estados visuales de las tareas
│   └── taskNotifications.js  # Notificaciones derivadas de tareas
├── data/
│   └── data.jsx              # Datos fijos de los cursos
├── page/
│   ├── home.jsx
│   ├── SelectCourse.jsx
│   └── Course.jsx
└── components/
    ├── Header/               # Navegación principal y autenticación
    ├── Form/                 # Login y registro
    └── Course/
        ├── DasboardSection/  # Dashboard, tareas y notificaciones
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
│   └── useMonthDay.jsx
├── page/
│   ├── home.jsx
│   ├── SelectCourse.jsx
│   ├── Course.jsx
│   └── css/Calendar.css
├── store/
│   ├── AuthStore.js
│   ├── courseStore.js
│   └── taskStorage.js
├── utils/
│   ├── taskNotifications.js
│   └── taskStatus.js
└── components/
    ├── Layout/Layout.jsx
    ├── Header/header.jsx
    ├── Footer/Footer.jsx
    ├── Form/
    │   ├── FormSection.jsx
    │   └── modales/{Login.jsx, Reguister.jsx}
    ├── Perfil/
    │   ├── Perfil.jsx
    │   └── ButtonLogout/ButtonLogout.jsx
    ├── Button/{ButtonPrincipal.jsx, ButtonSecondary.jsx}
    ├── CardRol/RoleCard.jsx
    ├── Home/
    │   ├── hero/hero.jsx
    │   ├── Role/RoleSection.jsx
    │   ├── CallToAction/CallToAction.jsx
    │   └── features/
    │       ├── featuresSection.jsx
    │       ├── CalendarCard/Calendar.jsx
    │       ├── ManagementCard/ManagementCard.jsx
    │       └── Progress/Progress.jsx
    ├── SelectCourse/
    │   ├── Hero/Hero.jsx
    │   └── Course-card/
    │       ├── Course-Card.jsx
    │       └── Card/CourseCard.jsx
    └── Course/
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
        │       └── TaskItem/TaskItem.jsx
        └── CalendarSection/
            ├── CalendarSection.jsx
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
