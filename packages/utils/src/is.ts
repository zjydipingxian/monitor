export const nativeToString = Object.prototype.toString

function isType(type: string) {
  return function (value: any) {
    return nativeToString.call(value) === `[object ${type}]`
  }
}

/**
 * 检测变量类型
 * @param type
 */
export const variableTypeDetection = {
  isNumber: isType('Number'),
  isString: isType('String'),
  isBoolean: isType('Boolean'),
  isNull: isType('Null'),
  isUndefined: isType('Undefined'),
  isSymbol: isType('Symbol'),
  isFunction: isType('Function'),
  isObject: isType('Object'),
  isArray: isType('Array'),
  isProcess: isType('process'),
  isWindow: isType('Window'),
}

export function isError(wat: any): boolean {
  switch (nativeToString.call(wat)) {
    // 判断对象类型是否为标准Error对象
    case '[object Error]':
      return true
    //   判断对象类型是否为Exception对象，这在某些环境下可能适用
    case '[object Exception]':
      return true
    //   判断对象类型是否为DOMException对象，用于Web API中的错误处理
    case '[object DOMException]':
      return true
    default:
      return isInstanceOf(wat, Error)
  }
}

// 判断一个对象是否为空。
export function isEmptyObject(obj: Object): boolean {
  return variableTypeDetection.isObject(obj) && Object.keys(obj).length === 0
}

/**
 * 判断给定的值是否为空。
 *
 * 为空的定义包括：
 * 1. 字符串类型且经过trim处理后为空字符串。
 * 2. 值为undefined。
 * 3. 值为null。
 *
 * @param wat 待检查的值，可以是任何类型。
 * @returns 如果给定的值为空，则返回true；否则返回false。
 */
export function isEmpty(wat: any): boolean {
  return (
    (variableTypeDetection.isString(wat) && wat.trim() === '') ||
    wat === undefined ||
    wat === null
  )
}
/**
 * 检查一个对象是否是另一个对象的实例。
 *
 * @param wat 待检查的对象
 * @param base 作为实例基准的类或构造函数
 * @returns 如果`wat`是`base`的实例，则返回true；否则返回false。
 */
export function isInstanceOf(wat: any, base: any): boolean {
  try {
    return wat instanceof base
  } catch (_e) {
    return false
  }
}

export function isExistProperty(
  obj: Object,
  key: string | number | symbol
): boolean {
  return obj.hasOwnProperty(key)
}
