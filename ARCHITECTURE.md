# Arquitectura inicial basada en features

Este esqueleto organiza el proyecto de Angular en capas claramente separadas y favorece la escalabilidad:

- `src/app/core`: Servicios singleton, interceptores, guards y estado global.
- `src/app/shared`: Componentes, pipes, directivas y utilidades reutilizables sin dependencias circulares.
- `src/app/layout`: Componentes de layout (shell, navbar, sidebar) que ensamblan las features.
- `src/app/features`: Cada feature es un módulo vertical de negocio (ej. `auth`, `dashboard`, `settings`). Cada feature expone `components`, `pages`, `services` y `store` propios.
- `src/assets`: Recursos estáticos (traducciones, imágenes, estilos).
- `src/environments`: Archivos de configuración por entorno.

Sugerencias:

1. Usar `Standalone Components` o `NgModules` por feature según necesidad.
2. Exponer solo elementos públicos mediante `index.ts` dentro de cada feature para aislar dependencias.
3. Aplicar lazy loading en `app-routing` para mantener el bundle inicial ligero.
