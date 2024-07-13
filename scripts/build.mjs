import execa from 'execa'
import fs from 'fs'
import { cpus } from 'os'
const maxConcurrency = cpus().length

// 只读取 打包目录
const dirs = fs
  .readdirSync('./packages')
  .filter((f) => fs.statSync(`./packages/${f}`).isDirectory())

// 进行打包 并行打包
async function build(target) {
  await execa(
    'rollup',
    ['-c', '--bundleConfigAsCjs', '--environment', `TARGET:${target}`],
    {
      stdio: 'inherit',
    }
  ) // 子进程的输出在父包中输出
}

async function runParallel(source, iteratorFn) {
  const ret = []
  const executing = []
  for (const item of source) {
    const p = Promise.resolve().then(() => iteratorFn(item))
    ret.push(p)

    if (maxConcurrency <= source.length) {
      const e = p.then(() => {
        executing.splice(executing.indexOf(e), 1)
      })
      executing.push(e)
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing)
      }
    }
  }
  return Promise.all(ret)
}

runParallel(dirs, build).then(() => {
  console.log('\n\n  成功\n\n')
})
