import { testHtmlPlugin, OUTPUT_DIR } from "./utils";
import * as path from 'path';
import HtmlsWebpackPlugin from '../index';
const p = (p: string) => path.join(__dirname, p)
describe('simple', () => {
    it('simple', async () => {
        await testHtmlPlugin({
            mode: 'production',
            entry: p('fixtures/index.js'),
            output: {
                path: OUTPUT_DIR,
                filename: 'index_bundle.js'
            },
            plugins: [new HtmlsWebpackPlugin({
                htmls: [{ src: p('./fixtures/index.ejs'),
                filename: `index.html` }],
            })]
            }, [/<body>[\s]*<script src="index_bundle.js"><\/script>[\s]*<\/body>/]);
    })
})
