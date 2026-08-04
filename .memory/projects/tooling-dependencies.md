# Tooling de dependencias

- pnpm 11.20.0 es el gestor de paquetes unico del repositorio.
- `pnpm-lock.yaml` es el unico lockfile; no regenerar `package-lock.json`.
- CI y Vercel usan `pnpm install --frozen-lockfile`.
- Node 22.22.0 es el minimo mientras siga activo el override de `react-router@8.3.0`; CI usa Node 24.
- `pnpm-workspace.yaml` fuerza temporalmente `react-router@8.3.0` para corregir GHSA-qwww-vcr4-c8h2 con `react-router-dom@7.18.2`. Retirar el override cuando React Router DOM publique una version corregida y compatible de forma nativa.
