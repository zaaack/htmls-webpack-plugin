# htmls-webpack-plugin

Simple, flexible and fast html webpack plugin.

## Features

- Simple and flexisble, you can almost controll anything of generate htmls, no need of setup lots of plugins.
- Support multiple htmls by default
- Fast, almost 20x faster then html-webpack-plugin for multiple pages.

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
            render(file, params) { // Custom template rendering function, default is ejs
                return /*...*/
            },
            htmls: [{
                src: '', // template path
                filename: '', // string | ((source, src, params) => string), relative to output path, can be a function to generate via context
                render: (file, params) => string // override global render function
            }],
            flushOnDev: false, // flush html files to dist in devServer
            publicPath: '', // function | string, override webpackConf's publicPath
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
}
```

## Why not html-webpack-plugin

html-webpack-plugin is really hard to extends and slow for multiple htmls, to much complete features that I don't need. That's why I create this.

## License

MIT
