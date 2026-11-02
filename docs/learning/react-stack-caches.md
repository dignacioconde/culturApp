# Estudiar React y el stack de Cachés

Esta guía es una memoria técnica **para estudiar el código real**. Empieza por el recorrido de un proyecto; después usa las secciones como mapa cuando encuentres un concepto desconocido. Los comentarios añadidos en los archivos citados explican el mismo recorrido junto al código.

## 0. Antes de abrir React

Necesitas reconocer cuatro ideas de JavaScript:

```js
const project = { name: 'Concierto', status: 'draft' }
const renamed = { ...project, name: 'Concierto de primavera' } // copia; no cambia project
const names = projects.map((item) => item.name) // transforma una lista
const active = projects.filter((item) => item.status === 'confirmed') // selecciona elementos
```

`async` y `await` permiten esperar una operación de red. Una promesa puede devolver datos o error; consulta `handleCreate` en `src/pages/Projects/ProjectList.jsx`. En JSX, `{expresión}` introduce JavaScript dentro del marcado. `className` corresponde al atributo HTML `class`.

## 1. Qué hace cada pieza del stack

| Pieza | Trabajo en este repositorio | Archivo para abrir |
| --- | --- | --- |
| Vite | Sirve módulos en desarrollo y genera la versión de producción. | `vite.config.js`, `index.html` |
| React | Dibuja componentes a partir de props y estado. | `src/main.jsx`, `src/components/ui/Button.jsx` |
| React Router | Selecciona una página según la URL. | `src/App.jsx` |
| Tailwind CSS v4 | Aplica clases de estilo; `src/index.css` define tokens como `bg-surface-card`. | `src/index.css`, `src/components/ui/Card.jsx` |
| Supabase | Autenticación y datos; los hooks encapsulan las consultas. | `src/supabaseClient.js`, `src/hooks/useProjects.js` |
| Vitest / Playwright | Comprueban lógica y recorridos de interfaz, respectivamente. | `src/lib/*.test.ts`, `e2e/` |
| Vercel | Publica la compilación de Vite. | `vercel.json` |

`pnpm dev` inicia la app local; `pnpm lint`, `pnpm test` y `pnpm build` comprueban código, pruebas y compilación. Para datos reales hacen falta las variables de entorno descritas en `README.md`. Nunca pongas una clave `service_role` en el cliente.

## 2. Del HTML a la página

1. `index.html` contiene `<div id="root"></div>` y carga `src/main.jsx`.
2. `main.jsx` llama a `createRoot(...).render(<App />)`. `StrictMode` ayuda a detectar problemas en desarrollo; por eso puedes observar efectos ejecutados más de una vez allí.
3. `App.jsx` monta `BrowserRouter`. Su tabla `<Routes>` asocia `/projects` con `ProjectList` y `/projects/:id` con `ProjectDetail`. `:id` es un parámetro de URL.
4. `PrivateRoute` espera a saber si existe sesión; `ProfileGate` comprueba perfil, onboarding y, si procede, rol admin. Una guarda de interfaz controla navegación; la protección de datos real debe estar en RLS de Supabase.
5. La página usa `PageWrapper` para barra superior, lateral y navegación móvil.

Ejercicio: sigue `/projects` desde `App.jsx` hasta el título que recibe `PageWrapper`. Después cambia mentalmente la URL a `/projects/123`: ¿qué componente se renderiza?

## 3. Componentes y props

Un componente es una función que devuelve JSX. `Button` recibe `children`, `variant`, `size` y otras props. El padre decide el texto y el evento; el botón decide el estilo:

```jsx
<Button variant="secondary" onClick={() => setIsModalOpen(true)}>
  Nuevo proyecto
</Button>
```

El ejemplo real está en `src/pages/Projects/ProjectList.jsx`. `children` es el contenido entre las etiquetas. `onClick` recibe una función para ejecutar más tarde; escribir `onClick={setIsModalOpen(true)}` la ejecutaría durante el render. `...props` en `Button.jsx` pasa al `<button>` atributos como `disabled` y `aria-label`.

`ContextNotesCard.jsx` muestra otro patrón: recibe `notes` y `onSave`, pero mantiene localmente `draft`, `editing` y `saving`. Así se puede editar sin modificar la nota original hasta guardar. El componente no sabe si la nota pertenece a un proyecto o evento.

## 4. Estado, eventos y renderizado

En `ProjectForm.jsx`, `useState` crea `form` y `setForm`. Cada `Input` recibe `value={form.name}` y `onChange={handleChange}`. Es un **campo controlado**: React conserva el valor, y cada cambio produce otro render.

