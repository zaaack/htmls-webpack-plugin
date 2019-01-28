import * as pathLib from 'path';
import * as fs from 'fs';
import webpack = require('webpack');
import * as ejs from 'ejs';
export interface Assets {
  [k: string]: {
    source: () => string
    size: () => number
  }
}
export interface Compilation extends webpack.Compiler {
  assets: Assets
}

export interface Params {
  files: string[]
  jses: string[]
  csses: string[]
  options: Props
  compilation: Compilation
}

export type Render = (src: string, params: Params) => string

export interface HtmlInfo {
  src: string
  filename: string | ((source: string, src: string, params: Params) => string)
  render?: Render
}

export interface Props {
  htmls: HtmlInfo[]
  render?: Render
  flushOnDev?: boolean
  publicPath?: string | ((name: string) => string)
}
export default class MultiHtmlPlugin {
  constructor(public props: Props) {

  }
  apply(compiler) {
    let outputPath = (compiler as webpack.Compiler).options.output!.path || process.cwd()
    let publicPath = this.props.publicPath || (compiler as webpack.Compiler).options.output!.publicPath || ''
    let defaultRender = (src, params) => {
      return ejs.renderFile(src, params, { async: true })
    }
    compiler.hooks.emit.tapPromise('RoutesPlugin', async (compilation: Compilation) => {
      let assets = { ...compilation.assets }
      let files = Object.keys(assets).map(f => {
        if (typeof publicPath === 'function') {
          publicPath = publicPath(f)
        }
        return publicPath + f
      })
      let jses = files.filter(k => k.endsWith('.js'))
      let csses = files.filter(k => k.endsWith('.css'))
      console.log('Start building htmls')
      console.time('builded-htmls')
      await Promise.all(
        this.props.htmls.map(
          async html => {
            let src = pathLib.resolve(process.cwd(), html.src)
            let render = html.render || this.props.render || defaultRender as Render
            let params: Params = { files, jses, csses, options: this.props, compilation }
            let source = await render(src, params)
            let dist = typeof html.filename === 'string' ? html.filename : html.filename(source, src, params)
            if (this.props.flushOnDev) {
              fs.writeFile(pathLib.resolve(outputPath, dist), source, err => {
                if (err) console.error(err)
              })
            }
            compilation.assets[dist] = {
              size: () => source.length,
              source: () => source,
            }
          }
        )
      )
      console.timeEnd('builded-htmls')
    })
  }
}


module.exports = MultiHtmlPlugin
module.exports.default = MultiHtmlPlugin
