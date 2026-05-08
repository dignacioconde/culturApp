---
schema_version: 2
kind: process
id: PB-ID-POLICY
title: Politica de IDs
lifecycle: active
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - Politica de IDs
tags:
  - product-brain
  - process
  - ids
generated: false
---
# Politica de IDs

## Regla

Las issues nuevas usan `CACH-NNNN`, con un contador monotono global de 4 digitos.

## Legado

`CACH-B0001` a `CACH-B0016` quedan como IDs historicos de la primera beta. No se renombran y no se generan mas IDs con `B`.

## Donde vive cada atributo

- Tipo de trabajo: `work_type`.
- Nivel de trabajo: `work_level`.
- Estado ejecutable: `issue_workflow`.
- Release: `release`.
- Prioridad: `priority`.
- Tema o batch de producto: `theme`.

## Crear el siguiente ID

1. Buscar todos los archivos `docs/project/issues/CACH-*.md`.
2. Tomar el numero mayor, ignorando si tiene `B`.
3. Sumar 1 y escribir `CACH-NNNN`.

## Relacionado

- [[../decisions/ADR-0009-id-policy|ADR-0009]]
