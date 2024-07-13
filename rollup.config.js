import commonJS from '@rollup/plugin-commonjs' // 查找和打包node_modules中的第三方模块
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve' // 查找和打包node_modules中的第三方模
import typescript from '@rollup/plugin-typescript' // 解析TypeScript
import del from 'rollup-plugin-delete' // 打包前删除之前
import path from 'path'

// 获取文件路径
let packagesDir = path.resolve(__dirname, 'packages')

// 获取需要打包的包 reactivity, shared
let packageDir = path.resolve(packagesDir, process.env.TARGET)

console.log('packagesDir', packageDir)

// 每个包的项目配置
let resolve = (p) => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))

const name = path.basename(packageDir)

console.log('ddddddd', name)

const outputConfigs = {
  'esm-bundler': {
    file: resolve(`dist/${name}.esm-bundler.js`),
    format: 'es',
  },
  'esm-browser': {
    file: resolve(`dist/${name}.esm-browser.js`),
    format: 'es',
  },
  cjs: {
    file: resolve(`dist/${name}.cjs.js`),
    format: 'cjs',
  },
  umd: {
    file: resolve(`dist/${name}.umd.js`),
    format: 'umd',
  },
  global: {
    file: resolve(`dist/${name}.global.js`),
    format: 'iife',
    globals: {
      [123123]: 'globalVariable',
    },
    globalName: 'MyLibrary',
  },
}

// 获取到打包的包
const options = pkg.buildOptions

// rollup需要导出一个配置
function createConfig(format, output) {
  if (!output) {
    throw new Error(`Invalid format: ${format}`)
  }

  output.name = options.name
  output.sourcemap = true

  return {
    input: resolve('src/index.ts'), // 打包入口
    output,
    plugins: [
      json({
        namedExports: false,
      }),

      commonJS(),
      nodeResolve(),
      typescript({
        tsconfig: path.resolve(__dirname, 'tsconfig.json'),
        declaration: true, // 启用声明文件的生成
        declarationDir: 'types', // 指定声明文件的输出目录
      }),
    ],
  }
}

if (
  !options ||
  !options.formats ||
  !Array.isArray(options.formats) ||
  !options.formats.length
) {
  throw new Error('Invalid build options')
}

export default options.formats.map((format) =>
  createConfig(format, outputConfigs[format])
)
