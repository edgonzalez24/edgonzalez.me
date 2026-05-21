---
title: "IA en tu workflow: qué funciona de verdad y qué no"
date: 2026-05-20
description: "Qué tareas con IA realmente aguantan en proyectos Nuxt/TypeScript reales y cuáles generan deuda técnica silenciosa. Mapa de confiabilidad por tarea."
tags: [ia, workflow, nuxt, vue, herramientas-dev]
author: Edwin Gonzalez
thumbnail: THUMBNAIL_PLACEHOLDER
---

El mes pasado perdí 40 minutos depurando una página que no renderizaba. El culpable era `queryContent('articles').find()` — sintaxis perfectamente válida, sin errores de TypeScript, generada con confianza por el modelo porque eso es la API de `@nuxt/content` v2. La forma correcta en v3 es `queryCollection('en_articles').all()`. Nombre diferente, firma diferente, modelo mental diferente. El problema no fue que la IA razonó mal. Fue que sus datos de entrenamiento no llegaron a la versión que realmente corre en mi proyecto.

Esa distinción importa más de lo que la mayoría de artículos sobre IA reconocen.

## El problema del desfase en los datos de entrenamiento

Todos los modelos populares — Claude, Copilot, ChatGPT — fueron entrenados con datos que llevan como mínimo meses de retraso respecto al estado actual de frameworks en desarrollo activo. Para APIs estables, esto no es problema. Para Nuxt 4, `@nuxt/content` v3 y `@nuxt/ui` v4, es un impuesto cotidiano.

El diff que más engaña es este:

```typescript
// Lo que la IA genera con confianza — API de @nuxt/content v2
const { data } = await useAsyncData('articles', () =>
  queryContent('articles').find()
)

// Lo que funciona en @nuxt/content v3
const { data: enArticles } = await useAsyncData('en-articles', () =>
  queryCollection('en_articles').all()
)
```

Compila. Pasa el typecheck. En runtime devuelve vacío o lanza un error de hidratación que te manda a buscar el problema en la capa equivocada. He visto este mismo error en tres proyectos Nuxt distintos, de desarrolladores que no son principiantes. Lo mismo con `@nuxt/ui` v4 — la sintaxis antigua `:ui="{ body: { padding: 'p-0' } }"` ya no existe. Todo va en `app.config.ts`.

La IA no alucina. Aprendió de código que alguna vez fue correcto.

## Dónde la IA realmente rinde

El desfase en entrenamiento es específico por tarea. Hay tareas donde la IA es rápida y el output es confiable, y tareas donde cuesta más tiempo del que ahorra.

Después de meses prestando atención a esto, tengo un mapa de confiabilidad aproximado:

**Alta confiabilidad (revisar rápido, confiar el output):**
- Schemas de Zod a partir de interfaces TypeScript
- Tests con Vitest para composables puros (especificá "Vitest not Jest" — por defecto usa `jest.fn()`)
- Interfaces TypeScript y tipos utilitarios
- Scaffolding de rutas de servidor Nuxt con h3
- Comparación de librerías, borrador de ADRs — tareas de investigación donde el riesgo de alucinación es bajo

**Confiabilidad media (revisar con cuidado):**
- CSS con Tailwind v4 — suele agregar un `tailwind.config.js` que Tailwind v4 ya no usa
- Estructura básica de componentes Vue

**Baja confiabilidad (punto de partida, nada más):**
- Consultas de `@nuxt/content` v3 — casi siempre genera sintaxis v2
- Configuración de slots y temas en `@nuxt/ui` v4
- Estructura de archivos en el directorio `app/` de Nuxt 4

**Parada obligatoria (nunca aceptar sin revisión de seguridad dedicada):**
- Lógica de autenticación
- Validación y sanitización de inputs
- Cualquier código que maneje permisos o credenciales de APIs externas

Apiiro encontró 322% más rutas de escalada de privilegios y 153% más fallas de diseño arquitectónico en código de seguridad generado por IA. No es una razón para estar nervioso — es una razón para tener una regla fija.

## Tres formas de cerrar la brecha de entrenamiento

El problema de confiabilidad es real, pero no es un techo fijo. Se puede reducir.

### 1. Darle la documentación real con `llms.txt`

Nuxt, Nuxt UI y `@nuxt/content` exponen su documentación en formato optimizado para IA en `/llms.txt` y `/llms-full.txt`. Cuando pegás la sección relevante en tu contexto antes de hacer una pregunta, el modelo deja de recurrir a sus datos de entrenamiento y usa lo que le diste. Más lento, pero drásticamente menos errores de API antigua.

### 2. Context7 MCP

Este es el que realmente tengo integrado. Context7 es un servidor MCP de código abierto de Upstash — gratuito, sin registro. Dos herramientas: `resolve-library-id` para encontrar la librería, `query-docs` para traer documentación coincidente con la versión exacta que te interesa. Cuando Claude Code lo tiene disponible, preguntar sobre `queryCollection` devuelve la documentación de v3, no de v2. La diferencia en calidad del output es notable.

