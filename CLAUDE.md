# CLAUDE.md

Guía para agentes que trabajen en el proyecto **Intellect** (anteriormente `elian-proyect`). Léela antes de modificar código: resume arquitectura, convenciones y comandos para evitar romper el modelo de datos compartidos.

## IMPORTANTE

Al momento que vayas a explicar lo que ahi que hacer explicamelo de manera breve y sencilla sin muchos tecnicismos, y tambien no toques ningun archivo sin mi consentimiento.

## 1. Resumen del proyecto

Plataforma web de **gestión académica** construida con **React 19 + Vite 8**, con autenticación local, selección de curso, tareas compartidas por curso con progreso individual por usuario, calendario mensual y notificaciones derivadas de la fecha de entrega. Todo el estado se persiste en `localStorage` (no hay backend).

- **Nombre interno del repo:** `elian-proyect` (`package.json`).
- **Producto:** Intellect.
- **Tipo de app:** SPA con `react-router` 8 y `lazy()` por ruta.

## 2. Stack y dependencias

| Herramienta | Versión | Propósito |
|---|---|---|
| React | 19.2 | UI |
| React DOM | 19.2 | Render |
| React Router | 8.2 | Ruteo SPA |
| Zustand | 5.0 | Estado global y stores |
| Vite | 8.1 | Dev server / build |
| `@vitejs/plugin-react` + Babel | última | React Compiler (`reactCompilerPreset`) |
| Tailwind CSS | 3.4 | Estilos y animaciones custom |
| ESLint | 10 | Lint (`@eslint/js`, `react-hooks`, `react-refresh`) |

> Hay `babel-plugin-react-compiler` y `@rolldown/plugin-babel` activos. No introduzcas soluciones que dependan de runtime que se opongan al compilador (p. ej. mutación de props).

## 3. Comandos

```bash
npm run dev      # Vite dev server
npm run build    # Build de producción (revisa errores de tipo/import)
npm run preview  # Sirve dist/
npm run lint     # ESLint sobre .js/.jsx (ignora dist/)
```

Antes de cerrar una tarea, ejecuta **lint** y, si toca código de producción, **build**.

## 4. Estructura de carpetas

```
src/
├── App.jsx                       # Router + lazy + Suspense + Layout
├── main.jsx                      # createRoot + StrictMode
├── index.css                     # Tailwind base + tokens
├── assets/                       # Imágenes y SVGs estáticos
├── data/                         # data.jsx (cursos), notifications.json
├── Hooks/                        # useDaysInMonth, useMonthDay, useSwipe, useSearchFilter, useMediaQuery
├── page/                         # Páginas (rutas)
│   ├── home.jsx
│   ├── SelectCourse.jsx          # Exporta { CoursePage }
│   ├── Course.jsx                # Dashboard del curso
│   └── css/Calendar.css
├── ProtectedRoutes/
│   └── DashBoardProtected.jsx    # HOC/guard de auth para /course y /course-dashboard/:id
├── store/
│   ├── AuthStore.js              # Sesión + usuarios + progreso individual
│   ├── courseStore.js            # Estado de selección del curso
│   ├── taskStorage.js            # Tareas compartidas por curso
│   └── uiStore.js                # Apertura/cierre de modales (AddTask, Perfil)
├── utils/
│   ├── courseSections.js         # COURSE_SECTIONS: claves de navegación del curso
│   ├── taskStatus.js             # overdue / tomorrow / dayAfterTomorrow / normal
│   ├── taskNotifications.js      # Notificaciones derivadas de tareas pendientes
│   └── dateNavigation.js         # Helpers de mes (anterior/siguiente/hoy) + persistencia
                                   #   del último mes visto por curso en sessionStorage
└── components/
    ├── Layout/Layout.jsx
    ├── Header/                   # header.jsx
    ├── Footer/Footer.jsx
    ├── Form/                     # FormSection + modales (Login.jsx, Reguister.jsx)
    ├── Perfil/                   # Perfil + ButtonLogout + FieldEditModal + PasswordConfirmModal
    ├── Button/                   # ButtonPrincipal, ButtonSecondary
    ├── CardRol/RoleCard.jsx
    ├── Home/                     # hero, Role, CallToAction, hamburgerMenu, features/{featuresSection,
    │                             #   CalendarCard, ManagementCard, Progress}
    ├── SelectCourse/             # Hero, Course-card/{Course-Card, Card/CourseCard}
    ├── Perfil/                   # Perfil + ButtonLogout
    ├── SettingsModal/            # SettingsModal: ajustes + vista "Acerca de"
    └── Course/
        ├── AddTaskSection/       # Sección "Agregar Tareas" (AddTaskSection,
        │                         #   DeleteTaskButton, TaskList,
        │                         #   ConfirnDelete/ConfirmDelete)
        ├── Common/               # DetailsModal: modal de detalle reusado
        │                         #   desde Dashboard, AddTaskSection, Calendar y
        │                         #   Notificaciones. Lee `completed` en vivo.
        │                         # ExitModal: confirmación al abandonar curso.
        ├── DasboardSection/      # Dashboard, Header, Notification/,
        │                         # NotificationPanel/, SideNav, TaskSummary,
        │                         # AppBar (mobile) + SearchDropdown,
        │                         # BottomNav (mobile),
        │                         # UpcomingTasks/{AddTask, AddTaskModal, TaskItem}
        └── CalendarSection/      # CalendarSection, MonthGroup, Header,
                                  #   Day/{Day, DayCard,
                                  #   DayModal/{DayModal,
                                  #   DayModalComponents/{AddTask, FormTask, TaskList}}}
```

