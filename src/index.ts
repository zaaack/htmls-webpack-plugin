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
  entrypoints: Map<string, any>
}

export interface Params {
  entries: string[]
  files: string[]
  jses: string[]
  csses: string[]
  options: Props
  compilation: Compilation
  [k: string]: any
}

export type Render = (src: string, params: Params) => string | Promise<string>

export type GeneralParams = {
  [k: string]: any
}

function isCustomParamsFn(g: any): g is CustomParamsFn {
  return typeof g === 'function'
}
export type CustomParamsFn = ((compilation: Compilation, compiler: webpack.Compiler) => GeneralParams | Promise<GeneralParams>)
export type CustomParams = GeneralParams | CustomParamsFn
export interface HtmlInfo {
  src: string
  filename: string | ((source: string, src: string, params: Params) => string)
  render?: Render
  params?: CustomParams
  flushOnDev?: boolean | string
  transformParams?: ParamTransformer
}

export type ParamTransformer = (params: Params) => Params & { [k: string]: any }

export interface Props {
  htmls: HtmlInfo[]
  render?: Render
  flushOnDev?: boolean | string
  publicPath?: string | ((name: string) => string)
  params?: CustomParams
  beforeEmit?: (compilation: Compilation, compiler: webpack.Compiler) => void | Promise<void>,
  afterEmit?: (compilation: Compilation, compiler: webpack.Compiler) => void | Promise<void>,
  transformParams?: ParamTransformer
}

function defaults<T>(val: T | undefined | null, defaults: T): T {
  return val == null ? defaults : val
}
export default class HtmlsPlugin {
  constructor(public props: Props) {
  }
  apply(compiler) {
    let outputPath = (compiler as webpack.Compiler).options.output!.path || process.cwd()
    let publicPath = this.props.publicPath || (compiler as webpack.Compiler).options.output!.publicPath || ''
    let defaultRender = (src, params) => {
      return ejs.renderFile(src, params, { async: true })
    }
    let toCDN = (f: string) => {
      if (typeof publicPath === 'function') {
        publicPath = publicPath(f)
      }
      return publicPath + f
    }
    compiler.hooks.emit.tapPromise(HtmlsPlugin.name, async (compilation: Compilation) => {
      if (this.props.beforeEmit) {
        await this.props.beforeEmit(compilation, compiler as webpack.Compiler)
      }
      let assets = { ...compilation.assets }
      let files = Object.keys(assets).map(toCDN)

      let jses = files.filter(k => k.endsWith('.js')).reverse()
      let csses = files.filter(k => k.endsWith('.css'))

      let entries: string[] = []
      for (const [k, v] of compilation.entrypoints) {
        entries = entries.concat(v.getFiles())
      }
      entries = entries.map(toCDN)

      console.log('Start building htmls')
      console.time('builded-htmls')

      async function resolveCustomParams(params?: CustomParams): Promise<GeneralParams | undefined> {
        return isCustomParamsFn(params)
        ? await params(compilation, compiler as webpack.Compiler)
        : params
      }
      const propCustomParams = await resolveCustomParams(this.props.params)
      await Promise.all(
        this.props.htmls.map(
          async html => {
            let src = pathLib.resolve(process.cwd(), html.src)
            let render = html.render || this.props.render || defaultRender as Render
            let htmlCustomParams = await resolveCustomParams(html.params)
            let params: Params = {
              files: files.slice(),
              jses: jses.slice(),
              csses: csses.slice(),
              entries: entries.slice(),
              options: this.props,
              compilation,
              ...propCustomParams,
              ...htmlCustomParams,
            }

            let transform = this.props.transformParams || html.transformParams
            if (transform) {
              params = transform(params)
            }
            let source = await render(src, params)
            let filename = typeof html.filename === 'string' ? html.filename : html.filename(source, src, params)

            let flushOnDev = defaults<string | boolean>(defaults(this.props.flushOnDev, html.flushOnDev!) , false)
            if (flushOnDev) {
              let outFile = typeof flushOnDev === 'string' ? flushOnDev : pathLib.resolve(outputPath, filename)
              fs.writeFile(outFile, source, err => {
                if (err) console.error(err)
              })
            }

            compilation.assets[filename] = {
              size: () => source.length,
              source: () => source,
            }
          }
        )
      )
      console.timeEnd('builded-htmls')
      if (this.props.afterEmit) {
        await this.props.afterEmit(compilation, compiler as webpack.Compiler)
      }
    })
  }
}


module.exports = HtmlsPlugin
module.exports.default = HtmlsPlugin
