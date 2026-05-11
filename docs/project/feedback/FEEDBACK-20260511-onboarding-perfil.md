---
schema_version: 2
kind: feedback
id: FEEDBACK-20260511-onboarding-perfil
title: Onboarding no navega al perfil al terminar
lifecycle: active
created: '2026-05-11'
updated: '2026-05-11'
aliases:
  - Feedback onboarding perfil
tags:
  - product-brain
  - feedback
  - onboarding
generated: false
feedback_source: other
feedback_severity: high
area: auth-onboarding
linked_issue: null
---

# Feedback — Onboarding no navega al perfil al terminar

## Mensaje

Usuarios nuevos veian el onboarding inicial, pero al pulsar el boton final no llegaban a su perfil editable. La expectativa de producto es que al cerrar/completar el onboarding el usuario aterrice en Ajustes, que actualmente funciona como perfil.

## Contexto

- Fuente: reporte directo durante beta.
- Usuario/alias: no aplica; no se guarda dato personal.
- Ruta: `/onboarding`.
- Resolucion: hotfix directo en `main`, commit `ff8e8d6`.

## Decision de curaduria

- [ ] Convertir en issue
- [x] Guardar como feedback resuelto
- [ ] Descartar

El bug se resolvio sin issue CACH por urgencia. Si reaparece, abrir una issue pequena de onboarding/perfil con reproduccion y criterio de navegacion.
