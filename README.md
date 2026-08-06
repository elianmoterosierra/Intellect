# Intellect — Plataforma de Gestión Académica

Aplicación web de gestión académica creada con React y Vite. Permite registrar usuarios, seleccionar un curso, crear y organizar tareas, consultar un calendario mensual y recibir notificaciones basadas en las fechas de entrega.

## Funcionalidades

- Registro, inicio y cierre de sesión con persistencia local.
- Un curso seleccionado por cada usuario.
- Creación de tareas compartidas por todos los miembros de un curso.
- Modal único de creación de tareas (`AddTaskModal/TaskModal.tsx`) reusado desde el dashboard y la sección "Agregar Tareas".
- Descripción con textarea de auto-resize hasta 6 líneas, contador de caracteres en vivo y botón Guardar bloqueado al superar el límite de 2000 caracteres en el modal de creación.
- Sección dedicada para la visualización y gestión de "Agregar Tareas" (`AddTaskSection`).
- Eliminación de tareas del curso desde la sección "Agregar Tareas", con confirmación previa en `ConfirnDelete/ConfirmDelete.tsx`.
- Modal de detalle de tarea (`Common/DetailsModal`) integrado en todos los listados, con estado `completed` en vivo desde el store.
- Constantes centralizadas para la gestión de secciones (`courseSections.ts`).
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
- Confirmación en 2 pasos al abandonar un curso, con protección contra borrado accidental.
- Modal de ajustes (`SettingsModal`) con vista "Acerca de" mostrando versión y tecnologías.
- Diseño responsive: navegación completa en escritorio y menú compacto en pantallas pequeñas.

## Tecnologías

| Herramienta | Propósito |
|---|---|
| React 19 | Interfaz de usuario |
| Vite 8 | Servidor de desarrollo y build |
| TypeScript | Tipado estático estricto (`strict`, `noUncheckedIndexedAccess`) |
| `@vitejs/plugin-react` + `@rolldown/plugin-babel` | Pipeline de React con Babel |
| `babel-plugin-react-compiler` | React Compiler (memoización automática) |
| React Router 8 | Rutas de la SPA |
| Zustand 5 | Estado global y persistencia local |
| Tailwind CSS 3 | Estilos y animaciones |
| ESLint + typescript-eslint | Análisis estático del código |

## Rutas

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio |
| `/course` | Selección de curso |
| `/course-dashboard/:courseId` | Dashboard, tareas, calendario y notificaciones del curso |

Las páginas principales, secciones y el calendario se cargan con `React.lazy()` y `Suspense`.

## Estado y persistencia

### Autenticación — `src/store/AuthStore.ts`

Gestiona los usuarios y la sesión actual en `localStorage`:

- `users`: cuentas registradas.
- `auth`: sesión activa con `isLoggedIn` y `user`.
- `login({ email, password })` e `register({ name, email, password })`.
- `logout()` para cerrar sesión.
- `setSelectedCourse(courseId)` para asociar el curso seleccionado al usuario.
- `toggleTaskStatus(courseId, taskId)` para guardar el estado individual de una tarea.
- `updateUser(field, value)` para editar nombre, email o contraseña del perfil.

Cada perfil guarda su progreso en `user.taskStatusByCourse`, sin modificar la tarea compartida:

```js
taskStatusByCourse: {
  [courseId]: {
    [taskId]: { completed: true },
  },
}
```

> La autenticación es local y de demostración. Las contraseñas se almacenan en `localStorage`; no es adecuada para producción sin un backend seguro.

### Curso — `src/store/courseStore.ts`

Mantiene el estado visual del curso seleccionado y lo sincroniza con `user.selectedCourseId` de `AuthStore`.

- `handleSelect(courseId)` selecciona un curso.
- `handleLeave(courseId)` elimina el curso asociado a la sesión.

### Tareas — `src/store/taskStorage.ts`

Es la única fuente de las definiciones de tareas. Las guarda bajo la clave `tasksByCourse` en `localStorage` y las agrupa por curso, por lo que todos los usuarios del mismo curso ven la misma lista.

- `addTask(courseId, task)` crea una tarea.
- `deleteTask(courseId, taskId)` elimina una tarea.

### UI — `src/store/uiStore.ts`

