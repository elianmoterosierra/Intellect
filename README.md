# Intellect — Plataforma de Gestión Académica

Aplicación web **React + Vite** para la gestión académica de estudiantes. Permite seleccionar cursos, visualizar tableros con tareas, calendario, rachas de estudio y notificaciones.

---

## Tecnologías

| Herramienta | Versión | Propósito |
|-------------|---------|-----------|
| React | ^19.2.7 | UI |
| Vite | ^8.1.1 | Bundler y dev server |
| React Router | ^8.2.0 | Enrutamiento SPA |
| Zustand | ^5.0.14 | Estado global |
| Tailwind CSS | ^3.4.19 | Estilos utilitarios + animaciones |
| ESLint | ^10.6.0 | Linting |
| React Compiler | — | Memorización automática (React Forget) |
| PostCSS / Autoprefixer | — | Procesamiento CSS |

---

## Estructura del Proyecto

```
elian-proyect/
├── .gitignore
├── .vscode/
│   ├── settings.json              # Configuración VS Code + Tailwind IntelliSense
│   └── tailwind.json              # Directivas CSS (@tailwind, @apply, @layer)
├── eslint.config.js
├── index.html                     # HTML raíz (fuentes: Inter, Material Symbols)
├── package.json
├── postcss.config.js
├── tailwind.config.js             # Animaciones personalizadas + tema
├── vite.config.js                 # Config Vite + React Compiler
├── public/
│   ├── favicon.svg                # Logo rayo morado (Intellect)
│   └── icons.svg                  # Sprite SVG (redes sociales)
├── src/
│   ├── main.jsx                   # Entry point → renderiza <App />
│   ├── App.jsx                    # Router (lazy loading de páginas)
│   ├── index.css                  # Tailwind directives + variables + animaciones globales
│   ├── store/
│   │   ├── courseStore.js         # Zustand: selección de curso + localStorage
│   │   ├── AuthStore.js           # Zustand: autenticación + localStorage
│   │   └── calendarStore.js       # Zustand: tareas por fecha del calendario
│   ├── data/
│   │   ├── data.jsx               # Datos mock: 4 cursos con tareas
│   │   └── notifications.json     # Datos mock de notificaciones por curso
│   ├── Hooks/
│   │   ├── useMonthDay.jsx        # Hook: genera metadatos de los días del mes
│   │   └── useDaysInMonth.jsx     # Utilidad: retorna total de días en un mes dado
│   ├── utils/
│   │   └── taskStatus.js          # Funciones: getDaysDifference, getTaskStatusConfig
│   ├── page/
│   │   ├── home.jsx               # Página de inicio (/)
│   │   ├── SelectCourse.jsx       # Página de selección de curso (/course)
│   │   ├── Course.jsx             # Dashboard del curso (/course-dashboard/:courseId)
│   │   ├── Calendar.jsx           # Página calendario (no enrutada)
│   │   └── css/
│   │       └── Calendar.css       # Estilos del calendario (único CSS externo activo)
│   ├── components/
│   │   ├── Layout/
│   │   │   └── Layout.jsx         # Header + Outlet (react-router)
│   │   ├── Header/
│   │   │   └── header.jsx         # Navbar principal con auth modal
│   │   ├── Form/
│   │   │   ├── FormSection.jsx    # Modal de Login/Register con toggle animado
│   │   │   └── modales/
│   │   │       ├── Login.jsx      # Formulario de inicio de sesión
│   │   │       └── Reguister.jsx  # Formulario de registro
│   │   ├── Footer/
│   │   │   └── Footer.jsx         # Footer con enlaces legales
│   │   ├── Button/
│   │   │   ├── ButtonPrincipal.jsx
│   │   │   └── ButtonSecondary.jsx
│   │   ├── CardRol/
│   │   │   └── RoleCard.jsx
│   │   ├── Home/
│   │   │   ├── hero/hero.jsx
│   │   │   ├── features/
│   │   │   ├── Role/RoleSection.jsx
│   │   │   └── CallToAction/
│   │   ├── SelectCourse/
│   │   │   ├── Hero/Hero.jsx
│   │   │   └── Course-card/
│   │   │       ├── Course-Card.jsx
│   │   │       └── Card/CourseCard.jsx
│   │   ├── Perfil/
│   │   │   └── Perfil.jsx         # Menú de perfil de usuario
│   │   └── Course/
│   │       ├── DasboardSection/
│   │       │   ├── AppBar(mobile)/
│   │       │   │   └── AppBar.jsx
│   │       │   ├── BottomNav(mobile)/
│   │       │   │   └── BottomNav.jsx
│   │       │   ├── Dashboard/
│   │       │   │   └── Dashboard.jsx
│   │       │   ├── Header/
│   │       │   │   └── HeaderDashboard.jsx
│   │       │   ├── Notification/
│   │       │   │   └── Notification.jsx
│   │       │   ├── NotificationPanel/
│   │       │   │   └── NotificationPanel.jsx
│   │       │   ├── TaskSummary/
│   │       │   │   └── TaskSummary.jsx
│   │       │   ├── SideNav/
│   │       │   │   └── SideNav.jsx
│   │       │   └── UpcomingTasks/
│   │       │       └── UpcomingTasks.jsx
│   │       └── CalendarSection/   # Cargado con React.lazy()
│   │           ├── CalendarSection.jsx
│   │           └── Day/
│   │               ├── Day.jsx            # Renderiza lista de DayCards del mes
│   │               ├── DayCard/
│   │               │   └── DayCard.jsx    # Tarjeta visual de cada día (tipo: today/past/weekend/future)
│   │               └── DayModal/
│   │                   ├── DayModal.jsx   # Modal de detalle del día con tareas
│   │                   └── DayModalComponents/
│   │                       ├── AddTask.jsx    # Botón para mostrar/ocultar el formulario de nueva tarea
│   │                       ├── FormTask.jsx   # Formulario para crear una nueva tarea en el día
│   │                       └── TaskList/
│   │                           └── TaskList.jsx  # Lista de tareas del día con botón "Completar"
└── dist/                          # Build de producción (generado)
```

