# Reglas de Cursor para Gobierno Abierto Backend

Este directorio contiene las reglas que guían al asistente de IA de Cursor cuando trabajas en este proyecto.

## ¿Cómo funcionan?

Las reglas son archivos `.mdc` (Markdown con frontmatter YAML) que Cursor lee automáticamente. Se aplican según:

- **`alwaysApply: true`**: La regla siempre está activa en todas las conversaciones
- **`globs: **/*.ts`**: La regla se activa cuando abres archivos que coinciden con el patrón

## Reglas disponibles

1. **`nestjs-typescript-standards.mdc`** (siempre aplica)
   - Estándares de código TypeScript y NestJS
   - Convenciones de nomenclatura y estructura

2. **`nestjs-architecture.mdc`** (archivos `.module.ts`)
   - Arquitectura y estructura de módulos
   - Separación de responsabilidades

3. **`postgresql-database.mdc`** (entidades y repositorios)
   - Convenciones para TypeORM y PostgreSQL
   - Manejo de relaciones y consultas

4. **`pdf-handling.mdc`** (archivos relacionados con PDFs)
   - Validación y manejo de archivos PDF
   - Upload, almacenamiento y streaming

5. **`docker-configuration.mdc`** (archivos Docker)
   - Configuración de Dockerfile y Docker Compose
   - Variables de entorno y health checks

6. **`error-handling-validation.mdc`** (controladores y servicios)
   - Manejo de errores y excepciones
   - Validación con class-validator

7. **`testing-standards.mdc`** (archivos de test)
   - Estándares para tests unitarios y E2E
   - Mocks y buenas prácticas

## ¿Estas reglas están en el repositorio?

**Sí**, estas reglas están versionadas en Git para:
- ✅ Compartir estándares del equipo
- ✅ Mantener consistencia entre desarrolladores
- ✅ Documentar convenciones del proyecto
- ✅ Asegurar que todos usen las mismas reglas

## Personalización

Puedes crear reglas adicionales siguiendo el formato:

```markdown
---
description: Descripción de la regla
globs: **/*.ts  # Patrón de archivos (opcional)
alwaysApply: false  # true para aplicar siempre
---

# Contenido de la regla

Tu contenido aquí...
```

## Más información

Consulta la [documentación oficial de Cursor Rules](https://cursor.sh/docs) para más detalles.
