---
schema_version: 2
kind: backlog
id: PB-BACKLOG
title: Backlog operativo
lifecycle: active
created: 2026-05-05
updated: 2026-05-12
aliases:
  - Backlog operativo
  - Backlog
tags:
  - product-brain
  - backlog
  - workflow
generated: true
---

# Backlog operativo

Tablero ligero generado desde las issues Markdown. Las columnas visibles son `issue_workflow`; el detalle vive en cada issue.

## Fuentes

- Issues canonicas: [[../indexes/issues.index|Issues Index]]
- Issues abiertas: [[../indexes/issues-open.index|Issues Open Index]]
- Release activa: [[../releases/CURRENT_RELEASE|Current Release]]
- Plan actual: [[../plans/CURRENT_PLAN|Current Plan]]
- Ideas sin refinar: [[IDEAS]]
- Triage: [[TRIAGE]]

## Estados

| Columna | Frontmatter v2 |
|---|---|
| Intake | `issue_workflow: inbox` |
| Backlog | `issue_workflow: backlog` o `blocked` |
| Ready | `issue_workflow: ready` |
| In progress | `issue_workflow: in_progress` |
| Review / Verify | `issue_workflow: review` |
| Done | `issue_workflow: done` |

`wont_fix` no tiene columna propia: se deja como nota en la issue y se excluye del tablero.

## Intake

_Sin issues._

## Backlog

| ID | Titulo | Tipo | Nivel | P | Componentes |
|---|---|---|---|---|---|
| [[../issues/CACH-B0001|CACH-B0001]] | Redisenar Trabajos y jerarquia proyecto-evento | feature | initiative | p1 | work, projects, events, design-system |
| [[../issues/CACH-B0002|CACH-B0002]] | Simplificar experiencia mobile financiera | feature | initiative | p1 | finance |
| [[../issues/CACH-B0004|CACH-B0004]] | Contratantes facturacion y liquidacion neta | feature | initiative | p1 | finance, design-system |
| [[../issues/CACH-B0007|CACH-B0007]] | Calendario unificado e interaccion rapida | feature | initiative | p1 | calendar, design-system |
| [[../issues/CACH-B0008|CACH-B0008]] | PWA notificaciones y offline | feature | initiative | p2 | infra-deploy |
| [[../issues/CACH-B0009|CACH-B0009]] | Inteligencia financiera y features Pro | feature | initiative | p2 | finance |
| [[../issues/CACH-B0010|CACH-B0010]] | Tooling de agentes y modelos de desarrollo | chore | initiative | p2 | agents, infra-deploy |
| [[../issues/CACH-B0011|CACH-B0011]] | Categorias etiquetas y taxonomia | spike | initiative | p2 | design-system |
| [[../issues/CACH-B0012|CACH-B0012]] | Perfil publico viralidad y referidos | feature | initiative | p3 | settings-profile |
| [[../issues/CACH-B0013|CACH-B0013]] | Gestion documental por proyecto evento | feature | initiative | p3 | projects, events |

## Ready

_Sin issues._

## In progress

_Sin issues._

## Review / Verify

_Sin issues._

## Done

