import { EventTypes } from 'monitor-shared'
import { ViewModel, VueInstance } from './types'
import { getFlag, setFlag, Severity, silentConsoleScope } from 'monitor-utils'
import { handleVueError } from './helper'

const hasConsole = typeof console !== 'undefined'

const MonitorVue = {
  install(Vue: VueInstance): void {
    if (getFlag(EventTypes.VUE) || !Vue || !Vue.config) return
    setFlag(EventTypes.VUE, true)
    // vue 提供 warnHandler errorHandler报错信息
    Vue.config.errorHandler = function (
      err: Error,
      vm: ViewModel,
      info: string
    ): void {
      handleVueError.apply(null, [
        err,
        vm,
        info,
        Severity.Normal,
        Severity.Error,
        Vue,
      ])
      if (hasConsole && !Vue.config.silent) {
        silentConsoleScope(() => {
          console.error('Error in ' + info + ': "' + err.toString() + '"', vm)
          console.error(err)
        })
      }
    }
  },
}

export { MonitorVue }
