# Handoff

Estado vivo para pasar trabajo entre agentes (Claude Code, Codex, otra sesión). Todo agente lo lee al empezar y lo actualiza al terminar. Mantén los apartados fijos; reescribe en lugar de acumular histórico (el histórico vive en git).

## Objetivo actual

Sin release activa (beta 25 publicada). CACH-0107 (guía de estudio de React con comentarios didácticos) en PR. Siguiente paso de producto: elegir la iniciativa P1 que define la beta 26.

## Hecho

- CACH-0106 (orquestación multi-modelo) cerrada: fases 1–3 en PR #117 y fases 4–6 en PR #118, ambas en `main`.
- CACH-0107: guía `docs/learning/react-stack-caches.md`, comentarios didácticos (solo comentarios) en `src/`, enlace en `TECHDOC.md` y preferencia en `.memory/me.md`.

## Pendiente (siguiente paso concreto)

- Revisar y mergear la PR de CACH-0107 (rama `docs/cach-0107-react-learning-guide`) con CI verde.
- Usuario: elegir la iniciativa P1 para la beta 26 (B0001 Trabajos, B0002 móvil financiera, B0004 contratantes/facturación, B0007 calendarios).
- Usuario: aprobar los MCP `codex` y `cheap-worker` al abrir `claude`; primer uso real de `/task-plan` sobre una tarea pequeña.
- Triar las 4 notas antiguas de `docs/project/inbox/`.

## Decisiones tomadas

- Ver `docs/decisions.md` (ADR-001 a ADR-006).
- `.env` y `logs/` viven en el checkout principal (`/Users/diconde/Documents/GitHub/culturApp`) y los comparten todos los worktrees.
- Cadena de fallback: gratuitos OpenCode → DeepSeek directo → Ollama → OpenRouter (OpenRouter con ~2 céntimos de margen; recargar solo si hace falta).
- Perfiles (`pnpm profiles`) se mantienen como opcionales: el usuario tiene una sola cuenta de Claude y una de ChatGPT.
- Dependencias MCP (`@modelcontextprotocol/sdk`, `zod`, `yaml`) como devDependencies del raíz: un solo `pnpm install`; la app no las importa.
- Comentarios didácticos de React: breves, en español, solo en decisiones y flujos relevantes; la guía es la referencia larga.

## Ficheros tocados

- CACH-0107: `docs/learning/react-stack-caches.md`, `docs/project/issues/CACH-0107.md`, índices de `docs/project/`, `TECHDOC.md`, `.memory/me.md`, comentarios en `src/main.jsx`, `src/App.jsx`, `src/hooks/useAuth.js`, `src/hooks/useProjects.js`, `src/components/ui/{Button,ContextNotesCard,Input}.jsx`, `src/pages/Projects/{ProjectForm,ProjectList}.jsx`, `src/pages/Work/Work.jsx`.

## Riesgos / dudas

- Los MCP `codex` y `cheap-worker` aparecen como «Pending approval» hasta aprobarlos al abrir `claude` en el repo (y otra vez por cada perfil).
- Modelos gratuitos: límites de uso y posible uso de prompts por el proveedor; no delegar código sensible.
- `/task-review` integra con `cherry-pick` en la rama actual; si es `main`, debe parar.
- `/handoff` reescribe este fichero: revisar su diff antes de commitear.
- La config local de git del repo tiene `user.name = Codex`: los commits hechos desde aquí salen con esa autoría. Es preexistente; cambiarla es decisión del usuario.
- Los comentarios didácticos pueden quedar desfasados si cambia el código; al tocar esos archivos, revisar el comentario y la sección de la guía que lo cita.

## Último agente y modelo que trabajó

Claude Code (extensión VS Code) — claude-opus-5-5 — 2026-11-02.
