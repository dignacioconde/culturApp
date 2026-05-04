---
id: RELEASE-0.1-beta
type: release
status: Planned
created: 2026-05-04
updated: 2026-05-05
github_release: https://github.com/dignacioconde/culturApp/releases/tag/RELEASE-0.1-beta
milestone: https://github.com/dignacioconde/culturApp/milestone/1
aliases:
  - Primera beta privada
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1-beta — Primera beta privada

## Goal

Permitir que una primera persona usuaria cree trabajos reales, registre cobros y gastos, entienda el estado economico basico y pueda recuperar/exportar sus datos.

## Product Outcome

La beta no busca parecer completa. Busca que Cachés sea fiable para probar con datos reales sin miedo a perderlos ni malinterpretarlos.

## Scope

- [[../issues/CACH-B0014]] — Endurecer agenda, cobros y captura del MVP
- [[../issues/CACH-B0005]] — Importacion, exportacion y portabilidad de datos
- [[../issues/CACH-B0006]] — Onboarding y acceso beta
- [[../issues/CACH-B0002]] — Simplificar experiencia mobile financiera
- [[../issues/CACH-B0003]] — Cobro rapido y gestion de pendientes
- [[../issues/CACH-B0001]] — Rediseñar Trabajos y jerarquia proyecto-evento
- [[../issues/CACH-B0007]] — Calendario unificado e interaccion rapida

## Out Of Scope

- Inteligencia financiera Pro.
- Perfil publico, referidos y viralidad.
- Gestion documental avanzada.
- Offline completo y notificaciones complejas, salvo recordatorios minimos si son necesarios para cobros.

## Success Criteria

- [ ] Una persona nueva entiende proyecto, evento e ingreso sin explicacion externa larga.
- [ ] Puede crear un primer trabajo real desde movil.
- [ ] Puede registrar un ingreso, marcarlo como cobrado y verlo en dashboard correctamente.
- [ ] Puede exportar sus datos antes de confiar mas informacion a Cachés.
- [ ] No hay desfases de hora visibles al crear/editar eventos.
- [ ] La app explica o pide consentimiento antes de capturar analitica de uso.

## Related

- [[../context/beta-readiness-risk-map-20260504]]
- [[../decisions/ADR-0002-beta-trust-before-pro]]

## Sync

Las releases del Product Brain se vinculan a GitHub Release y Milestone.

### Flujo actual (manual)

1. Crear GitHub Release con `gh release create <tag> --title "..." --notes "..."`.
2. Crear Milestone con `gh api repos/<owner>/<repo>/milestones --method POST -f title="..."`.
3. Vincular issues al milestone desde GitHub UI o API.
4. Actualizar documento del Product Brain con `github_release` y `milestone` en el frontmatter.
5. Commitear y pushear cambios.

### Mejora futura (automatica)

Propuesta: crear script `scripts/github-release-sync.mjs` que:
- Acepte tag de release como argumento
- Cree GitHub Release automaticamente desde el tag de git
- Cree Milestone si no existe
- Pida issues a vincular (seleccion multiple)
- Actualice el documento del Product Brain con los enlaces

### Comandos utiles

```bash
# Listar releases
gh release list

# Ver milestone
gh api repos/dignacioconde/culturApp/milestones

# Vincular issue a milestone
gh issue edit <num> --milestone "RELEASE-0.1-beta"
```