---

## Rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `home.jsx` | Landing page con hero, features, roles y CTA |
| `/course` | `SelectCourse.jsx` | Selección de curso (1 a la vez) |
| `/course-dashboard/:courseId` | `Course.jsx` | Dashboard del curso (tareas, calendario, rachas) |

Todas las rutas usan `React.lazy()` + `Suspense` para división de código.
`CalendarSection` dentro del dashboard también se carga con `React.lazy()`.

---

## Estado Global (Zustand)

**`courseStore.js`** maneja:
- `buttonStatus` → ID del curso seleccionado (persiste en `localStorage`)
- `handleSelect(id)` → Selecciona un curso (simula 800ms de procesamiento)
- `handleLeave(id)` → Abandona el curso actual
- `syncFromStorage()` → Sincroniza desde `localStorage` al montar

Solo **un curso** puede estar seleccionado a la vez.

**`AuthStore.js`** maneja:
- `isLoggedIn` / `userName` → Estado de autenticación (persiste en `localStorage`)
- `login(userName)` → Inicia sesión
- `register(userName)` → Registra un nuevo usuario
- `logout()` → Cierra sesión

> **Nota:** El archivo `authStore.js` (minúscula) fue eliminado; el store activo es `AuthStore.js`.

---

## Autenticación

El Header detecta si el usuario está logueado:
- **No logueado** → clic en "Cursos" abre un modal con `FormSection` (Login/Register conmutables)
- **Logueado** → clic en "Cursos" navega directamente a `/course`

El modal tiene un **switch animado** con indicador deslizante y formularios con entrada escalonada.

---

## Hooks Personalizados

### `useMonthDay(year, month)`
Ubicado en `src/Hooks/useMonthDay.jsx`. Genera con `useMemo` el array completo de días del mes, enriqueciendo cada día con:
- `id` → clave `"year-month-day"` para indexar tareas
- `name` → nombre del día de la semana en español
- `number` → número de día
- `type` → clasificación: `'today'`, `'tomorrow'`, `'past'`, `'weekend'`, `'future'`

### `useDaysInMonth(year, month)`
Ubicado en `src/Hooks/useDaysInMonth.jsx`. Función utilitaria que retorna el número total de días en el mes dado.

---

## Utilidades

### `src/utils/taskStatus.js`

| Función | Descripción |
|---------|-------------|
| `getDaysDifference(targetDate, currentDate?)` | Calcula la diferencia en días de calendario entre dos fechas (ignorando horas) |
| `getTaskStatusConfig(targetDate, currentDate?)` | Retorna estilos visuales (Tailwind) y texto de badge según la urgencia de la tarea |

**Lógica de `getTaskStatusConfig`:**

| Diferencia | Estado | Fondo | Ícono | Badge |
|---|---|---|---|---|
| 1 día (mañana) | `tomorrow` | Ámbar | `warning` (Material Symbols) | `Queda 1 día (Mañana)` |
| 2 días (pasado mañana) | `dayAfterTomorrow` | Esmeralda | — | `🌱 Pasado mañana (2 días)` |
| 3+ días / hoy / pasado | `normal` | Neutro | — | — |

> Los estados se calculan en cada render comparando contra `new Date()`, nunca se almacenan como valor fijo.

---

## Sistema de Calendario (DayModal)

El calendario mensual del dashboard incluye un sistema completo de gestión de tareas por día:

- **`CalendarSection.jsx`** — Contenedor principal del calendario, cargado con `React.lazy()`
- **`Day.jsx`** — Renderiza el grid de `DayCard`s para el mes activo usando `useMonthDay`
- **`DayCard.jsx`** — Tarjeta visual por día; aplica `getTaskStatusConfig` en cada tarea para mostrar píldoras con color y el ícono `warning` de Material Symbols cuando corresponde
- **`DayModal.jsx`** — Modal al hacer clic en un día; muestra tareas y permite agregar nuevas. El botón "Agregar tarea" se deshabilita para hoy y días pasados (`isToday || isPast`)
- **`AddTask.jsx`** — Botón que alterna el formulario; recibe la prop `disabled` para días no editables
- **`FormTask.jsx`** — Formulario con campos título y descripción para crear una tarea en el día
- **`TaskList.jsx`** — Lista las tareas del día; aplica `getTaskStatusConfig(dayDate)` para mostrar fondo de color, ícono `warning` (Material Symbols) y badge de urgencia por cada tarea

