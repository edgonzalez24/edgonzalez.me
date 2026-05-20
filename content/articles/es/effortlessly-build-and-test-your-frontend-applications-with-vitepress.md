---
title: "Construye y prueba tus aplicaciones frontend con VitePress sin esfuerzo: Tutorial paso a paso para crear un Blog"
date: 2023-02-09
description: Aprende a construir, estructurar y probar tus aplicaciones frontend usando VitePress con este tutorial paso a paso.
tags: [vitepress, vue, javascript, webdev]
author: Edwin Gonzalez
thumbnail: https://res.cloudinary.com/dhgcfzhm0/image/upload/v1779231242/thumbmail_egtlqh.jpg
---

Primero debemos hablar sobre qué es VitePress. VitePress es un generador de sitios estáticos moderno basado en la herramienta de construcción frontend Vite. Está diseñado para ser rápido y eficiente, lo que lo convierte en una excelente opción para construir sitios web y blogs de tamaño pequeño a mediano. Con su interfaz fácil de usar y compatibilidad con una amplia gama de tecnologías, incluyendo Vue.js, JavaScript y CSS, VitePress es una opción versátil para el desarrollo frontend.

Así es como empezar con VitePress:


## Instalación

  1. Instala Node.js y yarn o npm si aún no lo has hecho.

  2. Crea una nueva carpeta de proyecto.
  ```bash
  mkdir vitepress-project && cd vitepress-project
  ```

  3. Inicializa tu proyecto con tu gestor de paquetes preferido.

  ```bash
  yarn init
  ```

  4. Ahora instala algunos paquetes incluyendo VitePress. (Los últimos 4 nos ayudarán a crear nuestra colección de páginas JSON).

  ```bash
  yarn add vitepress vue nodemon gray-matter remove-markdown concurrently
  ```

  5. Configura nuestros scripts en package.json.

  ::warning{}
    NOTA: Cada vez que ejecutemos nuestro entorno de desarrollo, la colección de datos mencionada a continuación se actualizará.
  ::
  ```json
  {
    ...
    "scripts": {
      "dev": "concurrently \"nodemon --watch blog -e md collection.mjs\" && vitepress dev",
      "build": "node collection.mjs && vitepress build",
      "preview": "vitepress preview"
    },
    ...
  }
  ```

  6. Crea nuestras primeras vistas.

  ```bash
  echo '# Hello from Index' > index.md
  mkdir blog && echo '# Hello from First Article' > blog/first_article.md
  ```

  7. También es posible configurar nuestro proyecto para SEO, temas, entre otros. Aquí un ejemplo:

  ```js
  // .vitepress/config.js
  const META_TITLE = 'Blog VitePress';

  export default {
    lang: 'es',
    title: META_TITLE,
    description: 'A new website',
    themeConfig: {
      siteTitle: false,
      socialLinks: [
        { icon: 'github', link: '' },
      ]
    },
    head: [
      ['link', { rel: 'icon', type: 'image/x-icon', href: '/vite.ico' }],
      ['link', { rel: 'icon', type: 'image/png', href: '/vite.png' }],
    ],
  }
  ```

## Convertir nuestras páginas Markdown a una colección JSON

¿Por qué es importante? 🤔🤔

La respuesta es simple: las colecciones nos ayudan a crear vistas previas de nuestros artículos sin necesidad de duplicar información. (Es como si tuviéramos una API)

Esto es posible gracias a **nodemon, gray-matter, remove-markdown y concurrently**, que trabajan juntos para procesar y convertir un archivo markdown a un archivo JSON.

1. Configurar la colección de datos de artículos.
```js
// collection.mjs
import fs from 'node:fs/promises';
import matter from 'gray-matter';
import removeMd from 'remove-markdown';

const articles = await fs.readdir('./blog/');

const data = await Promise.all(
  articles.map(async (article) => {
    const file = matter.read(`./blog/${article}`, {
      excerpt: true,
      excerpt_separator: ''
    });

    const { data, content, path } = file;
    const contents = removeMd(content).trim().split(/\r\n|\n|\r/);

    return {
      ...data,
      title: contents[0].replace(/\s{2,}/g, '').trim(),
      path: path.replace(/\.md$/, '.html'),
      description: contents.slice(1).join('').replace(/\s{2,}/g, '').trim().substring(0, 300) + '...'
    }
  })
)

await fs.writeFile('./data.json', JSON.stringify(data), 'utf-8');
```

2. Ahora construye un nuevo archivo JSON. (Este comando generará un archivo más para nuestro proyecto, simplificando los elementos markdown a JSON).
```bash
yarn build && yarn dev
```


## Creando nuevos componentes Vue

1. Crea un componente Hero.
```vue
<!-- .vitepress/components/Hero.vue -->
<script setup>
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme;

</script>

<template #home-hero-before>
  <div class="container">
    <div class="banner">
      <div class="banner-hero"></div>
      <div class="banner-hero-text">
        <h1>Creating a new blog</h1>
      </div>
    </div>
  </div>
</template>
```

2. Ahora es el momento de crear un componente para listar nuestros artículos creados en la carpeta blog.
```vue
<!-- .vitepress/components/ListArticles.vue -->
<script setup>
import data from '../../data.json';
import DefaultTheme from 'vitepress/theme';
import Card from './Card.vue';

const { Layout } = DefaultTheme;

// ordenar artículos
const articles = data.sort(
  (a, b) => new Date(b.Updated) - new Date(a.Updated)
)

</script>

<template>
  <Layout>
    <template #home-hero-after>
      <div class="container">
        <h2 class="title">List of recent added articles</h2><br>
        <div class="article-container">
          <div v-for="article in articles">
            <Card :article="article" />
          </div>
        </div>
      </div>
    </template>
  </Layout>
</template>
```

3. También podemos crear un componente de tarjeta individual para la vista previa de cada artículo.
```vue
<!-- .vitepress/components/Card.vue -->
<script setup>
  defineProps({
    article: Object
  });

  const transformDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

</script>

<template>
  <a :href="article.path">
    <div class="card">
      <div class="card-header">
        <img :src="article.image" :alt="article.title" />
      </div>
      <div class="card-body">
        <h4>
          {{ article.title }}
        </h4>
        <p>
          {{ article.description }}
        </p>
        <div>
          <h5 class="date">{{ transformDate(article.Updated) }}</h5>
        </div>
      </div>
    </div>
  </a>
</template>
```

4. Crea el archivo de entrada del tema. Debe exportar el tema como su exportación predeterminada. También revisa los [Layout slots](https://vitepress.dev/guide/extending-default-theme#layout-slots) que ofrece VitePress.
```js
//.vitepress/theme/index.js
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme';
import Hero from '../components/Hero.vue';
import ListArticles from '../components/ListArticles.vue';
import '../main.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-hero-before': () => h(Hero),
      'home-hero-after': () => h(ListArticles),
      'doc-after': () => h('div', {}, [
        h(
          'div',
          {
            class: 'link',
          },
          [
            h(
              'a',
              {
                href: '/',
                rel: 'noopener',
              },
              [h('span', '< Back')]
            ),
          ]
        )
      ]),
    })
  }
}
```

## Finalmente

Ahora puedes crear un blog usando VitePress de una manera muy sencilla. Comparto el [repositorio en Github](https://github.com/edgonzalez24/blog-vitepress) para que puedas revisar el código fuente.

![Demo Image](https://res.cloudinary.com/dhgcfzhm0/image/upload/v1779231243/demo_qkllvg.webp)

¡Gracias por leer! nos vemos pronto. 🙌🏽🙌🏽
