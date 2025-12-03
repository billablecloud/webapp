# Memoria de Actividad 2: Generación de entornos de pruebas y casos de test asistidos por IA

**Asignatura:** Desarrollo Web en Entorno Cliente  
**Proyecto:** Billable - Plataforma SaaS  
**Fecha:** 03 de Diciembre de 2025  

---

## 1. Introducción y Contexto

En el marco de la asignatura de Desarrollo Web en Entorno Cliente, se nos ha propuesto el reto de dotar de un sistema de calidad automatizado a una aplicación web previamente desarrollada. El proyecto objeto de estudio es **Billable**, una aplicación *Single Page Application* (SPA) construida con **Angular 16** que permite la generación de presupuestos en PDF mediante inputs del usuario.

El objetivo principal de esta actividad no es solo la escritura de código de prueba, sino la **evaluación de las capacidades de los asistentes de IA** actuales para actuar como ingenieros de QA (Quality Assurance), delegando en ellos la configuración del entorno, la resolución de conflictos de dependencias y la redacción de los casos de prueba.

---

## 2. Análisis Arquitectónico y Estrategia de Pruebas

### 2.1. Arquitectura de la Aplicación
Antes de solicitar código a la IA, realicé un análisis manual de la estructura del proyecto para entender qué componentes eran críticos. La aplicación sigue una arquitectura modular típica de Angular:

*   **Módulo Core (`src/app/core`):** Contiene la lógica de negocio transversal y servicios *singleton*. Aquí residen `ThemeService` (gestión de estado visual) y `LanguageService` (internacionalización). Si estos fallan, la experiencia de usuario se rompe globalmente.
*   **Módulo Shared (`src/app/shared`):** Contiene utilidades reutilizables. Destaca el `TranslatePipe`, encargado de transformar las claves de texto en cadenas legibles. Un fallo aquí dejaría la interfaz llena de claves como `home.title` en lugar de texto real.
*   **Módulo Features (`src/app/features`):** Contiene las vistas principales. El componente `HomePageComponent` es el corazón de la aplicación, orquestando la entrada de datos del usuario y la llamada a la librería de generación de PDF.

### 2.2. Definición de la Estrategia
Basándome en este análisis, diseñé una estrategia de pruebas en dos niveles (Pirámide de Testing):

1.  **Pruebas Unitarias (Nivel bajo):** Para validar la lógica aislada de clases y funciones. Decidí migrar de **Karma/Jasmine** (el estándar antiguo de Angular) a **Jest**.
    *   *Justificación:* Jest es más rápido (ejecución en paralelo), tiene un mejor sistema de *mocking* integrado y no requiere levantar un navegador real para cada test unitario, lo que agiliza el ciclo de desarrollo.
2.  **Pruebas End-to-End (Nivel alto):** Para validar el flujo crítico del usuario. Seleccioné **Cypress**.
    *   *Justificación:* Permite simular un usuario real interactuando con el navegador, asegurando que la integración entre el formulario HTML, el componente TypeScript y la librería de PDF funciona en conjunto.

---

## 3. Interacción con el Asistente de IA: Configuración del Entorno

### 3.1. El Desafío de las Dependencias
La primera interacción con la IA fue para configurar el entorno. Aquí me encontré con la primera barrera técnica importante: la **compatibilidad de versiones**.

**Prompt Inicial:**
> "Configura un entorno de testing con Jest y Cypress para un proyecto Angular 16 existente."

**Problema Detectado:**
La IA inicialmente sugirió instalar las últimas versiones de `jest-preset-angular`. Sin embargo, al ejecutar la instalación, `npm` arrojó errores de dependencias cruzadas (*peer dependencies*), ya que las versiones actuales de las librerías de testing están pensadas para Angular 18/19.

**Solución Asistida:**
Tuve que refinar mi petición a la IA, proporcionándole los logs de error. La IA identificó correctamente que debía hacer un *downgrade* de las librerías.
*   Se instaló `jest-preset-angular@13.1.6` (compatible con Angular 16).
*   Se utilizó el flag `--legacy-peer-deps` para forzar la instalación.
*   Se generaron los archivos de configuración `jest.config.js` y `setup-jest.ts` automáticamente.

*Reflexión:* Este paso demostró que, aunque la IA es potente, requiere de un operador humano que sepa interpretar los errores de consola para guiarla hacia la solución correcta de versiones.

---

## 4. Desarrollo de los Casos de Prueba

### 4.1. Pruebas Unitarias: El Arte del Mocking
Para las pruebas unitarias, el mayor desafío fue aislar el código que queríamos probar de sus dependencias externas.

**Caso de Estudio: `HomePageComponent`**
Este componente tiene una dependencia fuerte con la librería `jspdf`. En un entorno de pruebas unitarias (Node.js), no existe un contexto gráfico real para generar un PDF. Si intentábamos ejecutar el código tal cual, fallaba.

Le pedí a la IA: *"Genera un test para HomePageComponent pero simula la librería jspdf para que no intente crear un archivo real".*

