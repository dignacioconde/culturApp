---
id: PB-CTX-BETA-RISK-20260504
type: context
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Mapa beta y riesgos 2026-05-04
tags:
  - product-brain
  - context
  - beta
  - risk
---

# Beta readiness y mapa de riesgos — 2026-05-04

## Estado General

Cachés tiene un MVP funcional desplegado: auth, proyectos, eventos, calendarios, finanzas básicas, ajustes y vista de trabajos. Eso no equivale todavía a beta segura.

La beta debería priorizar confianza, comprensión rápida y reversibilidad de datos antes de features Pro.

## Bloqueadores Antes De Beta

1. Confianza del MVP: horas de agenda, fechas reales de cobro, decimales y pendientes vencidos. Ver [[../issues/CACH-B014|CACH-B014]].
2. Portabilidad de datos: exportación e importación mínima. Ver [[../issues/CACH-B005|CACH-B005]].
3. Onboarding y acceso beta: invitaciones, explicación del modelo mental y consentimiento de analítica. Ver [[../issues/CACH-B006|CACH-B006]].
4. Mobile financiero: reducir fricción en detalles, tablas y formularios. Ver [[../issues/CACH-B002|CACH-B002]].
5. Cobro rápido: acción frecuente y de alto valor para uso real. Ver [[../issues/CACH-B003|CACH-B003]].

## Riesgos De Producto

- Si proyecto y evento no se distinguen bien, la app se convierte en otra lista confusa de trabajos.
- Si los datos no se pueden exportar, el usuario beta tendrá miedo razonable a depender de Cachés.
- Si la hora de un evento o la fecha real de cobro cambia silenciosamente, la confianza en la app se rompe aunque la UI parezca correcta.
- Si los cobros pendientes no son accionables, la app registra dinero pero no ayuda a cobrarlo.
- Si se implementan features Pro antes de limpiar modelo financiero, los análisis pueden parecer inteligentes pero ser engañosos.

## Cosas Que Pueden Esperar

- Perfil público, referidos y viralidad: después de beta funcional. Ver [[../issues/CACH-B012|CACH-B012]].
- Gestión documental: post-MVP salvo evidencia fuerte. Ver [[../issues/CACH-B013|CACH-B013]].
- PWA/offline/notificaciones completas: valiosas, pero no deben bloquear la portabilidad ni el onboarding. Ver [[../issues/CACH-B008|CACH-B008]].
- Inteligencia financiera Pro: depende de datos fiables y de decisiones de liquidación. Ver [[../issues/CACH-B009|CACH-B009]].

## Criterio De Salida Para Primera Beta

- Un usuario nuevo entiende evento, proyecto y cobro en pocos minutos.
- Puede crear un primer trabajo real desde móvil sin pelearse con fechas o selectores.
- Puede registrar un ingreso, marcarlo como cobrado y ver el impacto económico.
- Puede exportar sus datos.
- La app no comparte ni analiza comportamiento sin consentimiento claro.

## Relacionado Con

- [[../issues/CACH-B002]]
- [[../issues/CACH-B003]]
- [[../issues/CACH-B005]]
- [[../issues/CACH-B006]]
- [[../issues/CACH-B008]]
- [[../issues/CACH-B009]]
- [[../issues/CACH-B012]]
- [[../issues/CACH-B013]]
