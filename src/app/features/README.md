# Features

Cada carpeta dentro de `src/app/features` representa un dominio funcional independiente.

Estructura sugerida por feature:

```
feature-name/
  components/   # Componentes UI pequeños y reutilizables dentro de la feature
  pages/        # Contenedores enrutables; orquestan servicios y store
  services/     # Casos de uso e integraciones HTTP específicos
  store/        # Estado local (NgRx, Signals u otra solución)
```

Recordatorios:
- Evita importar directamente archivos internos de otras features; expón lo necesario con `index.ts`.
- Comparte utilidades genéricas moviéndolas a `src/app/shared`.