La IA implementó un **Mock** (un objeto simulado):
```typescript
// Mock generado por la IA
const mockJsPDFInstance = {
  text: jest.fn(), // Espía para verificar si se llama a la función text()
  save: jest.fn(), // Espía para verificar si se llama a save()
  // ...
};
```
Gracias a esto, pudimos verificar que *nuestro código* llama correctamente a la librería, sin necesidad de que la librería funcione realmente. Esto es la esencia de las pruebas unitarias: probar tu responsabilidad, no la de terceros.

### 4.2. Pruebas E2E con Cypress
Para Cypress, el enfoque fue diferente. Aquí queríamos probar la realidad.

**Escenario de Prueba:**
El script generado `home.cy.ts` realiza las siguientes acciones automatizadas:
1.  Visita la URL base.
2.  Localiza los inputs por su atributo `placeholder` (simulando cómo busca un usuario visualmente).
3.  Escribe datos de prueba ("Cliente Test", "Proyecto Web").
4.  Hace clic en el botón de "Cambiar Tema".
5.  **Aserción:** Verifica que la etiqueta `<body>` del documento HTML ha adquirido la clase `.dark-mode`.

Este test valida no solo la lógica de TypeScript, sino que el HTML está bien enlazado y que los estilos CSS responden al cambio de clase.

---

## 5. Resolución de Problemas Técnicos

Durante el desarrollo, surgieron incidencias que requirieron depuración conjunta con la IA:

1.  **Componentes Hijos Desconocidos:**
    Jest fallaba al renderizar `HomePageComponent` porque este contenía una etiqueta `<app-header>` que no estaba declarada en el módulo de pruebas.
    *   *Solución:* La IA recomendó la librería `ng-mocks`. Esto nos permitió usar `MockComponent(HeaderComponent)`, creando un componente "fantasma" que ocupa el lugar del header real sin ejecutar su lógica, simplificando el test del padre.

2.  **Falsos Positivos de Antivirus:**
    Al ejecutar `npm test`, el proceso se bloqueaba inesperadamente. Tras investigar, descubrí que el antivirus de Windows detectaba la creación masiva de procesos de Jest como una amenaza.
    *   *Solución:* La IA sugirió modificar el script de ejecución añadiendo el flag `--runInBand`. Esto fuerza a Jest a ejecutar los tests en serie (uno tras otro) en un solo proceso, en lugar de en paralelo. Aunque es ligeramente más lento, es más estable y evita el bloqueo de seguridad.

---

## 6. Análisis de Resultados

Tras estabilizar el entorno, ejecuté la batería completa de pruebas con el comando `npm run test:coverage`.

### 6.1. Métricas de Cobertura
El reporte final arroja una cobertura de sentencias (*Statements*) del **73.91%**.
*   **100% en Core:** Los servicios críticos (`LanguageService`, `ThemeService`) y pipes están totalmente cubiertos. Esto garantiza la estabilidad de la lógica de negocio base.
*   **~70% en Features:** El componente principal tiene buena cobertura en su lógica de estimación de precios, pero algunas ramas de interacción visual complejas quedaron fuera del alcance de las pruebas unitarias (aunque están cubiertas por los tests E2E).

*[Aquí debes insertar la captura de pantalla del archivo coverage/lcov-report/index.html]*

### 6.2. Evidencias
Las pruebas E2E confirmaron que el flujo de usuario es funcional, llenando el formulario y generando la solicitud de PDF sin errores de consola.

*[Aquí debes insertar la captura de pantalla de la ventana de Cypress ejecutando el test]*

---

## 7. Conclusiones y Reflexión Académica

La realización de esta práctica me ha permitido extraer varias conclusiones sobre el estado actual del desarrollo asistido por IA:

1.  **Acelerador de Configuración:** La IA brilla especialmente en las tareas de "fontanería" (setup). Configurar Jest en un proyecto Angular antiguo suele ser una tarea tediosa de prueba y error; con la IA, se redujo a minutos.
2.  **La Importancia del Criterio Técnico:** La IA puede generar código, pero no siempre entiende el contexto completo (como la versión exacta de Angular o las restricciones del antivirus). Sin un conocimiento base sobre qué es una *peer dependency* o cómo funciona un proceso de Node.js, hubiera sido imposible resolver los bloqueos que surgieron.
3.  **Calidad de Software:** La combinación de pruebas unitarias (para lógica) y E2E (para integración) proporciona una red de seguridad robusta. Herramientas como `ng-mocks` facilitan enormemente la escritura de tests unitarios aislados, promoviendo mejores prácticas de arquitectura.

En conclusión, la IA actúa como un "copiloto senior" que sugiere caminos y escribe código repetitivo, pero el "piloto" (el alumno) debe mantener el control de la dirección y entender profundamente la arquitectura del sistema que está probando.

---

## 8. Anexos

Se adjuntan a esta memoria los siguientes entregables técnicos:
1.  **TESTING.md**: Documentación técnica paso a paso para reproducir el entorno.
2.  **requirements.txt**: Listado exacto de versiones de dependencias para asegurar la reproducibilidad.
3.  **Código Fuente**: Repositorio completo con la implementación de los tests.
