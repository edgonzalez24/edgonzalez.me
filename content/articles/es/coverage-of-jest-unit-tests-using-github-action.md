---
title: "Cobertura de pruebas unitarias Jest con GitHub Actions"
date: 2023-02-03
description: Descubre cómo configurar una GitHub Action para generar y visualizar reportes de cobertura de pruebas unitarias con Jest.
tags: [jest, github-action, javascript, webdev]
author: Edwin Gonzalez
thumbnail: https://res.cloudinary.com/dhgcfzhm0/image/upload/v1779231244/thumbnail_dwb5ue.webp
---

La cobertura de código es una métrica importante para medir la calidad de tus pruebas de software. Proporciona una manera de cuantificar cuánto de tu código está siendo probado y te ayuda a identificar áreas que pueden no estar adecuadamente cubiertas.

Al usar Jest con GitHub Actions, puedes automatizar el proceso de ejecutar pruebas y obtener reportes de cobertura, facilitando el seguimiento de la cobertura de código a lo largo del tiempo. Esto puede ayudarte a asegurar que tu código esté bien probado, reducir el riesgo de introducir errores y hacer que el mantenimiento sea más sencillo en el futuro.

Además, tener reportes de cobertura disponibles en tu repositorio de GitHub puede ayudarte a comunicar la calidad de tus pruebas a otros miembros del equipo o clientes, aumentando la confianza en tu proceso de desarrollo.

Ahora, utilizaremos la siguiente herramienta: [Jest coverage report action](https://www.covbot.dev/)

::tip{}
Es una herramienta que te ayuda a llevar el control de la cobertura de tu proyecto. Genera un comentario de reporte para cada PR. Además, resalta archivos con cobertura reducida y archivos nuevos.
::

![Track code](https://res.cloudinary.com/dhgcfzhm0/image/upload/v1779231244/track-code_ss1ich.webp)

## ¿Cómo configuramos nuestro proyecto?

1. Crea un nuevo script para ejecutar todas las pruebas unitarias y generar un reporte de cobertura.
::warning{}
  NOTA: Este script genera un nuevo archivo con extensión JSON, por lo que para que nuestra GitHub action funcione bien, este archivo debe estar ya agregado al proyecto al hacer nuestro PR. Si no se genera, aparecerá un error indicando que el archivo no se encuentra.
::

```json
//package.json
{
  "name": "my project",
  "version": "1.0.0",
  "scripts": {
    "coverage": "jest --json --coverage --outputFile=report.json"
  }
 //...
}
```

2. Edita los reportes de cobertura desde `jest.config.js` o el archivo de configuración de Jest.
```js
//jest.config.js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["**/*.{js,vue}", "!**/node_modules/**"],
  coverageReporters: [ "text", "text-summary"]
}
```

3. Crea un nuevo archivo de workflow en tu proyecto: Los archivos de workflow se almacenan en el directorio `.github/workflows` de tu repositorio y definen los pasos que ejecutará el runner de GitHub Actions. Para crear uno, crea un nuevo archivo `.yml` en ese directorio.

4. Agrega un nuevo paso a tu archivo de workflow de GitHub Actions.
`(por ejemplo, coverage.yml)`

5. Ahora debemos configurar en qué ramas queremos que se ejecute nuestra GitHub action.
```yml
#coverage.yml
name: 'coverage'
on:
  pull_request:
    branches:
      - main
      - develop
```

6. Habilita los permisos para que nuestra GitHub action pueda ejecutarse.
```yml
#coverage.yml
jobs:
  coverage:
    permissions:
      checks: write
      pull-requests: write
      contents: write
```

7. Es momento de configurar los pasos finales del reporte.
```yml
 runs-on: ubuntu-latest
 steps:
   - uses: actions/checkout@v3
   - uses: actions/setup-node@v3
     with:
       cache: 'yarn'
   - uses: ArtiomTr/jest-coverage-report-action@v2.1.2
     id: coverage
     with:
       annotations: none
       package-manager: yarn
       test-script: yarn coverage
       icons: emoji 
```

Al final, tendrás una configuración completa como la siguiente:
```yml
#coverage.yml
name: 'coverage'
on:
  pull_request:
    branches:
      - main
      - develop
jobs:
  coverage:
    permissions:
      checks: write
      pull-requests: write
      contents: write
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          cache: 'yarn'
      - uses: ArtiomTr/jest-coverage-report-action@v2.1.2
        id: coverage
        with:
          annotations: none
          package-manager: yarn
          test-script: yarn coverage
          icons: emoji
```

Comparto el resultado final: una vez que ejecutas tu GitHub action, podrás observar en el reporte los porcentajes, el número de pruebas y el número de suites de pruebas ejecutadas en ese momento.

También cabe mencionar que el reporte se vuelve a ejecutar si se hace un nuevo commit al PR.

![Pull request](https://res.cloudinary.com/dhgcfzhm0/image/upload/v1779231244/pull-request_jmcnhs.webp)


En resumen, la cobertura de pruebas unitarias con Jest y GitHub Actions es importante porque te ayuda a:

  1. Asegurar que tu código esté bien probado.
  2. Reducir el riesgo de introducir errores en tu código.
  3. Hacer un seguimiento sencillo de la calidad de tus pruebas a lo largo del tiempo.
  4. Comunicar la calidad de tus pruebas a otras personas.
  5. Construir confianza en tu proceso de desarrollo.

¡Gracias por leer! nos vemos pronto. 🙌🏽🙌🏽