### 3. Un `CLAUDE.md` corto y específico

Esto me sorprendió. Al principio escribí un CLAUDE.md largo que cubría todo. La propia guía de Anthropic dice que los archivos de instrucciones con demasiado contenido hacen que Claude los ignore. Ahora lo mantengo corto:

```markdown
## Stack
- Nuxt 4 (app/ directory), @nuxt/ui v4, @nuxt/content v3
- Tailwind CSS v4 (no tailwind.config.js)

## Gotchas importantes
- queryCollection necesita event como primer arg en rutas de server/
- Consultas de contenido: usar queryCollection('en_articles'), NO queryContent()
- Los overrides de slots van en app/app.config.ts bajo ui.componentName.slots
```

Tres bullets. Cada uno previene una categoría de errores que sin él tomaría 20-30 minutos diagnosticar.

::callout
El proyecto `nuxt-skills` (github.com/onmax/nuxt-skills) ofrece 18 archivos de skill para Nuxt 4, Vue 3 y Vitest, regenerados semanalmente desde la documentación oficial. Vale la pena si usás Claude Code o Cursor de forma intensiva.
::

## La deuda técnica silenciosa

GitClear analizó 211 millones de líneas de código y encontró algo que debería llamar la atención de cualquier equipo: la duplicación de código subió de 8.3% en 2021 a 12.3% en 2024, y la actividad de refactoring colapsó de 25% a menos del 10% de las líneas modificadas. El código generado por IA también se reescribe más rápido que el escrito por humanos — 7.9% se revisa dentro de dos semanas, frente al 5.5% históricamente.

Hay además el problema de los bugs fantasma. OX Security encontró que entre el 20-30% de los codebases con IA contienen lógica sobreingeniería para edge cases improbables o imposibles en el contexto real de la aplicación. Pasa todos los tests. Se ve bien pensado. Y silenciosamente hace el codebase más difícil de razonar, hasta que alguien tiene que extenderlo.

El reporte DORA 2025 lo resumió bien: la IA amplifica el sistema de ingeniería en el que opera. Buenas prácticas, arquitectura clara, cultura de revisión sólida — la IA mejora eso. Fundamentos débiles, requerimientos vagos, cobertura de tests baja — la IA empeora eso, más rápido.

::card
DORA 2025: la IA amplifica el sistema de ingeniería en el que opera. Los equipos maduros ven mejoras; los equipos con bases débiles ven cómo la IA magnifica su disfunción existente.
::

## Lo que el "vibe coding" realmente cuesta

Andrej Karpathy acuñó el término en febrero de 2025: describís la intención, aceptás la implementación, no revisás. El análisis de 470 PRs en GitHub le pone número al costo — el código generado por IA tiene 1.7x más probabilidades de tener errores de lógica importantes y 2.74x más de tener vulnerabilidades de seguridad cuando se acepta sin revisión.

Al principio pensé que esto era principalmente un problema de desarrolladores juniors. Resultó ser universal. Los desarrolladores seniors también caen, sobre todo cuando el código se ve sofisticado y hay apuro. Código sofisticado que está mal es peor que código obviamente malo, porque da más tiempo antes de que alguien lo detecte.

La mitigación no es compleja: leer el diff. Todo. Igual que harías con un PR de alguien que no conocés bien.

## El punto dulce: schemas de Zod

Acá es donde vuelvo cuando quiero usar IA para aceleración real. Le dás una interfaz TypeScript y pedís el schema de Zod:

```typescript
// content.config.ts — @nuxt/content v3
import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const articleSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.date(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  thumbnail: z.string(),
})

export default defineContentConfig({
  collections: {
    en_articles: defineCollection({
      type: 'page',
      source: 'articles/en/**/*.md',
      schema: articleSchema,
    }),
  },
})
```

El output es casi siempre correcto. La API es estable, el mapeo es mecánico, no hay desfase de versiones. Lo mismo con tests de Vitest para composables puros — especificá "Vitest not Jest" en tu prompt y el output es usable con revisión mínima. No son casos de uso glamorosos, pero son los que realmente ahorran tiempo sin generar factura de limpieza después.

## El panorama honesto

El 90% de los desarrolladores usa IA a diario. Alrededor del 30% no confía en el output. Ambos números pueden ser verdad al mismo tiempo, porque "usar IA" abarca desde hacer preguntas de rubber duck hasta aceptar PRs completos sin leer.

Los desarrolladores que conozco y obtienen valor consistente de estas herramientas comparten un hábito: saben qué tareas delegar y cuáles conservar. No tratan la IA como un booster de productividad general. La tratan como un especialista junior que es excepcionalmente bueno en ciertas cosas, peligrosamente confiado en otras, y no distingue entre las dos.

Si trabajás con Nuxt, Vue y TypeScript ahora mismo, empezá leyendo el mapa de confiabilidad de arriba, elegí una tarea de alta confiabilidad para automatizar, y medí si realmente te ahorra tiempo. Ese experimento concreto vale más que intentar asistir con IA todo el flujo de una vez.
