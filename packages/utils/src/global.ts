import { variableTypeDetection } from './is'
import { Logger } from './logger'

// Monitor的全局变量
export interface MonitorSupport {
  logger: Logger
  //   breadcrumb: Breadcrumb
  //   transportData: TransportData
  //   replaceFlag: { [key in EventTypes]?: boolean }
  record?: any[]
  //   deviceInfo?: DeviceInfo
  //   options?: Options
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

const _global = getGlobal<Window>() || ({} as unknown as MonitorGlobal)
const _support = getGlobalMonitorSupport()
export { _global, _support }

export function getGlobalMonitorSupport(): MonitorSupport {
  _global.__Monitor__ = _global.__Monitor__ || ({} as MonitorSupport)
  return _global.__Monitor__
}