---

## Datos Mock

**`src/data/data.jsx`** contiene 4 cursos:
1. **Ingeniería de Software** — 8 tareas, 6 notificaciones
2. **Electricidad** — 6 tareas, 4 notificaciones
3. **Refrigeración** — 7 tareas, 5 notificaciones
4. **Comercio Internacional** — 5 tareas, 3 notificaciones

Cada tarea incluye: id, título, descripción, fecha, hora, materia, nivel de urgencia y estado.

**`src/data/notifications.json`** — Datos de notificaciones separados del archivo principal de cursos.

---

## Dashboard del Curso

El dashboard (`Course.jsx`) contiene:
- **HeaderDashboard** — Saludo al usuario
- **Notification** — Notificaciones del curso (urgentes en rojo, normales en azul)
- **TaskSummary** — Resumen de tareas (completadas, pendientes y barra de progreso)
- **UpcomingTasks** — Tareas con checkbox, badges de tiempo restante y botón "Nueva Tarea"
- **CalendarSection** — Calendario mensual con DayCards y sistema de modal por día (cargado bajo demanda con `React.lazy()`)
- **SideNav** (escritorio) — Navegación lateral con opción "Salir del curso"
- **AppBar** + **BottomNav** (móvil) — Navegación adaptativa

---

## Animaciones

Definidas en `tailwind.config.js` como keyframes personalizados:

| Clase | Duración | Efecto |
|-------|----------|--------|
| `animate-fadeIn` | 0.5s | Escala 0.9 + translateY 20px → 1 |
| `animate-slideInLeft` | 0.5s | Desliza desde izquierda (40px) con fade |
| `animate-slideInRight` | 0.5s | Desliza desde derecha (40px) con fade |
| `animate-overlayIn` | 0.35s | Fade in del overlay del modal |
| `animate-pillIn` | 0.35s | Escala del indicador del switch |
| `animate-inputIn` | 0.4s | Fade + translateY de inputs (con delays escalonados) |

---

## Estilos

El proyecto usa un **enfoque híbrido**:
- **Tailwind CSS** para estilos inline en JSX (mayoría del proyecto)
- **`src/index.css`** — Tailwind directives, variables CSS, animaciones globales
- **`src/page/css/Calendar.css`** — Único archivo CSS externo activo (estilos del calendario)
- Animaciones de entrada definidas como keyframes de Tailwind

---

## Scripts Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo Vite
npm run build    # Build de producción
npm run preview  # Vista previa del build
npm run lint     # ESLint
```

---

## Actualización: estado y rendimiento del calendario

### `src/store/calendarStore.js`

El calendario usa un store de Zustand independiente para las tareas del calendario:

- `tasksByDate` guarda las tareas indexadas por la clave `"year-month-day"`.
- `addTask(dateKey, newTask)` agrega una tarea a una fecha.
- `toggleTask(dateKey, taskId)` alterna el estado `completed` de una tarea.
- Las fechas iniciales se generan con `Date#setDate`, por lo que funcionan correctamente al cambiar de mes.

### Renderizado selectivo

`Day` solo genera los metadatos del mes mediante `useMonthDay(year, month)`. Cada `DayCard` se suscribe de forma selectiva a `tasksByDate[day.id]`:

```jsx
const tasks = useCalendarStore(
  (state) => state.tasksByDate[day.id] ?? EMPTY_TASKS
);
```

Al crear, completar o reabrir una tarea, únicamente cambia el arreglo de tareas de esa fecha. Por ello, Zustand notifica a la tarjeta del día afectado y no vuelve a renderizar el contenedor `Day` ni las demás tarjetas.

El estado de apertura del detalle también es local a cada `DayCard` (`isModalOpen`). Abrir o cerrar un modal no actualiza el resto del calendario. El modal conserva la regla `disabled={isToday || isPast}`, que impide agregar tareas para el día actual y los días pasados.

### Cambios en el hook `useMonthDay`

`useMonthDay(year, month)` ahora devuelve únicamente los metadatos inmutables de cada día (`id`, `name`, `number` y `type`). Las tareas se leen directamente desde `calendarStore` dentro de `DayCard`; ya no se reciben como tercer parámetro del hook.

## Observaciones

- El store `authStore.js` (minúscula) fue eliminado; el único activo es `AuthStore.js`.
- El link "Ver mi Curso" en el Header se **deshabilita visualmente** si no hay un curso seleccionado.
- Los datos son **100% mock** — no hay integración con API.
- La sección "Tasks" del SideNav está pendiente de implementar.
- `notifications.json` fue separado de `data.jsx` para mejorar la organización de los datos mock.
- Los íconos de urgencia en tareas usan `material-symbols-outlined` (Google Fonts), no emojis; el texto dentro del `<span>` debe estar **sin espacios en blanco** para que el font renderice el glifo correctamente.
