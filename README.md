# Billable - AI-Generated SaaS Platform 🤖✨

![Angular](https://img.shields.io/badge/Angular-16.2-dd0031?style=flat&logo=angular)
![AI Generated](https://img.shields.io/badge/Built%20with-AI-blueviolet)
![License](https://img.shields.io/badge/license-MIT-green)

**Billable** es una plataforma SaaS moderna diseñada para generar presupuestos y cotizaciones profesionales en PDF. Lo que hace único a este proyecto es que **ha sido construido enteramente a través de prompts de Inteligencia Artificial**, desde la arquitectura de carpetas hasta la lógica de negocio y el diseño UI.

## 🚀 Características

- **Generación de PDF en Cliente**: Crea presupuestos detallados instantáneamente sin necesidad de servidor (usando `jspdf`).
- **Diseño Moderno y Responsivo**: Una landing page atractiva y corporativa adaptada a todos los dispositivos.
- **Modo Oscuro / Claro**: Sistema de temas robusto basado en variables CSS con persistencia de preferencias.
- **Internacionalización (i18n)**: Soporte completo para Español e Inglés, con cambio de idioma en tiempo real.
- **Arquitectura Escalable**: Estructura modular basada en *Features*, *Core* y *Shared*.

## 🛠️ Stack Tecnológico

- **Framework**: Angular 16.2.0
- **Lenguaje**: TypeScript 5.1
- **Estilos**: CSS3 Moderno (Variables CSS para theming)
- **Librerías**: `jspdf` para la generación de documentos.

## 🤖 Desarrollo Asistido por IA

Este proyecto es un experimento y demostración del poder de la programación asistida por IA.
- **Arquitectura**: Definida por IA siguiendo las mejores prácticas de Angular.
- **Código**: Generado iterativamente mediante instrucciones en lenguaje natural.
- **Solución de Errores**: Conflictos de dependencias y configuración de Git resueltos por el agente de IA.

## 📂 Estructura del Proyecto

```
src/app/
├── core/           # Servicios singleton, guardias, modelos globales
│   ├── i18n/       # Diccionarios de traducción
│   └── services/   # ThemeService, LanguageService
├── shared/         # Componentes reutilizables (Header, Footer, UI Kit)
└── features/       # Módulos funcionales de la aplicación
    └── home/       # Landing page y lógica de generación de PDF
```

## 🏁 Comenzando

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

### Prerrequisitos
- Node.js (v16 o superior recomendado)
- NPM

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/billablecloud/webapp.git
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecución

Para iniciar el servidor de desarrollo:

```bash
npm start
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente si cambias algún archivo fuente.

## 🤝 Contribución

Este es un proyecto de código abierto generado por IA. ¡Siéntete libre de hacer fork y experimentar con tus propios prompts!

---
*Generado con ❤️ e Inteligencia Artificial.*
