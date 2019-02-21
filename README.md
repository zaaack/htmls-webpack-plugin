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
            render(file, params) { // (src: string, params: Params) => string | Promise<string>, custom template rendering function, support async rendering, default is ejs
                return ''
            },
            htmls: [{
                src: '', // template path
                filename: '', // string | ((source, src, params) => string), relative to output path, can be a function to be generated via context
                render: (file, params) => string | Promise<string>, // override global render function
                flushOnDev: boolean // or string, override global flushOnDev
                params: { // custom params when rendering
                    //...
                }
            }],
            flushOnDev: false, // boolean | string, flush html files to dist, can be a string file path, useful for debug or devServer.
            publicPath: '', // function | string, override webpackConf's publicPath
            params: {  // custom params when rendering
                // ...
            }
        })
    ]
}

```

The variables in html templates:

```ts
interface Params {
  files: string[] // all files
  jses: string[] // all files ends with .js
  csses: string[] // all files ends with .css
  options: Props // plugin props
  compilation: Compilation // webpack compilation
  [k: string]: any // custom params via options
}
```

## Why not html-webpack-plugin

html-webpack-plugin is really hard to extends and slow for multiple htmls, too much complete features that I don't need. That's why I create this.

## License

MIT