| ID | Titulo | Release | Resultado |
|---|---|---|---|
| [[../issues/CACH-0039|CACH-0039]] | [Agents] Respetar permisos reales en lanzadores OpenCode | RELEASE-0.1.0-beta.11 | Cerrada por `RELEASE-0.1.0-beta.11` en `main` mediante commit `15c0743`. |
| [[../issues/CACH-0040|CACH-0040]] | [Agents] Separar plan draft de ejecucion mutante | RELEASE-0.1.0-beta.11 | Cerrada por `RELEASE-0.1.0-beta.11` en `main` mediante commit `15c0743`. |
| [[../issues/CACH-0049|CACH-0049]] | Migrar Product Brain a v2 lean agile para agentes | null | Product Brain queda migrado a v2 completo. El repositorio dispone de schema, migrador, orientador, generadores, validadores, checks de cierre y contratos de agente alineados con Product Brain-first. |
| [[../issues/CACH-B0020|CACH-B0020]] | Validar dominio de email transaccional y cambiar remitentes definitivos | RELEASE-0.1.0-beta.14 | Cerrado en `RELEASE-0.1.0-beta.14`. Cachés usa `caches.es` como dominio de email definitivo, `no-reply@caches.es` como remitente transaccional y `contacto@caches.es` como reply-to/buzón humano. Queda fuera el cambio de dominio público de la app y la estrategia multientorno, trazados en `CACH-0051`. |
| [[../issues/CACH-0026|CACH-0026]] | Setup inicial Product Brain | null | Sin resultado documentado. |
| [[../issues/CACH-0028|CACH-0028]] | Corregir sync iCloud y estructura versionada | null | Sin resultado documentado. |
| [[../issues/CACH-0029|CACH-0029]] | Integrar helpers CACH-B0016 en flujos reales | RELEASE-0.1.0-beta.1 | Listo para revision. CACH-0029 integra los helpers de CACH-B0016 en flujos reales: |
| [[../issues/CACH-0030|CACH-0030]] | Homogeneizar diseno con nueva paleta de colores y fuentes | RELEASE-0.1.0-beta.6 | Sin resultado documentado. |
| [[../issues/CACH-0031|CACH-0031]] | Corregir ajustes UX movil detectados en exploracion | null | Implementado en PR #74 y mergeado a `main`. |
| [[../issues/CACH-0032|CACH-0032]] | Priorizar operativa diaria en dashboard movil | null | Implementado en rama `feature/CACH-0032-mobile-dashboard-operativo`. |
| [[../issues/CACH-0034|CACH-0034]] | €/h muestra valor incorrecto cuando no hay eventos con horas | null | Sin resultado documentado. |
| [[../issues/CACH-0035|CACH-0035]] | Rediseño financiero del Dashboard y paid_date en cobros rapidos | RELEASE-0.1.0-beta.3 | Released en RELEASE-0.1.0-beta.3. Se implementó rediseño de KPIs, helpers financieros testeados, UI móvil compacta y corrección de `paid_date` en cobros rápidos de proyecto y evento. |
| [[../issues/CACH-0036|CACH-0036]] | Profesionalizar flujo de ramas por beta | RELEASE-0.1.0-beta.5 | Released en RELEASE-0.1.0-beta.5. Cambios de proceso integrados en `main` mediante PR #84. |
| [[../issues/CACH-0037|CACH-0037]] | Consolidar PRD y sistema de diseno de Cachés | RELEASE-0.1.0-beta.5 | Released en RELEASE-0.1.0-beta.5. PRD y sistema de diseno integrados en `main` mediante PR #84. |
| [[../issues/CACH-0038|CACH-0038]] | Compactar mobile financiero y detalles accionables | RELEASE-0.1.0-beta.6 | Sin resultado documentado. |
| [[../issues/CACH-0041|CACH-0041]] | [UX] Simplificar dashboard movil y estado Ahora | RELEASE-0.1.0-beta.13 | Cerrada por `RELEASE-0.1.0-beta.13`. |
| [[../issues/CACH-0042|CACH-0042]] | [UX] Racionalizar navegacion inferior | RELEASE-0.1.0-beta.16 | Implementada y cerrada en `RELEASE-0.1.0-beta.16` una barra inferior movil compacta con seis destinos principales: Trabajos, Inicio, Agenda, Plan, Datos y Ajustes. |
| [[../issues/CACH-0043|CACH-0043]] | [UX] Limpiar acciones en detalle de proyecto | RELEASE-0.1.0-beta.12 | Cerrada por `RELEASE-0.1.0-beta.12`. |
| [[../issues/CACH-0044|CACH-0044]] | [UX] Crear evento desde proyecto con proyecto preseleccionado | RELEASE-0.1.0-beta.12 | Cerrada por `RELEASE-0.1.0-beta.12`. |
| [[../issues/CACH-0045|CACH-0045]] | [UX] Anadir confirmacion a borrados destructivos | RELEASE-0.1.0-beta.12 | Cerrada por `RELEASE-0.1.0-beta.12`. |
| [[../issues/CACH-0046|CACH-0046]] | [Verify] Anadir verificacion por tipo de cambio | null | Implementado un preflight local-first: `verify:ci` replica el job `app`, `verify:pr` valida diff contra base y cierre de issue cuando se pasa `--issue`, y `pb:guard` agrupa Product Brain strict, brain, index y digest. |
| [[../issues/CACH-0047|CACH-0047]] | [Skills] Actualizar catalogo y symlinks de skills | null | Catalogo y validacion de skills alineados con las 16 skills portables actuales. `caveman` queda integrado como modo de salida conciso en runners OpenCode, con excepciones obligatorias para seguridad, RLS, finanzas, SQL, migraciones, reviews, verificacion y acciones remotas/destructivas. |
| [[../issues/CACH-0050|CACH-0050]] | [Deploy] Tooling local-first de PR release y smoke | null | Implementado tooling local-first de deploy/PR/release: estado y sync de release, PR body, `ship` dry-run/execute acotado, smoke postdeploy, limpieza local de ramas, `verify:ci`, `verify:pr` y `installCommand: "npm ci"` en Vercel sin tocar el rewrite SPA. |
| [[../issues/CACH-0051|CACH-0051]] | [Deploy] Dominio publico de app y estrategia multientorno | RELEASE-0.1.0-beta.15 | Cerrado en `RELEASE-0.1.0-beta.15`. El dominio publico canonico de la app queda definido como `https://app.caches.es`, asignado al proyecto Vercel, resuelto por DNS de Hostinger y verificado con smoke de rutas SPA. `VITE_APP_URL` queda configurado en Vercel para produccion, preview y development. La Edge Function `send-beta-invite` usa `APP_URL=https://app.caches.es`. Supabase Auth URL Configuration queda actualizada con `Site URL` canonico y redirects permitidos para `app.caches.es`, alias temporal de Vercel y localhost local. |
| [[../issues/CACH-0052|CACH-0052]] | [Feedback] Formulario simple de feedback beta | RELEASE-0.1.0-beta.17 | Implementado y cerrado en `RELEASE-0.1.0-beta.17`. La release anade el formulario global de feedback, el hook de envio, elimina el snippet comentado de Plausible y deja versionada la migracion que endurece la politica de insert de la tabla `feedback`. |
| [[../issues/CACH-0053|CACH-0053]] | [Bug] Mantener foco al escribir feedback | null | Implementado localmente. El modal ya no reinstala el focus trap al cambiar la identidad de `onClose`, y el scroll lock expone funciones estables. El textarea de feedback conserva el foco mientras se escribe. |
| [[../issues/CACH-0054|CACH-0054]] | Editar notas desde detalles de proyecto y evento | RELEASE-0.1.0-beta.18 | Implementado y cerrado en `RELEASE-0.1.0-beta.18`. |
| [[../issues/CACH-0055|CACH-0055]] | Pulido financiero movil sin cambiar formulas | RELEASE-0.1.0-beta.18 | Implementado y cerrado en `RELEASE-0.1.0-beta.18`. |
| [[../issues/CACH-0056|CACH-0056]] | Calendario de eventos y plan anual separados | RELEASE-0.1.0-beta.18 | Implementado y cerrado en `RELEASE-0.1.0-beta.18`. |
| [[../issues/CACH-B0003|CACH-B0003]] | Cobro rapido y gestion de pendientes | RELEASE-0.1.0-beta.5 | Released en RELEASE-0.1.0-beta.5 por ampliacion explicita de scope. Integrado en `main` mediante PR #84. |
| [[../issues/CACH-B0005|CACH-B0005]] | Importacion exportacion y portabilidad de datos | RELEASE-0.1.0-beta.7 | Released en RELEASE-0.1.0-beta.7. Integrado en `main` mediante PR #86. |
| [[../issues/CACH-B0006|CACH-B0006]] | Onboarding y acceso beta | RELEASE-0.1.0-beta.8 | Released en RELEASE-0.1.0-beta.8. Integrado en `main` mediante PR #87. |
| [[../issues/CACH-B0014|CACH-B0014]] | Endurecer agenda cobros y captura del MVP | RELEASE-0.1.0-beta.2 | Sin resultado documentado. |
| [[../issues/CACH-B0015|CACH-B0015]] | Operativizar backlog releases y ramas en Product Brain | RELEASE-0.1.0-beta.1 | Product Brain queda preparado como sistema operativo de producto e ingenieria: backlog, release activa, ramas, commits, agentes, plantillas y cierre de releases quedan documentados y enlazados. |
| [[../issues/CACH-B0016|CACH-B0016]] | Refundacion operativa del Product Brain y tests B0014 | RELEASE-0.1.0-beta.1 | Sin resultado documentado. |
| [[../issues/CACH-B0017|CACH-B0017]] | Panel admin para invitaciones beta | RELEASE-0.1.0-beta.9 | Sin resultado documentado. |
| [[../issues/CACH-B0019|CACH-B0019]] | Emails transaccionales beta con Brevo | RELEASE-0.1.0-beta.10 | Implementado y asociado a RELEASE-0.1.0-beta.10. La migración y la Edge Function quedaron desplegadas en Supabase; el envío funciona usando un remitente personal validado temporalmente. Queda pendiente crear o activar un remitente real de Cachés, validarlo en Brevo, cambiar el remitente temporal en Supabase Auth/Edge Function y configurar SPF/DKIM/DMARC antes de producción estable. |
| [[../issues/CACH-0033|CACH-0033]] | Vista anual en calendario de proyectos | RELEASE-0.1.0-beta.4 | Released en RELEASE-0.1.0-beta.4. Se implemento una planificacion anual de proyectos con timeline desktop, Gantt compacto movil, lista mensual y helpers puros testeados para rangos y cruces de anos. |
| [[../issues/CACH-0048|CACH-0048]] | [Context] Compactar workflow OpenCode | null | Compactacion aplicada en la capa de verificadores y prompts cargados por defecto: `context:check` ahora mide skills anidadas, reduce falsos positivos y mantiene cada prompt principal dentro de presupuesto. |
| [[../issues/CACH-B0018|CACH-B0018]] | Adaptador Codex-native para perfiles Cultura | RELEASE-0.1.0-beta.9 | Sin resultado documentado. |

## Regla de mantenimiento

No edites este tablero a mano salvo emergencia: ejecuta `npm run pb:index`. Si el tablero y las issues divergen, `npm run pb:check` falla.
