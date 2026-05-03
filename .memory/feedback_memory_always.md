---
name: Leer y actualizar memoria siempre
description: Al inicio de cada conversación leer MEMORY.md y durante la conversación guardar proactivamente sin que el usuario lo pida
type: feedback
---
**Regla obligatoria en cada conversación:**

1. **Al empezar**: leer `MEMORY.md` y todos los archivos de memoria relevantes antes de responder.
2. **Durante**: guardar proactivamente cualquier preferencia, decisión o contexto nuevo sin esperar a que el usuario lo pida.
3. **Al aprender algo nuevo** sobre el usuario, el proyecto o el flujo de trabajo: guardarlo de inmediato.

**Why:** El usuario tuvo que pedir explícitamente que se usara la memoria y que se consolidara este comportamiento. No debe tener que recordármelo.

**How to apply:** Sin excepciones. Si la memoria está vacía o desactualizada, es un fallo. Guardar tanto correcciones como validaciones de decisiones no obvias.

**Checkpoint antes de commit/cierre:** Antes de hacer commit, push, cerrar una issue o dar por terminada una sesión con cambios relevantes, revisar explícitamente si la sesión produjo preferencias, decisiones, contexto de producto o aprendizajes duraderos y actualizar `.memory/` antes del commit final. El usuario detectó que al final de las sesiones no se estaba actualizando la memoria con todo lo aprendido.
