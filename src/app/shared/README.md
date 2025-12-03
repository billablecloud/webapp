# Shared module

Componentes y utilidades reutilizables sin estado global:

- `components/`: UI pura y desacoplada.
- `directives/`: Directivas estructurales o de atributo reutilizables.
- `pipes/`: Pipes puros y centrados en presentación.
- `models/`: Interfaces y tipos compartidos.
- `utils/`: Funciones helper.

Nada en `shared` debe depender de una feature concreta; en su lugar, las features consumen `shared`.
