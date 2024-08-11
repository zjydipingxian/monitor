import { EventTypes } from 'monitor-shared'

import { variableTypeDetection } from './is'
import { Logger } from './logger'
import { DeviceInfo } from 'monitor-types'
import { TransportData } from 'monitor-core'

// Monitor的全局变量
export interface MonitorSupport {
  logger: Logger
  //   breadcrumb: Breadcrumb
  transportData: TransportData
  replaceFlag: { [key in EventTypes]?: boolean }
  record?: any[]
  deviceInfo?: DeviceInfo
  options?: { [key: string]: any }
  track?: any
}

interface MonitorGlobal {
  console?: Console
  __Monitor__?: MonitorSupport
}

// 检查当前执行环境是否为Node.js环境。
export const isNodeEnv = variableTypeDetection.isProcess(
  typeof process !== 'undefined' ? process : 0
)

// 检查当前环境是否为浏览器环境。
export const isBrowserEnv = variableTypeDetection.isWindow(
  typeof window !== 'undefined' ? window : 0
)

/**
 * 获取全局变量
 *
 * ../returns Global scope object
 */
export function getGlobal<T>() {
  if (isBrowserEnv) return window as unknown as MonitorGlobal & T
  if (isNodeEnv) return process as unknown as MonitorGlobal & T
}

const _global = getGlobal<Window>()
const _support = getGlobalMonitorSupport()
export { _global, _support }

_support.replaceFlag = _support.replaceFlag || {}
const replaceFlag = _support.replaceFlag
export function getFlag(replaceType: EventTypes): boolean {
  return replaceFlag[replaceType] ? true : false
}
export function setFlag(replaceType: EventTypes, isSet: boolean): void {
  if (replaceFlag[replaceType]) return
  replaceFlag[replaceType] = isSet
}

export function getGlobalMonitorSupport(): MonitorSupport {
  _global.__Monitor__ = _global.__Monitor__ || ({} as MonitorSupport)
  return _global.__Monitor__
}

// 判断浏览器是否支持HTML5历史记录API（history.pushState 和 history.replaceState）
export function supportsHistory(): boolean {
  // NOTE: in Chrome App environment, touching history.pushState, *even inside
  //       a try/catch block*, will cause Chrome to output an error to console.error
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  const chrome = (_global as any).chrome
  // tslint:disable-next-line:no-unsafe-any
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime
  const hasHistoryApi =
    'history' in _global &&
    !!_global.history.pushState &&
    !!_global.history.replaceState

  return !isChromePackagedApp && hasHistoryApi
}
