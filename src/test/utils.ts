import * as webpack from 'webpack'
import * as assert from 'assert'
import * as fs from 'fs'
import * as path from 'path';

export const OUTPUT_DIR = path.resolve(__dirname, './dist');
export function testHtmlPlugin (webpackConfig: any, expectedResults: (string | RegExp)[] = [], outputFile?: string | RegExp, expectErrors?: (string | RegExp)[], expectWarnings?: (string |RegExp)[]) {
    outputFile = outputFile || 'index.html';
    return new Promise(res => {
        webpack(webpackConfig, (err, stats) => {
          console.error(err)
            assert.deepEqual(err, null, 'no webpack error')
            const compilationErrors = (stats.compilation.errors || []).join('\n');
            if (expectErrors) {
              assert.notDeepEqual(compilationErrors, '', 'compilationErrors expectErrors');
            } else {
              assert.deepEqual(compilationErrors, '', 'compilationErrors');
            }
            const compilationWarnings = (stats.compilation.warnings || []).join('\n');
            if (expectWarnings) {
              assert.notDeepEqual(compilationWarnings, '', 'compilationWarnings expectErrors');
            } else {
              assert.deepEqual(compilationWarnings, '', 'compilationWarnings');
            }
            if (outputFile instanceof RegExp) {
              const fileNames = Object.keys(stats.compilation.assets);
              const matches = Object.keys(stats.compilation.assets).filter(item => (outputFile as RegExp).test(item));
              assert.notDeepEqual(matches[0] || fileNames, fileNames)
              outputFile = matches[0];
            }
            assert.equal(outputFile!.indexOf('[hash]'), -1)
            const outputFileExists = fs.existsSync(path.join(OUTPUT_DIR, outputFile!));
            assert(outputFileExists);
            if (!outputFileExists) {
              return
            }
            const htmlContent = fs.readFileSync(path.join(OUTPUT_DIR, outputFile!)).toString();
            let chunksInfo;
            for (let i = 0; i < expectedResults.length; i++) {
              const expectedResult = expectedResults[i];
              if (expectedResult instanceof RegExp) {
                if (!expectedResult.test(htmlContent)) {
                  console.error(expectedResult, htmlContent)
                }
                assert(expectedResult.test(htmlContent));
              } else {
                assert(htmlContent.includes(expectedResult.replace('%hash%', stats.hash!)));
              }
            }
            res()
          });
    })
  }
