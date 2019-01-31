import { task, desc, option, fs } from 'foy'

task('build', async ctx => {
  // Your build tasks
  await ctx.exec('tsc')
  await fs.rmrf('lib/test')
})

task('test', async ctx => {
  await ctx.exec(`mocha --timeout 100000 -r ts-node/register -r tsconfig-paths/register ./src/test/**/*.test.ts`)
})
