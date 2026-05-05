import { test } from '@playwright/test'

test.skip('crear cache con importe europeo, fecha Madrid y marcar como pagada', async ({ page }) => {
  // Pendiente de seed/auth estable para e2e. Flujo objetivo:
  // 1. Iniciar sesion con usuario seed de beta.
  // 2. Crear cache/evento con importe "1.234,56" y fecha "2026-05-16T22:00".
  // 3. Marcar ingreso como pagado.
  // 4. Verificar que aparece pagado y que la hora visible sigue siendo 22:00 Madrid.
  await page.goto('/login')
})
