# htmls-webpack-plugin

[![Build Status](https://travis-ci.org/zaaack/htmls-webpack-plugin.svg?branch=master)](https://travis-ci.org/zaaack/htmls-webpack-plugin) [![npm](https://img.shields.io/npm/v/htmls-webpack-plugin.svg)](https://www.npmjs.com/package/htmls-webpack-plugin) [![npm](https://img.shields.io/npm/dm/htmls-webpack-plugin.svg)](https://www.npmjs.com/package/htmls-webpack-plugin)

Simple, flexible and fast html webpack plugin.

> NOTE: v2 support webpack5, if you still using webpack4, please install htmls-webpack-plugin@v1.0.9

- [htmls-webpack-plugin](#htmls-webpack-plugin)
  - [Features](#features)
  - [Install](#install)
  - [Usage](#usage)
    - [Options](#options)
    - [ejs template example](#ejs-template-example)
    - [Available variables in html templates:](#available-variables-in-html-templates)
    - [Minify html](#minify-html)
    - [Example in tests](#example-in-tests)
  - [Why not html-webpack-plugin](#why-not-html-webpack-plugin)
  - [License](#license)

## Features

- Simple and flexisble, you can almost controll anything of generate htmls, no need of setup lots of plugins.
- Support multiple htmls by default
- Fast, almost 20x faster then html-webpack-plugin for 20+ pages.
- Rendered via fast & small template engine [ejs](https://ejs.co/) by default(you can customize via `render` function to use any template engine or just inject script tags string to the html body).

## Install

```sh
npm i -D htmls-webpack-plugin
```

## Usage

### Options

```ts
const HtmlsWebpackPlugin = require('htmls-webpack-plugin')

module.exports = {
    plugins: [
        new HtmlsWebpackPlugin({
             // optional, hooks
            beforeEmit: (compilation, compiler) => void,
             // optional, hooks
            afterEmit: (compilation, compiler) => void,
             // optional, default is ejs. custom template rendering function, support async rendering,
            render: (src: string, params: Params) => string | Promise<string>,
            htmls: [{
                // required, template path
                src: './index.ejs',
                // required, string | ((source, src, params) => string),
                // output filename,
                // relative to output path,
                // can be a function to generate via context
                filename: 'index.html',
                // optional, override global render function
                render: (src: string, params: Params) => string | Promise<string>,
                // optional, override global flushOnDev
                flushOnDev: boolean | string
                // optional, custom params when rendering
                params: () => object | () => Promise<object> | object
                // optional, transformParams, override global transformParams
                transformParams?: (params: Params) => Params & { [k: string]: any }
            }],

             /* boolean | string, optional, flush html files to output folder, can be a string file path, useful for debug or devServer. */
            flushOnDev: false,

             /* optional, override webpackConf's publicPath */
            publicPath: function | string',

            // optional, custom params when rendering, could be an async function
            params: () => object | () => Promise<object> | object

            // optional, transform template variables
            transformParams?: (params: Params) => Params & { [k: string]: any }
        })
    ]
}

```

### ejs template example

```html
<!-- index.ejs -->
<body>
    <% for (let js in entries) {%>
        <script src="<%= js %>"></script>
    <% } %>
</body>
```

### Available variables in html templates:

```ts
interface Params {
  entries: string[] // all entrypoints
  files: string[] // all files
  jses: string[] // all files ends with .js
  csses: string[] // all files ends with .css
  options: Props // plugin props
  compilation: Compilation // webpack compilation
  [k: string]: any // custom params via options
}
```

### Minify html

1. install [html-minifier](https://github.com/kangax/html-minifier)

```sh
yarn add -D html-minifier
```

2. minify your html in`render` function

```ts
const HtmlsWebpackPlugin = require('htmls-webpack-plugin')
const htmlMinifier = require('html-minifier')
const ejs = require('ejs')

// webpack.config.js
module.exports = {
    ...,
    plugins: [
        new HtmlsWebpackPlugin({
            htmls: [{
                src: './fixtures/index.ejs',
                filename: `index.html`,
                async render(src, params) {
                    let html = await ejs.renderFile(src, params, { async: true })
                    return require('html-minifier').minify(html)
                }
            }],
        })
    ]
}
```

### Example in tests

[index.test.ts](https://github.com/zaaack/htmls-webpack-plugin/blob/master/src/test/index.test.ts#L7)

## Why not html-webpack-plugin

html-webpack-plugin is really hard to extends and slow for multiple htmls, too much complete features that I don't need. That's why I create this.

## License

MIT