Controla el estado de apertura y cierre de modales de interfaz:

- `isAddTaskModalOpen` / `openAddTaskModal()` / `closeAddTaskModal()`
- `isPerfilModalOpen` / `openPerfilModal()` / `closePerfilModal()`

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

`src/utils/taskNotifications.ts` crea notificaciones desde las tareas pendientes del usuario:

- Ordena por fecha de entrega.
- Marca como urgentes las tareas vencidas, de hoy o de mañana.
- Alimenta tanto la tarjeta de notificaciones del dashboard como el panel de la campana.

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

- `src/store/` — Stores de Zustand (auth, cursos, tareas, UI)
- `src/utils/` — Helpers puros (fechas, estados, notificaciones)
- `src/data/` — Datos fijos de los cursos
- `src/Hooks/` — Hooks personalizados (calendario, swipe, búsqueda, media query)
- `src/page/` — Páginas (home, selección de curso, dashboard del curso)
- `src/components/` — Componentes de UI organizados por dominio
- `src/ProtectedRoutes/` — Guard de autenticación para rutas protegidas

## Rutas de archivos

```text
src/
├── App.tsx
├── main.tsx
├── types.ts
├── index.css
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── data/
│   ├── data.ts
│   └── notifications.json
├── Hooks/
│   ├── useDaysInMonth.ts
│   ├── useMediaQuery.ts        # Hook para detectar media queries
│   ├── useMonthDay.ts
│   ├── useSearchFilter.ts      # Filtro de búsqueda por título/subtítulo
│   └── useSwipe.ts             # Hook reutilizable para detectar swipe horizontal
├── page/
│   ├── home.tsx
│   ├── SelectCourse.tsx
│   ├── Course.tsx
│   └── css/Calendar.css
├── ProtectedRoutes/
│   └── DashBoardProtected.tsx  # Guard de rutas protegidas (redirige a / si no hay sesión)
├── store/
│   ├── AuthStore.ts
│   ├── courseStore.ts
│   ├── taskStorage.ts
│   └── uiStore.ts              # Control de apertura/cierre de modales
├── utils/
│   ├── courseSections.ts
│   ├── dateNavigation.ts       # Navegación de mes + persistencia en sessionStorage
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
    │   └── Course-card/
    │       ├── Course-Card.tsx
    │       └── Card/CourseCard.tsx
    ├── SettingsModal/
    │   └── SettingsModal.tsx             # Ajustes + vista "Acerca de"
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
npm run dev      # Inicia Vite en desarrollo
npm run build    # Genera el build de producción
npm run preview  # Sirve el build generado
npm run lint     # Ejecuta ESLint (flat config + typescript-eslint)
npm run typecheck # Chequeo de tipos con tsc -b --noEmit
```

## Verificación

Antes de publicar cambios, ejecuta en este orden:

```bash
npm run lint
npm run typecheck
npm run build
```

---

# Tarea en curso: Dark Mode (no finalizada)

> ⚠️ **IMPORTANTE**: Esta funcionalidad quedó **a medias**. Antes de continuar, revisa las secciones de abajo y termina los pasos pendientes.

## Objetivo

Añadir un **switch para modo oscuro** que cambie **toda la página** (no solo un componente) en las páginas **home**, **selectcourse** y **course** (dashboard completo: sidebar, calendario, modales, bottom nav, etc.), con un estado global **Zustand** compartido.

### Paleta oscura elegida (variables que deben aplicarse cuando está activo el tema oscuro)

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

## Avance (lo ya hecho) — Dark mode completo ✅

- [x] **`themeStore.ts`** (`src/store/themeStore.ts`, Zustand): `isDark`, `toggleTheme()`, `setTheme(dark)`, `initTheme()`. Persiste en `localStorage` (`theme`); `initTheme()` sigue `prefers-color-scheme` la primera vez y aplica/quita `.dark` en `document.documentElement`.
- [x] **`tailwind.config.ts`:** escalas vars (`gray/blue/green/red/amber/yellow/emerald`) + tokens semánticos (`page`, `surface`, `muted`, `muted-hover`, `muted-strong`, `muted-strong-hover`, `line`, `line-soft`, `ink`, `ink-soft`, `ink-faint`, `brand`, `brand-strong`, `brand-hover`, `brand-soft` 12%, `brand-tint` 8%, `brand-ring` 20%, `brand-faint` 6%, `on-brand`, `danger`), todo vía `rgb(var(--x) / <alpha-value>)`.

