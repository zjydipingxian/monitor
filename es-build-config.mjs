import esbuild from 'esbuild'
import minimist from 'minimist'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import fs from 'fs'
import { execSync } from 'child_process'

import ora from 'ora'
import { SingleBar, Presets } from 'cli-progress'

// 根目录
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

// 获取 packages 下面的子包目录
const packagesDir = fs
  .readdirSync(resolve(__dirname, 'packages'))
  .filter((dir) => {
    // 过滤掉不是文件夹的目录
    return fs.statSync(resolve(__dirname, 'packages', dir)).isDirectory()
  })

// 获取当前环境
const args = minimist(process.argv.slice(2))
const env = args._.length ? args._[0] : 'dev'
const isProduction = env === 'prod'

const buildPackage = async (target, progressBar) => {
  const spinner = ora(`Building ${target}...`).start()

  // 获取每个子包里面的 package.json 内容
  const pkg = require(`./packages/${target}/package.json`)

  const formats = ['iife', 'cjs', 'esm']
  const outdir = resolve(__dirname, 'packages', target, 'dist')

  await Promise.all(
    formats.map((format) =>
      esbuild
        .build({
          entryPoints: [
            resolve(__dirname, 'packages', target, 'src', 'index.ts'),
          ],
          bundle: true,
          sourcemap: !isProduction, // 生产环境不生成 sourcemap
          minify: isProduction, // 生产环境进行代码压缩
          format: format,
          globalName: pkg.buildOptions?.name,
          outfile: resolve(
            outdir,
            `${target}-${format === 'iife' ? 'global' : format}.js`
          ),
        })
        .then(() => {
          spinner.succeed(`Built ${target} in ${format} format`)
          progressBar.increment()
        })
        .catch((error) => {
          console.error(`Error building ${target} in ${format} format:`, error)
          process.exit(1)
        })
    )
  )

  if (isProduction) {
    // 生成 .d.ts 文件
    // try {
    //   execSync(
    //     `tsc --project packages/${target}/tsconfig.json --emitDeclarationOnly --outDir packages/${target}/dist`
    //   )
    //   spinner.succeed(`Generated .d.ts for ${target}`)
    // } catch (error) {
    //   console.error(`Error executing tsc: ${error.message}`)
    //   process.exit(1)
    // }
  }
}

const buildAllPackages = async () => {
  const progressBar = new SingleBar({}, Presets.shades_classic)
  progressBar.start(packagesDir.length, 0)

  await Promise.all(
    packagesDir.map((target) => buildPackage(target, progressBar))
  )

  progressBar.stop()
}

buildAllPackages().catch((error) => {
  console.error('Error building packages:', error)
  process.exit(1)
})
