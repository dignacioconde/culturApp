---
name: compact-memory
description: Comprime y consolida la memoria en .memory/ — fusiona redundancias, elimina históricos, actualiza índices. Usar cuando el usuario diga "compacta la memoria", "compact-memory", "comprime la memoria", "limpia la memoria" o "compacta .memory".
---

# Skill: compact-memory

## Cuándo usar

Triggers: "compacta la memoria", "compact-memory", "comprime la memoria", "limpia la memoria", "compacta .memory", "limpia .memory".

No usar para: guardar memorias nuevas, consultar memorias existentes, operaciones de un solo archivo.

## Protocolo de ejecución (7 pasos obligatorios)

### 1. Mapa completo

Leer `MEMORY.md` (índice raíz), luego todos los archivos enlazados. Construir tabla interna:

```
archivo | tipo | líneas | tema-central | posible-solapamiento-con
```

Incluir subdirectorios `projects/` y `topics/`.

### 2. Identificar candidatos por categoría

**Eliminables:**
- Notas históricas de migración (hechos únicos ya completados que no afectan workflows futuros)
- Archivos cuyo contenido completo ya existe en otro archivo con >80% overlap

**Fusionables:**
- Archivos <15 líneas sobre el mismo tema que un archivo mayor
- Múltiples feedbacks sobre un mismo dominio (agent-workflows, forms, mobile, etc.)

**Simplificables:**
- Archivos que mezclan dos responsabilidades distintas; mover el contenido fuera-de-lugar al archivo correcto

### 3. Reglas de fusión obligatorias

| Tipo de contenido | Destino |
|-------------------|---------|
| Feedbacks sobre workflows de agentes, commits, PRs, branching | `topics/agent-workflows.md` |
| Feedbacks sobre formularios, selectores, controles de fecha UI | `topics/forms.md` |
| Feedbacks sobre mobile, modals, scroll, touch, viewport | `lessons_mobile_modals.md` |
| Notas históricas de un evento único sin impacto futuro | ELIMINAR |
| Project entries <15 líneas sin gotcha técnico único | fusionar al archivo-contenedor del proyecto |
| Contenido que ya está en `AGENTS.md` o `docs/project/` | ELIMINAR (no duplicar) |

### 4. Ejecutar fusiones (orden crítico)

1. Añadir contenido al archivo destino (con fecha si no la tiene)
2. Verificar que el contenido quedó bien integrado
3. Solo entonces eliminar el archivo origen
4. **Nunca eliminar antes de haber añadido**

### 5. Actualizar índices

- `MEMORY.md`: eliminar punteros a archivos borrados, añadir nuevos si corresponde, mantener <200 líneas
- `core.md`: actualizar "Last curated" y el Active Map si el grafo de archivos cambió
- `projects/README.md`: actualizar si cambian los archivos en `projects/`
- `topics/README.md`: actualizar si cambian los archivos en `topics/`

### 6. Archivos que NUNCA se tocan

- `me.md` — preferencias de usuario, nunca fusionar ni simplificar
- `feedback_memory_always.md` — regla operativa fundamental del sistema de memoria
- Archivos con gotchas técnicos únicos y diferenciados:
  - `projects/calendar.md`
  - `projects/routing-deploy.md`
  - `projects/settings.md`
  - `projects/dashboard-finance.md`
  - `topics/forms.md`
  - `topics/portable-skills.md`

### 7. Output obligatorio

Terminar con una tabla de acciones ejecutadas:

```
| Archivo | Acción | Destino (si fusión) |
|---------|--------|---------------------|
| foo.md  | FUSIONADO | bar.md |
| baz.md  | ELIMINADO | — |
| qux.md  | SIN CAMBIO | — |
```

Y un resumen: `Total antes: N archivos → Total después: M archivos`.

Si hay casos ambiguos (contenido que podría ser activo o cerrado), listarlos y preguntar al usuario antes de actuar.

## Heurísticas de calidad

- Después de compactar, ningún archivo debe estar vacío ni tener solo frontmatter
- Ningún puntero en `MEMORY.md` debe apuntar a un archivo inexistente
- `core.md` debe reflejar el estado real de archivos que existen
- Los archivos de tipo `feedback` no deben ser duplicados de secciones en `topics/`
- Un archivo standalone de <10 líneas sobre un tema ya cubierto en otro archivo es candidato a fusión

## Notas

- Este skill NO crea issues, no hace commits ni push. Solo edita archivos `.memory/`.
- Si la sesión de memoria a compactar está activa (trabajo en progreso), preguntar antes de eliminar archivos de proyecto.
- El skill puede coexistir con memory-protocol — este skill compacta; memory-protocol guarda/consulta.
