export * from './handleEvents'
export * from './load'
export * from './replace'
import { setupReplace } from './load'
import { _global } from 'monitor-utils'
import { initOptions, log } from 'monitor-core'
import { SDK_VERSION, SDK_NAME } from 'monitor-shared'

import { InitOptions } from 'monitor-types'
function webInit(options: InitOptions = {}): void {
  if (!('XMLHttpRequest' in _global) || options.disabled) return
  initOptions(options)
  setupReplace()
}

function init(options: InitOptions = {}): void {
  console.log('🚀 ~ init ~ options:', options)
  webInit(options)
}

export { SDK_VERSION, SDK_NAME, init, log }
