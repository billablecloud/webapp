# Entorno de Pruebas - Billable

Este documento describe el entorno de pruebas configurado para la aplicación Billable.

## Tecnologías Utilizadas

- **Unit Testing**: [Jest](https://jestjs.io/) - Framework de pruebas unitarias rápido y completo.
- **E2E Testing**: [Cypress](https://www.cypress.io/) - Framework para pruebas de extremo a extremo en el navegador.
- **Mocking**: [ng-mocks](https://ng-mocks.sudo.eu/) - Librería para facilitar el mocking de componentes y servicios de Angular.

## Prerrequisitos

Asegúrate de tener instaladas las dependencias del proyecto:

```bash
npm install
```

## Ejecución de Pruebas

### Pruebas Unitarias (Jest)

Para ejecutar todas las pruebas unitarias:

```bash
npm test
```

Para ejecutar las pruebas en modo observación (watch mode):

```bash
npm run test:watch
```

Para generar un reporte de cobertura:

```bash
npm run test:coverage
```

### Pruebas E2E (Cypress)

Para abrir la interfaz interactiva de Cypress:

```bash
npm run e2e
```

Para ejecutar las pruebas E2E en modo "headless" (sin interfaz gráfica):

```bash
npm run e2e:run
```

> **Nota**: Para las pruebas E2E, asegúrate de que la aplicación esté ejecutándose (`npm start`) si Cypress no está configurado para iniciarla automáticamente (en esta configuración básica, se asume que la app corre en `http://localhost:4200`).

## Estructura de Pruebas

### Unitarias
- **Services**:
  - `theme.service.spec.ts`: Verifica la lógica de cambio de tema y persistencia.
  - `language.service.spec.ts`: Verifica el cambio de idioma.
- **Pipes**:
  - `translate.pipe.spec.ts`: Verifica la transformación de claves de traducción.
- **Components**:
  - `home-page.component.spec.ts`: Verifica la lógica del componente principal, incluyendo la estimación de precios y la llamada a la generación de PDF (mockeada).

### E2E
- `cypress/e2e/home.cy.ts`:
  - Carga de la página de inicio.
  - Verificación de elementos UI.
  - Interacción con el formulario.
  - Cambio de tema e idioma.

## Dependencias Clave

Ver `package.json` para la lista completa. Las principales para testing son:
- `jest`
- `jest-preset-angular`
- `cypress`
- `ng-mocks`
