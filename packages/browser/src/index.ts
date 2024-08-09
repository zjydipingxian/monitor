export * from './handleEvents'

import { _global } from 'monitor-utils'
import { initOptions, log } from 'monitor-core'
import { SDK_VERSION, SDK_NAME } from 'monitor-shared'
function webInit(options: any): void {
  if (!('XMLHttpRequest' in _global) || options.disabled) return
  initOptions(options)
}

function init(options: any): void {
  webInit(options)
}

export { SDK_VERSION, SDK_NAME, init, log }