> Estas clases semánticas se usan así: `bg-page`, `bg-surface`, `text-ink`, `text-ink-soft`, `text-brand`, `bg-brand-strong`, `hover:bg-brand-hover`, `border-line`, `border-line-soft`, `bg-muted`, `bg-muted-strong`, etc.

- [x] **`src/index.css`:** variables de **todas** las escalas (`gray/blue/green/red/amber/yellow/emerald` 50-950) y tokens semánticos en bloques `:root` (claro) y `.dark` (oscuro), usando tripletes `N N N` (Tailwind los consume como `rgb(var(--x) / <alpha-value>)`). Se reemplazó la media query `@media (prefers-color-scheme: dark)` por el bloque `.dark` para no pelear con la elección explícita del usuario.
- [x] **`src/page/css/Calendar.css`:** bloque `.dark { ... }` al final que sobreescribe sus propias variables (`--primary`, `--background`, `--surface-container-low`, `--outline`, etc.) + estilos extra (`.day-card.today`, `.modal-task-item:hover`, `.status-success`, `.status-pending`, `.task-pill.green/.orange`).
- [x] **`src/page/css/Calendar.css`:** la variable de superficie se renombró a **`--cal-surface`**. Antes se llamaba `--surface` (igual que el token semántico global de Tailwind) y, al cargarse este CSS, `bg-surface` compilaba `rgb(#f9f9ff / 1)` (inválido) y todas las modales quedaban transparentes en dark y al volver a light.
- [x] **`.vscode/settings.json`:** `tailwindCSS.experimental.configFile` ahora apunta a `./tailwind.config.ts` (antes apuntaba a un `.js` inexistente y el IntelliSense no cargaba ningún config).
- [x] **`src/components/ThemeToggle/ThemeToggle.tsx`:** switch sol/luna que lee `useThemeStore` (clases `text-ink-soft hover:bg-brand-tint hover:text-brand active:scale-95`).
- [x] **`src/App.tsx`:** `useEffect` llama `useThemeStore.getState().initTheme()`.
- [x] **Switch colocado** en Header (desktop, antes de ajustes), HamburgerMenu (fila "Modo oscuro") y SideNav (fila "Modo oscuro").
- [x] **Refactor de ~30 componentes** (`Header`, `Hero`, `SelectCourse`, `Perfil`, `Dashboard`, `SideNav`, `CalendarSection`, `TaskModal`, `DayModal`, `AddTaskSection`, `FormTask`, `SearchDropdown`, `Notification`, `FormSection`, `Register`, `Login`, etc.) reemplazando colores hardcodeados por los tokens semánticos.
- [x] **`vite.config.ts`:** se añadió `build: { cssMinify: false }`. Era una mitigación para el CSS inválido que generaba `daisyui` 5.7.16 (`.dropdown-content: [object Object]`); queda inerte tras quitar el plugin. ⚠️ Problema **preexistente**, no del dark mode.
- [x] **`tailwind.config.ts`:** se **eliminó** `plugins: [require('daisyui')]`. No se usa ninguna clase daisyUI y el plugin rompía el build (`lightningcss`) **y** el Tailwind IntelliSense (su `require` en scope ESM hacía fallar la carga del config en la extensión). Con el plugin fuera, el autocompletado de tokens semánticos (`bg-surface`, `text-ink`, etc.) funciona.

## Pendiente ⚠️ (continuar aquí)

1. **Revisar visualmente** el dark mode completado en las vistas del curso (Dashboard, Calendario, Agregar Tareas) y cerrar los detalles finos de color que queden.
2. **Ajuste fino del diseño** en curso: header desktop de Home/SelectCourse ya usa `bg-surface/90` (#1A2032 en dark + blur) en vez de `bg-white/85`. Verificar el resto de componentes con fondo que aún use opacidades/tonos no deseados.
3. **Nota:** NUNCA renombrar typos históricos (`AddTaskSection`, `ConfirnDelete`). Mantener capitalización.

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
