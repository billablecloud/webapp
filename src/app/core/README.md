# Core module

Contiene piezas singleton inicializadas una sola vez:

- `guards/`: Protección de rutas.
- `interceptors/`: Interceptores HTTP globales.
- `services/`: Servicios compartidos de infraestructura (auth, configuración, logging).
- `state/`: Estado global (ej. app config, usuario autenticado).

Nada dentro de `core` debe depender de una feature específica para evitar ciclos.
