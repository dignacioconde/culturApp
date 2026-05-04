---
id: PB-CTX-PRODUCT-SNAPSHOT-20260504
type: context
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Snapshot producto Cachés 2026-05-04
tags:
  - product-brain
  - context
  - product
---

# Snapshot producto — 2026-05-04

## Qué Es Cachés

Cachés es una herramienta web para trabajadores culturales independientes que necesitan ver, en un mismo sitio, agenda de trabajos, ingresos previstos, cobros reales, gastos y rentabilidad básica.

El usuario principal no está gestionando una empresa grande: está sobreviviendo a muchos trabajos simultáneos, cambios de fechas, cobros pendientes y costes pequeños que suelen vivir en Excel, notas o memoria.

## Usuario Objetivo

- Músicos, actores, fotógrafos, diseñadores, técnicos, gestores culturales y perfiles freelance del sector cultural.
- Trabajan por proyectos/eventos, a menudo con clientes o contratantes distintos.
- Necesitan poca fricción en mobile porque muchas acciones ocurren alrededor de ensayos, bolos, sesiones, viajes o reuniones.
- Valoran control económico práctico antes que contabilidad completa.

## Modelo Mental Actual

- **Proyecto**: contenedor con rango de fechas. Agrupa eventos y también puede tener ingresos/gastos directos.
- **Evento**: ocurrencia concreta con fecha y hora exactas. Puede existir sin proyecto.
- **Ingreso**: se vincula a un evento o a un proyecto; tiene bruto, IRPF, fecha prevista, fecha real y estado cobrado.
- **Gasto**: se vincula a un evento o a un proyecto; tiene importe, categoría, fecha y deducibilidad.

La distinción proyecto/evento es el centro cognitivo del producto. Cualquier rediseño debe aclararla, no esconderla de forma que el usuario pierda trazabilidad.

## Superficie Implementada

- Auth con Supabase y rutas protegidas.
- Dashboard económico con KPIs mensuales, cobros pendientes y proyectos activos.
- Calendario de eventos con hora exacta y panel lateral.
- Calendario de proyectos por rango de fechas.
- Listados y detalles de eventos/proyectos con formularios, ingresos y gastos.
- Vista `/work` como primer intento de agrupar proyectos y eventos bajo “Trabajos”.
- Ajustes de perfil: nombre, profesión e IRPF habitual.
- Product Brain repo-native en `docs/project/`, separado de `.memory/`.

## Tensiones De Producto Activas

- `/work` existe, pero [[../issues/CACH-B001|CACH-B001]] sigue siendo el rediseño pendiente para jerarquía real y evitar duplicidades.
- Los calendarios separados funcionan, pero [[../issues/CACH-B007|CACH-B007]] apunta a una vista unificada con filtros e interacción rápida.
- Finanzas funcionan para MVP, pero contratante, facturación, liquidación neta y CRM ligero viven en [[../issues/CACH-B004|CACH-B004]].
- La app registra datos; el salto diferencial será convertirlos en decisiones económicas, cubierto por [[../issues/CACH-B009|CACH-B009]].

## Relacionado Con

- [[../plans/backlog-mayo-2026]]
- [[../issues/CACH-B001]]
- [[../issues/CACH-B003]]
- [[../issues/CACH-B004]]
- [[../issues/CACH-B007]]
- [[../issues/CACH-B009]]
