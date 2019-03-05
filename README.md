# htmls-webpack-plugin

[![Build Status](https://travis-ci.org/zaaack/htmls-webpack-plugin.svg?branch=master)](https://travis-ci.org/zaaack/htmls-webpack-plugin) [![npm](https://img.shields.io/npm/v/htmls-webpack-plugin.svg)](https://www.npmjs.com/package/htmls-webpack-plugin) [![npm](https://img.shields.io/npm/dm/htmls-webpack-plugin.svg)](https://www.npmjs.com/package/htmls-webpack-plugin)

Simple, flexible and fast html webpack plugin.

## Features

- Simple and flexisble, you can almost controll anything of generate htmls, no need of setup lots of plugins.
- Support multiple htmls by default
- Fast, almost 20x faster then html-webpack-plugin for 20+ pages.

## Install

```sh
npm i -D htmls-webpack-plugin
```

## Usage


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
            render: (file, params) => string | Promise<string>,
            htmls: [{
                // template path
                src: '',
                // string | ((source, src, params) => string), relative to output path, can be a function to be generated via context
                filename: '',
                // optional, override global render function
                render: (file, params) => string | Promise<string>,
                // optional, override global flushOnDev
                flushOnDev: boolean | string
                // custom params when rendering
                params: () => object | () => Promise<object> | object
                // transformParams, override global transformParams
                transformParams?: (params: Params) => Params & { [k: string]: any }
            }],

             /* boolean | string, flush html files to dist, can be a string file path, useful for debug or devServer. */
            flushOnDev: false,

             /* optional, override webpackConf's publicPath */
            publicPath: function | string',

            // optional, custom params when rendering, could be an async function
            params: () => object | () => Promise<object> | object

            // transformParams
            transformParams?: (params: Params) => Params & { [k: string]: any }
        })
    ]
}

```

The variables in html templates:

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

ejs example

```html
<body>
    <% for (let js in entries) {%>
        <script src="<%= js %>"></script>
    <% } %>
</body>
```

## Why not html-webpack-plugin

html-webpack-plugin is really hard to extends and slow for multiple htmls, too much complete features that I don't need. That's why I create this.

## License

MIT