```jsx
const handleChange = (event) => {
  const { name, value } = event.target
  setForm((previous) => ({ ...previous, [name]: value }))
}
```

Se copia el objeto anterior con `...previous` porque React espera un nuevo valor de estado. La forma funcional evita usar una copia antigua cuando hay actualizaciones cercanas. En `handleSubmit`, `preventDefault()` evita la recarga del formulario HTML; luego se validan campos y se llama a la función `onSubmit` recibida del padre.

`ProjectList.jsx` usa `projects.filter(...)` para crear `filtered` en cada render. Como se puede calcular a partir de `projects` y los filtros, no hace falta guardarlo en otro estado. En `Work.jsx`, el JSX elige entre carga, vacío y lista con una expresión condicional. Las listas usan `key={project.id}` para que React identifique cada elemento entre renders.

Ejercicio: escribe el camino de un carácter introducido en «Nombre del proyecto»: `Input` → `handleChange` → `setForm` → nuevo render → `value` actualizado.

## 5. Hooks y efectos: dónde van los datos

`useProjects(user?.id)` es un **hook propio**. Reúne estado (`projects`, `loading`, `error`), lectura y operaciones de escritura. `ProjectList` consume ese contrato y no llama a Supabase directamente.

```js
const { projects, loading, error, createProject } = useProjects(user?.id)
```

En `useProjects.js`, `useEffect` inicia la carga cuando existe `userId`. `useCallback` mantiene estable `fetchProjects` mientras `userId` no cambie; importa porque el efecto depende de esa función. La consulta filtra por `user_id`, y RLS debe impedir en el servidor que una cuenta lea datos de otra. `createProject` incorpora el `user_id` recibido de la sesión, espera a Supabase y, si guarda bien, actualiza el estado local con `setProjects`.

`useAuth.js` ofrece otro ejemplo de efecto: lee la sesión inicial, se suscribe a cambios de autenticación y devuelve una función de limpieza que cancela la suscripción. Los efectos son para sincronizar React con sistemas externos; una lista filtrada a partir de datos existentes no necesita efecto.

**Recorrido completo de crear proyecto:** `ProjectList` abre `Modal` → `ProjectForm` recoge y valida datos → `onSubmit={handleCreate}` llama a `createProject` → `useProjects` escribe en Supabase → actualiza `projects` → React redibuja la lista. Sigue esas funciones en ese orden con el editor.

## 6. URL, estilos y formatos

`Work.jsx` usa `useSearchParams`: `?view=projects` selecciona la pestaña de proyectos. El valor de la URL se valida contra `views`; al pulsar una pestaña, `setSearchParams` cambia la URL y React renderiza la vista correspondiente. `useMemo` construye `eventsByProject` cuando cambian los eventos; otro cálculo separa los eventos sin proyecto. No memorices `useMemo` por sistema: aquí hace comprensible y reutilizable un índice derivado.

Las clases como `flex`, `gap-3` y `sm:grid-cols-2` son Tailwind. `sm:` aplica una regla desde ese ancho de pantalla. Clases como `bg-surface-card` se apoyan en los colores definidos en `src/index.css`. Los componentes de página usan los controles compartidos de `src/components/ui/Input.jsx`; allí se adaptan fechas y selectores para móvil.

`src/lib/formatters.js` concentra euros, fechas y horas en español. La vista llama a `formatDate(project.start_date)` en lugar de repetir formato en cada componente. La fecha/hora de eventos usa la zona configurada en `src/lib/datetime.ts`; conviene distinguir un dato guardado del texto que se presenta al usuario.

## 7. Qué estudiar después

1. Repite el recorrido con eventos: `src/pages/Events/EventList.jsx`, `EventForm.jsx`, `src/hooks/useEvents.js`.
2. Sigue un dato financiero desde `src/hooks/useIncomes.js` hasta `src/lib/dashboardFinance.js` y `src/pages/Dashboard/Dashboard.jsx`. Las fórmulas merecen especial cuidado: consulta los tests antes de cambiarlas.
3. Examina `src/pages/Calendar/CalendarEvents.jsx` para ver integración con una librería de interfaz. React Big Calendar requiere una altura calculable en sus contenedores.
4. Lee `README.md` para el esquema y RLS, y `TECHDOC.md` para el inventario general. Esta guía explica el *cómo*; esos documentos recogen configuración y estado del proyecto.

Cuando cambies un ejemplo, busca primero sus usos (`rg "useProjects|ProjectForm" src`) y comprueba el recorrido completo. Si solo estás aprendiendo, empieza por leer y hacer cambios pequeños en una rama local.