> **Ojo con los typos históricos:** `DasboardSection` (sin la segunda “h”), `Reguister.jsx` y
> la carpeta `AddTaskSection/ConfirnDelete/` (con la n y la r invertidas en `Confirn`).
> Mantén la capitalización y nombres de archivo existentes; renombrarlos rompe imports.

## 5. Modelo de datos (localStorage)

### Claves

- `users` — array de cuentas registradas.
- `auth` — `{ isLoggedIn: true, user }` cuando hay sesión; se elimina al hacer `logout`.
- `tasksByCourse` — mapa `{ [courseId]: Task[] }` con tareas **compartidas** del curso.

### Forma de un usuario

```js
{
  name: string,
  email: string,        // normalizado a lowercase
  password: string,     // ⚠️ demo local, NO producción
  selectedCourseId: string | null,
  taskStatusByCourse: {
    [courseId]: {
      [taskId]: { completed: boolean, /* ... */ }
    }
  }
}
```

### Forma de una tarea

```js
{
  id: crypto.randomUUID(),
  title: 'Terminar informe',
  subtitle: 'Física',
  dueDate: '2026-07-24T23:59:00.000Z',  // ISO, UTC
  hour: '24 jul',                        // etiqueta formateada lista para UI
}
```

`completed` **nunca** se guarda en la tarea compartida. Se deriva de `user.taskStatusByCourse[courseId][taskId].completed`. Combina las dos fuentes antes de renderizar (dashboard, calendario, notificaciones).

## 6. Stores (Zustand)

### `useAuthStore` — `src/store/AuthStore.js`

- Estado: `isLoggedIn`, `user`, `users` (todos se hidratan desde `localStorage` al crear el store).
- Acciones:
  - `login({ email, password })` → `{ success, user|error }`.
  - `register({ name, email, password })` → normaliza email, valida duplicados.
  - `setSelectedCourse(courseId)` — persiste en `users` y `auth`.
  - `toggleTaskStatus(courseId, taskId)` — invierte `completed` solo del usuario actual.
  - `logout()` — limpia `auth` (no `users`).
- Persistencia: **manual** con `localStorage` en cada acción (no usa middleware `persist`).
- Almacena contraseñas en claro: **no apto para producción**.

