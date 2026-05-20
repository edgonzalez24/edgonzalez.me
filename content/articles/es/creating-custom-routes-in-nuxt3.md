---
title: "Creando rutas personalizadas en Nuxt3 (Sin perder la cordura)"
date: 2025-05-05
description: Aprende a crear rutas personalizadas en Nuxt 3, cómo deshabilitar el enrutamiento automático y cómo organizar tus archivos de rutas con una arquitectura limpia.
tags: [nuxt3, vue, javascript, webdev]
author: Edwin Gonzalez
thumbnail: https://res.cloudinary.com/dhgcfzhm0/image/upload/v1779231246/creating-custom-routes-in-nuxt3_brrrmq.webp
---

Me gustaría compartir una experiencia que tuve hace unos días durante un desafío de trabajo, que puede haberte pasado o podría pasarte si usas Nuxt3. ¡Vamos!


En Nuxt3, el sistema de enrutamiento se basa en la estructura de archivos dentro del directorio `pages`, lo que facilita la creación automática de rutas. Sin embargo, al estar construido sobre vue-router, Nuxt3 también permite rutas personalizadas flexibles. Esto te da la capacidad de extender o modificar el comportamiento del router para adaptarlo a las necesidades específicas de tu proyecto (en mi caso necesitaba tener rutas dinámicas para manejar subdominios para distintos tipos de usuarios, pero los usuarios finales también pueden usar la aplicación en formato embed o normal, usando los mismos componentes; solo necesitaba modificar las rutas).


## ¿Cómo lo logramos?

Debemos ubicarnos dentro del directorio `app/` porque esa carpeta está diseñada específicamente para extender o personalizar el comportamiento interno del framework.

Luego podemos crear un archivo `router.options.ts`. Usando las opciones del router podemos opcionalmente sobrescribir o extender las rutas usando una función que acepta las rutas escaneadas y retorna rutas personalizadas. El siguiente ejemplo:

```ts
// app/router.options.ts
// Importa el tipo RouterConfig para tipado correcto
import type { RouterConfig } from '@nuxt/schema'

export default {
  // Define rutas personalizadas manualmente
  routes: (_routes) => [
    {
      // Nombre de la ruta (usado en navegación programática)
      name: 'home',
      // Ruta URL
      path: '/',
      // Carga el componente de forma lazy
      component: () => import('~/pages/home.vue')
    }
  ],
} satisfies RouterConfig;
// Asegura que el objeto coincide con la configuración de router esperada por Nuxt

```

::note{}
Referencia de documentación: https://nuxt.com/docs/guide/recipes/custom-routing#router-options
::


Algo que no se ve directamente en la documentación es que si necesitamos sobrescribir nuestras rutas manualmente, el sistema de rutas automático debe deshabilitarse desde la opción `pages` en nuestro `nuxt.config.ts`:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  // ...nuestra_config,
  pages: false, // Agrega este código (por defecto es true)
});
```


Antes de terminar, me gustaría compartir un tip extra que puede ayudarte a organizar mejor tus rutas y evitar tener un archivo extremadamente largo si tu proyecto tendrá muchas rutas.

Puedes crear un archivo de importaciones exclusivo para rutas (puedes llamarlo `router.imports.ts`):

```ts
// router.imports.ts
export { default as WebsiteHome } from '~~/pages/website/home.vue';
export { default as WebsiteAbout } from '~~/pages/website/about.vue';
...
...
```

Ahora podemos crear otro archivo barrel para la definición de rutas (`website.routes.ts`):


```ts
// website.routes.ts
import {
  WebsiteHome,
  WebsiteAbout
} from './routes.import';

const websiteChildren = [
  {
    name: 'WebsiteHome',
    path: '',
    component: WebsiteHome,
  },
  {
    name: 'Website',
    path: 'about',
    component: WebsiteAbout,
  },
]

export const websiteRoutes = {
  name: 'WebsiteRoot',
  path: '',
  children: websiteChildren,
}
```

Finalmente, podemos usar nuestro `router.options.ts` con las importaciones de rutas definidas así:

```ts
import type { RouterConfig } from '@nuxt/schema';
import { exampleRoutes } from './example.routes';
import { websiteRoutes } from './website.routes'

export default {
  routes: (_routes) => [
    exampleRoutes,
    websiteRoutes,
    //...
  ],
} satisfies RouterConfig

```


Ha sido un placer compartir esta experiencia contigo, ¡hasta la próxima! :)
