---
id: PB-CTX-TECHNICAL-STACK-20260504
type: context
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Stack tecnico Cachés 2026-05-04
tags:
  - product-brain
  - context
  - technical
---

# Stack tecnico — 2026-05-04

## Elecciones Actuales

- React 19 + Vite 8: ecosistema maduro y build rapido sin configuracion pesada.
- Tailwind CSS v4: utility-first para prototipar rapido y centralizar tokens visuales.
- Lucide React: iconos limpios, consistentes y amplios.
- React Big Calendar: vistas mes, semana y dia con base probada para calendario.
- Day.js: fechas ligeras con API pequena.
- React Router DOM 7: navegacion de app cliente con rutas protegidas.
- Supabase JS: PostgreSQL, Auth y API REST sin backend dedicado para el MVP.
- Vercel: deploy automatico desde GitHub.

## Razonamiento

La prioridad del MVP es minimizar infraestructura y maximizar velocidad de iteracion. El stack evita servidor propio, mantiene una base frontend comun y permite que datos/auth/deploy vivan en servicios ya integrados.

## Implicaciones

- Los cambios de datos deben respetar Supabase, RLS y hooks.
- La UX de calendario depende de las restricciones de React Big Calendar.
- El Product Brain y los agentes deben documentar decisiones de stack antes de introducir librerias pesadas o backend propio.

## Relacionado Con

- [[product-snapshot-20260504|product-snapshot-20260504]]
- [[data-finance-model-20260504|data-finance-model-20260504]]
- [[../issues/CACH-B0010|CACH-B0010]]
