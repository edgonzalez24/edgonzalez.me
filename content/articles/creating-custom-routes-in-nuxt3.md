---
title: "Creating Custom Routes in Nuxt3 (Without Losing Your Mind)"
date: 2025-05-05
description: Learn how to create custom routes in Nuxt 3 without losing your mind, how to disable automatic routing, and how to organize your route files with a clean architecture.
tags: [nuxt3, vue, javascript, webdev]
author: Edwin Gonzalez
thumbnail: /articles/creating-custom-routes-in-nuxt3.webp
---

I'd like to share an experience I had a couple of days ago during a work challenge, which may have happened to you or could happen to you if you use Nuxt3. Let's jump!


In Nuxt3, the routing system is based on the file structure within the pages directory, which facilitates automatic route creation. However, being built on top of vue-router, Nuxt3 also allows for flexible custom routes. This gives you the ability to extend or modify the router's behavior to suit your project's specific needs (I needed to have dynamic routes to manage subdomains for different types of users, but end users can also use the application in embed or normal format, the latter using the same components, I just needed to modify the routes).


## So, how do we achieve this?

We must be located inside the app/ directory because that folder is specifically designed to extend or customize the internal behavior of the framework.

Then, we can create a router.options.ts file, using router options we can optionally override or extend your routes using a function that accepts the scanned routes and returns customized routes. The following example code.

```ts
// app/router.options.ts
// Import the RouterConfig type for proper typing
import type { RouterConfig } from '@nuxt/schema'

export default {
  // Define custom routes manually
  routes: (_routes) => [
    {
      // Route name (used in programmatic navigation)
      name: 'home',
      // URL path
      path: '/',
      // Lazy-load the component
      component: () => import('~/pages/home.vue')
    }
  ],
} satisfies RouterConfig;
// Ensures the object matches Nuxt's expected router config

```

::note{}
Documentation reference: https://nuxt.com/docs/guide/recipes/custom-routing#router-options
::


Something that cannot be seen directly in the documentation link is that if we need to override our routes manually, the automatic route system must be disabled from the pages option in our nuxt.config.ts

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  // ...our_config,
  pages: false, // Add this code (by default is true)
});
```


Before I go, I would like to share an extra tip that can help you organize your routes better and avoid having an extremely large file if your project will have many routes.

You can create a route-only import file (you can call it router.imports.ts).

```ts
// router.imports.ts
export { default as WebsiteHome } from '~~/pages/website/home.vue';
export { default as WebsiteAbout } from '~~/pages/website/about.vue';
...
...
```

Now we can create another barrel file for route definition (website.routes.ts)


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

Finally, we can use our router.options.ts with the route imports defined like this:

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


It has been a pleasure to share this experience with you, see you next time!!. :)