### `useTaskStore` — `src/store/taskStorage.js`

- Estado: `tasksByCourse`.
- Acciones:
  - `addTask(courseId, task)` — añade al array del curso y persiste.
  - `deleteTask(courseId, taskId)` — filtra y persiste.
- Es la **única** fuente de definiciones de tareas; el calendario y el dashboard la consumen directo.

### `useCourseStore` — `src/store/courseStore.js`

- Wrapper de UI para seleccionar/abandonar curso. Sincroniza con `user.selectedCourseId` de `useAuthStore`.

### `useUIStore` — `src/store/uiStore.js`

- Estado visual de modales globales (`isAddTaskModalOpen`, `isPerfilModalOpen`).
- Acciones: `openAddTaskModal()` / `closeAddTaskModal()` / `openPerfilModal()` / `closePerfilModal()`.
- Permite abrir modales desde Header, BottomNav o AppBar sin prop drilling.

## 7. Rutas y protecciones

| Ruta | Componente | Protegida |
|---|---|---|
| `/` | `HomePage` (`page/home.jsx`, lazy) | No |
| `/course` | `CoursePage` (`page/SelectCourse.jsx`, lazy) | `DashBoardProtected` |
| `/course-dashboard/:courseId` | `Course` (`page/Course.jsx`, lazy) | `DashBoardProtected` |

- Carga con `React.lazy` + `Suspense` → `PageLoader` (spinner inline, no CSS externo).
- `Layout` envuelve rutas públicas; las protegidas se renderizan dentro de su guard.
- `DashBoardProtected` debe redirigir a `/` (login) si no hay sesión y a `/course` si ya hay curso seleccionado pero la ruta exige uno nuevo (verifica antes de asumir comportamiento).

## 8. Estados de tarea (`utils/taskStatus.js`)

Derivados en cada render desde `dueDate` y el `completed` del usuario:

| Estado | Condición | UI |
|---|---|---|
| `overdue` | `dueDate < ahora` y no completada | Fondo rojo, texto blanco, badge “Tarea vencida” |
| `tomorrow` | Vence mañana | Ámbar con alerta |
| `dayAfterTomorrow` | Vence en dos días | Esmeralda |
| `normal` | Resto | Neutro |

Una tarea completada nunca aparece como vencida.

## 8.6 Límites de texto por contexto

Para mantener la UI ordenada, los títulos/descripciones se truncan o limitan según dónde se muestran:

| Campo | Ubicación | Límite |
|---|---|---|
| Título | Dashboard / AddTaskSection | 20 chars |
| Título | Calendario (DayCard) | 15 chars |
| Título | Notificaciones | 10 chars |
| Subtítulo | Dashboard / AddTaskSection | 30 chars |
| Título (input) | Modal crear tarea | 30 chars |
| Descripción (textarea) | Modal crear tarea | 2000 chars (contador en vivo, auto-resize hasta 6 líneas, Guardar se bloquea al exceder) |

## 8.5 Secciones del curso (`utils/courseSections.js`)

- `COURSE_SECTIONS` exporta las claves canónicas que se renderizan en `Course.jsx`:
  `DASHBOARD` (`'dashboard'`), `CALENDAR` (`'calendar'`), `ADD_TASKS` (`'Agregar Tareas'`).
- Es la **única fuente** de las keys de `activeSection`. `SideNav`, `BottomNav` y `Course.jsx`
  las importan desde aquí; no hardcodear strings sueltas en los navs.
- La sección `ADD_TASKS` renderiza `<AddTaskSection courseId={...} />` con `React.lazy()`
  y muestra la lista completa de tareas del curso con botón de eliminar.
- La confirmación de borrado vive en `AddTaskSection/ConfirnDelete/ConfirmDelete.jsx`
  y se reutiliza desde `DeleteTaskButton` (no abrir un modal propio por botón).
