---
id: PB-CTX-DATA-FINANCE-20260504
type: context
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Modelo datos y finanzas 2026-05-04
tags:
  - product-brain
  - context
  - data
  - finance
---

# Modelo de datos y finanzas — 2026-05-04

## Esquema Actual

Supabase tiene cinco tablas de producto:

- `profiles`: perfil del usuario, profesión e IRPF habitual.
- `projects`: contenedores con rango de fechas, estado, cliente, categoría, color y notas.
- `events`: ocurrencias con fecha/hora exactas, estado, cliente, categoría, color, notas y proyecto opcional.
- `incomes`: ingresos vinculados a proyecto o evento.
- `expenses`: gastos vinculados a proyecto o evento.

Todas las tablas usan `user_id` o `id` del usuario para RLS. La app cliente filtra por usuario, pero la separación real de datos depende también de las policies en Supabase.

## Contrato De Acceso A Datos

La UI no debería llamar a Supabase directamente desde páginas o componentes. El acceso vive en hooks:

- `useProjects(userId)`
- `useEvents(userId, projectId?)`
- `useIncomes(userId, { projectId?, eventId?, eventIds? })`
- `useExpenses(userId, { projectId?, eventId?, eventIds? })`
- `useProfile(userId)`
- `useAuth()`

El modo `projectId + eventIds` es importante para ProjectDetail: suma ingresos/gastos directos del proyecto y también los de sus eventos asociados mediante filtro OR.

Para perfil, `profiles.tax_rate` es la fuente canónica del IRPF habitual. No usar `auth.user_metadata.tax_rate` como fuente de formularios ni settings. Ver [[../decisions/ADR-0004-profile-data-source-and-hooks]].

## Cálculos Financieros Implementados

Dashboard:

- `Cobros`: usa fecha prevista o fecha real de ingresos y fecha de gasto dentro del mes seleccionado.
- `Proyectos`: usa proyectos activos por solape de fechas con el mes y añade eventos vinculados a esos proyectos.
- Ingresos previstos: suma bruta de ingresos relevantes.
- Ingresos cobrados: suma bruta de ingresos marcados como cobrados.
- Retenciones: se calculan sobre ingresos cobrados con `tax_rate`.
- Gastos: suma de gastos relevantes.
- Beneficio neto: cobrado menos retenciones menos gastos.
- Cobro bruto/hora: solo ingresos cobrados vinculados a eventos, antes de IRPF, dividido por horas de esos eventos.

EventDetail:

- Calcula ingresos, cobros, retenciones, gastos, beneficio neto y bruto/hora solo para el evento.
- Marcar cobrado alterna `is_paid` y rellena `paid_date` con la fecha actual cuando pasa a cobrado.

ProjectDetail:

- Los KPIs agregan ingresos/gastos directos del proyecto y de todos sus eventos.
- Las tablas editables muestran solo ingresos/gastos directos del proyecto para no mezclar niveles.
- El bruto/hora del proyecto usa solo ingresos cobrados de eventos y horas de esos eventos.

## Límites Del Modelo Actual

- `client` es texto libre; no existe entidad contratante ni datos de facturación.
- No hay liquidación neta que relacione gastos repercutibles con ingresos concretos.
- No hay importación/exportación de datos todavía.
- No hay presupuestos por categoría, objetivos, escenarios ni salud financiera.
- Categorías están predefinidas en frontend y no hay taxonomía por usuario.

## Gotchas Operativos

- Un 409 al crear proyecto o evento para un usuario autenticado puede indicar que falta su fila en `public.profiles`. Ver [[../knowledge/PB-ZK-20260504-profile-409]].
- El trigger `handle_new_user` debe insertar en `public.profiles` de forma explicita.

## Decisiones Que No Conviene Romper

- Los ingresos y gastos pueden vivir en proyecto o evento; no forzar todo a un único nivel sin resolver [[../issues/CACH-B0004|CACH-B0004]].
- El bruto/hora no debe incluir ingresos directos de proyecto porque inflaría la métrica.
- El usuario necesita importación/exportación antes de beta para confiar sus datos a la app.

## Relacionado Con

- [[../issues/CACH-B0003|CACH-B0003]]
- [[../issues/CACH-B0004|CACH-B0004]]
- [[../issues/CACH-B0005|CACH-B0005]]
- [[../issues/CACH-B0009|CACH-B0009]]
- [[../issues/CACH-B0011|CACH-B0011]]
- [[../decisions/ADR-0004-profile-data-source-and-hooks|ADR-0004-profile-data-source-and-hooks]]
- [[../decisions/ADR-0006-gross-cache-per-hour|ADR-0006-gross-cache-per-hour]]
