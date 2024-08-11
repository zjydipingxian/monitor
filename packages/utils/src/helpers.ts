import { IAnyObject } from 'monitor-types'
import { nativeToString, variableTypeDetection } from './is'
import { logger } from './logger'

type TotalEventName =
  | keyof GlobalEventHandlersEventMap
  | keyof XMLHttpRequestEventTargetEventMap
  | keyof WindowEventMap
export function on(
  target: { addEventListener: Function },
  eventName: TotalEventName,
  handler: Function,
  options: boolean | unknown = false
): void {
  target.addEventListener(eventName, handler, options)
}

/**
 * 获取当前的时间戳
 * ../returns 返回当前时间戳
 */
export function getTimestamp(): number {
  return Date.now()
}

/**
 *
 * 重写对象上面的某个属性
 * ../param source 需要被重写的对象
 * ../param name 需要被重写对象的key
 * ../param replacement 以原有的函数作为参数，执行并重写原有函数
 * ../param isForced 是否强制重写（可能原先没有该属性）
 * ../returns void
 */
export function replaceOld(
  source: IAnyObject,
  name: string,
  replacement: (...args: any[]) => any,
  isForced = false
): void {
  if (source === undefined) return
  if (name in source || isForced) {
    const original = source[name]
    const wrapped = replacement(original)
    if (typeof wrapped === 'function') {
      source[name] = wrapped
    }
  }
}

/**
 * 用&分割对象，返回a=1&b=2
 * ../param obj 需要拼接的对象
 */
export function splitObjToQuery(obj: Record<string, unknown>): string {
  return Object.entries(obj).reduce((result, [key, value], index) => {
    if (index !== 0) {
      result += '&'
    }
    const valueStr =
      variableTypeDetection.isObject(value) ||
      variableTypeDetection.isArray(value)
        ? JSON.stringify(value)
        : value
    result += `${key}=${valueStr}`
    return result
  }, '')
}

export function generateUUID(): string {
  let d = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  return uuid
}

export function typeofAny(target: any, type: string): boolean {
  return typeof target === type
}

export function toStringAny(target: any, type: string): boolean {
  return nativeToString.call(target) === type
}

// 函数节流
/**
 *
 * ../param fn 需要节流的函数
 * ../param delay 节流的时间间隔
 * ../returns 返回一个包含节流功能的函数
 */
export const throttle = (fn: Function, delay: number): Function => {
  let canRun = true
  return function (...args: any) {
    if (!canRun) return
    fn.apply(this, args)
    canRun = false
    setTimeout(() => {
      canRun = true
    }, delay)
  }
}

export function validateOption(
  target: any,
  targetName: string,
  expectType: string
): boolean {
  if (typeofAny(target, expectType)) return true
  typeof target !== 'undefined' &&
    logger.error(
      `${targetName}期望传入${expectType}类型，目前是${typeof target}类型`
    )
  return false
}

export function toStringValidateOption(
  target: any,
  targetName: string,
  expectType: string
): boolean {
  if (toStringAny(target, expectType)) return true
  typeof target !== 'undefined' &&
    logger.error(
      `${targetName}期望传入${expectType}类型，目前是${nativeToString.call(
        target
      )}类型`
    )
  return false
}

export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return ''
  return document.location.href
}

/**
 * 需要获取函数名，匿名则返回<anonymous>
 * ../param {unknown} fn 需要获取函数名的函数本体
 * ../returns 返回传入的函数的函数名
 */
export const defaultFunctionName = '<anonymous>'
export function getFunctionName(fn: unknown): string {
  if (!fn || typeof fn !== 'function') {
    return defaultFunctionName
  }
  return fn.name || defaultFunctionName
}

export function interceptStr(str: string, interceptLength: number): string {
  if (variableTypeDetection.isString(str)) {
    return (
      str.slice(0, interceptLength) +
      (str.length > interceptLength ? `:截取前${interceptLength}个字符` : '')
    )
  }
  return ''
}

export function unknownToString(target: unknown): string {
  if (variableTypeDetection.isString(target)) {
    return target as string
  }
  if (variableTypeDetection.isUndefined(target)) {
    return 'undefined'
  }
  return JSON.stringify(target)
}