- El modal de creación de tareas vive en `DasboardSection/UpcomingTasks/AddTaskModal/TaskModal.jsx`
  y se reutiliza tanto desde el dashboard (`AddTaskButton`) como desde `AddTaskSection`.
- El modal de detalle de tarea vive en `Course/Common/DetailsModal/` y se reutiliza desde
  Dashboard (`TaskItem`), AddTaskSection (`TaskList`), Calendar (`DayModal.TaskList`) y
  el panel de notificaciones. Lee `completed` en vivo del store de auth.

## 9. Notificaciones (`utils/taskNotifications.js`)

- Se generan desde las **tareas pendientes** del usuario actual.
- Ordenadas por `dueDate`.
- Marcan como urgentes: vencidas, hoy o mañana.
- Alimentan la tarjeta de notificaciones del dashboard y el panel de la campana del header.
- **No** hay notificaciones hardcodeadas para el dashboard: si ves `notifications.json`, es solo histórico/referencia.

## 10. Calendario

- `CalendarSection.jsx` — controla el mes visible y persiste el último mes visto por curso en `sessionStorage` (clave `intellect.calendar.lastMonth.<courseId>`). Al recargar la pestaña se restaura; al cerrar el navegador vuelve a "hoy".
- `Day.jsx` — genera días con `useMonthDay`.
- `DayCard.jsx` — filtra tareas del curso por fecha.
- `DayModal.jsx` — muestra, crea y completa tareas del día seleccionado (contiene `AddTask`, `FormTask`, `TaskList`).
  Al hacer clic en una tarea del listado del día, cierra el modal del día y abre el `DetailsModal` (`Common`).
- Reusa la fuente única de `taskStorage` + estado individual de `AuthStore`; **no** mantener un store paralelo.
- El `date-selector` del header (`HeaderCalendar.jsx`) ofrece:
  - Botón "Hoy" entre las flechas (deshabilitado cuando el mes mostrado es el actual).
  - `aria-label` en los tres botones para accesibilidad.
  - Swipe horizontal en móvil (gesto vertical se ignora para no chocar con el scroll).
- La navegación entre meses se delega al padre; el header solo recibe callbacks y estado.

### 10.1 Calendario móvil (scroll infinito)

- `CalendarSection.jsx` mantiene una lista `months` con los meses visibles. Dos centinelas (top/bottom) con `IntersectionObserver` cargan meses anteriores/siguientes sin límite.
- `MonthGroup.jsx` renderiza cada mes con lazy loading vía `IntersectionObserver` (`rootMargin: 600px`). Mientras el mes no entra cerca del viewport, muestra un **skeleton grid** con celdas `aspect-square` vacías que reservan la misma altura que el contenido real, evitando reflows en la transición.
- Al anteponer un mes (centinela superior), se activa `forceVisible` para que el nuevo mes renderice inmediatamente sus `DayCards`, y un `useLayoutEffect` ajusta el `scrollTop` del contenedor para mantener la posición visual del usuario.
- Grid mobile: `repeat(2, 1fr)`; desktop: 4 columnas.
- `DayCard` usa `aspect-square md:aspect-auto`, trunca títulos a 20 caracteres y muestra máximo 3 tareas visibles.

## 11. Estilos y theming

- Tailwind 3 + tokens propios en `src/index.css`.
- Animaciones custom declaradas en `tailwind.config.js`: `fadeIn`, `slideInRight`, `slideInLeft`, `overlayIn`, `pillIn`, `inputIn`, `overlayOut`, `modalOut`. Reutilízalas en lugar de inventar nuevas cuando aplique.
- Tipografías cargadas por `<link>` en `index.html` (Inter y Material Symbols Outlined). Los iconos vienen de la fuente `Material Symbols Outlined` con clases utilitarias.
- `eslint.config.js` usa configuración flat: ignora `dist`, aplica `react-hooks/recommended` y `react-refresh/vite` sobre `**/*.{js,jsx}`.

