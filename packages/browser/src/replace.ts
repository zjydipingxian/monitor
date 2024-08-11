import {
  _global,
  getLocationHref,
  getTimestamp,
  isExistProperty,
  on,
  replaceOld,
  supportsHistory,
  throttle,
  variableTypeDetection,
} from 'monitor-utils'

import {
  options,
  ReplaceHandler,
  subscribeEvent,
  triggerHandlers,
} from 'monitor-core'
import { EMethods, MonitorHttp, MonitorXMLHttpRequest } from 'monitor-types'
import { voidFun, EventTypes, HttpTypes, HttpCodes } from 'monitor-shared'

function isFilterHttpUrl(url: string) {
  return options.filterXhrUrlRegExp && options.filterXhrUrlRegExp.test(url)
}

function replace(type: EventTypes) {
  switch (type) {
    case EventTypes.XHR:
      xhrReplace()
      break
    case EventTypes.FETCH:
      break
    case EventTypes.ERROR:
      listenError()
      break
    case EventTypes.CONSOLE:
      consoleReplace()
      break
    case EventTypes.HISTORY:
      historyReplace()
      break
    case EventTypes.UNHANDLEDREJECTION:
      unhandledrejectionReplace()
      break
    case EventTypes.DOM:
      domReplace()
      break
    case EventTypes.HASHCHANGE:
      listenHashchange()
      break
    default:
      break
  }
}

export function addReplaceHandler(handler: ReplaceHandler) {
  if (!subscribeEvent(handler)) return
  replace(handler.type as EventTypes)
}

function xhrReplace(): void {
  if (!('XMLHttpRequest' in _global)) {
    return
  }

  const originalXhrProto = XMLHttpRequest.prototype

  replaceOld(originalXhrProto, 'open', (originalOpen: voidFun): voidFun => {
    return function (this: MonitorXMLHttpRequest, ...args: any[]) {
      this.monitor_xhr = {
        method: variableTypeDetection.isString(args[0])
          ? args[0].toUpperCase()
          : args[0],
        url: args[1],
        sTime: getTimestamp(),
        type: HttpTypes.XHR,
      }

      originalOpen.apply(this, args)
    }
  })

  replaceOld(originalXhrProto, 'send', (originalSend: voidFun): voidFun => {
    return function (this: MonitorXMLHttpRequest, ...args: any[]) {
      const { method, url } = this.monitor_xhr

      on(this, 'loadend', function (this: MonitorXMLHttpRequest) {
        // 排除自己本身埋点接口
        if (method === EMethods.Post) {
          return
        }

        const { responseType, response, status } = this

        this.monitor_xhr.reqData = args[0]
        const eTime = getTimestamp()
        this.monitor_xhr.time = this.monitor_xhr.sTime
        this.monitor_xhr.status = status

        if (['', 'json', 'text'].indexOf(responseType) !== -1) {
          this.monitor_xhr.responseText =
            typeof response === 'object' ? JSON.stringify(response) : response
        }
        this.monitor_xhr.elapsedTime = eTime - this.monitor_xhr.sTime
        triggerHandlers(EventTypes.XHR, this.monitor_xhr)
      })

      originalSend.apply(this, args)
    }
  })
}

function listenError(): void {
  on(
    _global,
    'error',
    function (e: ErrorEvent) {
      triggerHandlers(EventTypes.ERROR, e)
    },
    true
  )
}

function consoleReplace(): void {
  if (!('console' in _global)) {
    return
  }
  const logType = ['log', 'debug', 'info', 'warn', 'error', 'assert']
  logType.forEach(function (level: string): void {
    if (!(level in _global.console)) return
    replaceOld(
      _global.console,
      level,
      function (originalConsole: () => any): Function {
        return function (...args: any[]): void {
          if (originalConsole) {
            triggerHandlers(EventTypes.CONSOLE, { args, level })
            originalConsole.apply(_global.console, args)
          }
        }
      }
    )
  })
}

function unhandledrejectionReplace(): void {
  on(
    _global,
    EventTypes.UNHANDLEDREJECTION,
    function (ev: PromiseRejectionEvent) {
      // ev.preventDefault() 阻止默认行为后，控制台就不会再报红色错误
      triggerHandlers(EventTypes.UNHANDLEDREJECTION, ev)
    }
  )
}

function domReplace(): void {
  if (!('document' in _global)) return
  const clickThrottle = throttle(triggerHandlers, options.throttleDelayTime)
  on(
    _global.document,
    'click',
    function () {
      clickThrottle(EventTypes.DOM, {
        category: 'click',
        data: this,
      })
    },
    true
  )
}

let lastHref: string
lastHref = getLocationHref()

function historyReplace(): void {
  if (!supportsHistory()) return
  const oldOnpopstate = _global.onpopstate
  _global.onpopstate = function (
    this: WindowEventHandlers,
    ...args: any[]
  ): any {
    const to = getLocationHref()
    const from = lastHref
    lastHref = to
    triggerHandlers(EventTypes.HISTORY, {
      from,
      to,
    })
    oldOnpopstate && oldOnpopstate.apply(this, args)
  }

  function historyReplaceFn(originalHistoryFn: voidFun): voidFun {
    return function (this: History, ...args: any[]): void {
      const url = args.length > 2 ? args[2] : undefined
      if (url) {
        const from = lastHref
        const to = String(url)
        lastHref = to
        triggerHandlers(EventTypes.HISTORY, {
          from,
          to,
        })
      }
      return originalHistoryFn.apply(this, args)
    }
  }

  replaceOld(_global.history, 'pushState', historyReplaceFn)
  replaceOld(_global.history, 'replaceState', historyReplaceFn)
}

function listenHashchange(): void {
  if (!isExistProperty(_global, 'onpopstate')) {
    on(_global, EventTypes.HASHCHANGE, function (e: HashChangeEvent) {
      //   triggerHandlers(EventTypes.HASHCHANGE, e)
    })
  }
}