## 12. Convenciones de código

- **Componentes funcionales** + hooks. Sin clases.
- JSX con extensión `.jsx`.
- `export default` para componentes de página y componente principal; **named exports** para stores y utilidades.
- Comentarios concisos en español (mantén el tono del proyecto).
- Estados globales solo con Zustand; nada de Context para cosas de negocio.
- Persistencia manual: si añades un nuevo store, persiste a `localStorage` desde la acción, no con `persist` middleware, salvo que migres todo.
- Fechas siempre **ISO UTC** en `dueDate`; formatea en el borde de la UI.
- Ids con `crypto.randomUUID()`.
- Nombres de archivo tal cual están (incluyendo los typos históricos `DasboardSection` y `Reguister.jsx`); al refactorizar, busca los import sites primero.

## 13. Responsive

- Sidebar de navegación completa en escritorio.
- `AppBar` + `BottomNav` para móvil.
- Cualquier layout nuevo debe considerar ambos breakpoints.

## 14. Lo que NO hacer

- **No** guardes `completed` dentro de la tarea compartida en `tasksByCourse`.
- **No** crees un store paralelo al de tareas; el calendario debe leer de `useTaskStore` + `useAuthStore`.
- **No** metas credenciales en git: la app ya tiene passwords en `localStorage`; no las añadas también a logs.
- **No** introduzcas un backend o librería de auth nueva sin discutirlo: hoy es deliberadamente demo.
- **No** renombres `DasboardSection`, `Reguister.jsx` ni `AddTaskSection/ConfirnDelete/` sin actualizar todos los imports.
- **No** metas la lógica de notificaciones dentro de los componentes: vive en `utils/`.
- **No** hardcodees las keys de sección (`'dashboard'`, `'calendar'`, `'Agregar Tareas'`) en
  componentes de navegación: usa `COURSE_SECTIONS` desde `utils/courseSections.js`.
- **No** dupliques `monthNames` ni la lógica de mes en el header: vive en `utils/dateNavigation.js`.
- **No** guardes el mes visto del calendario en `localStorage` ni en un store nuevo: usa
  `sessionStorage` por curso con `loadSavedMonth` / `saveMonth` de `dateNavigation.js`.
- **No** abras un modal propio de creación o de detalle de tarea: reusa
  `DasboardSection/UpcomingTasks/AddTaskModal/TaskModal.jsx` y `Course/Common/DetailsModal/`.
- **No** dupliques la confirmación de borrado: usa `AddTaskSection/ConfirnDelete/ConfirmDelete.jsx`.
- **No** metas lógica de UI/modal en stores de dominio: la apertura de modales va en `useUIStore`.

## 15. Verificación antes de cerrar tarea

```bash
npm run lint
npm run build
```

Si modificas stores, limpia `localStorage` del navegador o considera versionar la clave si cambia el shape (`tasksByCourse`, `auth`, `users`).

## 16. Glosario rápido

- **Curso** — uno de los definidos en `data/data.jsx` (id estable).
- **Tarea compartida** — vive en `tasksByCourse[courseId]`, la ven todos los usuarios del curso.
- **Progreso individual** — `user.taskStatusByCourse[courseId][taskId].completed`; no afecta a otros usuarios.
- **Notificación** — derivado en runtime desde tareas pendientes; nunca se persiste.
- **Vencida** — `dueDate < now && !completed`.
- **Modal compartido** — `TaskModal`, `DetailsModal` y `ConfirmDelete` se reutilizan desde múltiples secciones; no abrir variantes paralelas.
- **Centinela** — elemento invisible con `IntersectionObserver` usado para cargar meses adyacentes en el calendario móvil.
- **Skeleton grid** — grilla de celdas vacías con `aspect-square` que reserva espacio antes de cargar un mes, evita saltos visuales.

---
Mantenlo breve: si añades una sección, borra la que quede obsoleta. La memoria del proyecto vive en el código; este archivo apunta a ella.
