import {
  BreadCrumbTypes,
  ErrorTypes,
  ERROR_TYPE_RE,
  HttpCodes,
} from 'monitor-shared'

import { httpTransform, resourceTransform, transportData } from 'monitor-core'

import {
  extractErrorStack,
  getLocationHref,
  getTimestamp,
  isError,
  parseUrlToObj,
  Severity,
} from 'monitor-utils'

import {
  Replace,
  MonitorHttp,
  ResourceErrorTarget,
  ReportDataType,
} from 'monitor-types'

const HandleEvents = {
  /**
   * 处理xhr、fetch回调
   */

  handleHttp(data: MonitorHttp, type: BreadCrumbTypes): void {
    const isError =
      data.status === 0 ||
      data.status === HttpCodes.BAD_REQUEST ||
      data.status > HttpCodes.UNAUTHORIZED

    const result = httpTransform(data)

    if (isError) {
      transportData.send(result)
    }
  },

  /**
   * 处理window的error的监听回调
   */
  handleError(errorEvent: ErrorEvent) {
    const target = errorEvent.target as ResourceErrorTarget
    // console.log('🚀 ~ handleError ~ data:', target)
    if (target.localName) {
      // 资源加载错误 提取有用数据
      const data = resourceTransform(errorEvent.target as ResourceErrorTarget)
      return transportData.send(data)
    }

    // code error
    const { message, filename, lineno, colno, error } = errorEvent
    let result: ReportDataType
    if (error && isError(error)) {
      result = extractErrorStack(error, Severity.Normal)
    }
    // 处理SyntaxError，stack没有lineno、colno
    result ||
      (result = HandleEvents.handleNotErrorInstance(
        message,
        filename,
        lineno,
        colno
      ))

    result.type = ErrorTypes.JAVASCRIPT_ERROR

    transportData.send(result)
  },

  handleNotErrorInstance(
    message: string,
    filename: string,
    lineno: number,
    colno: number
  ) {
    let name: string | ErrorTypes = ErrorTypes.UNKNOWN
    const url = filename || getLocationHref()
    let msg = message
    const matches = message.match(ERROR_TYPE_RE)
    if (matches[1]) {
      name = matches[1]
      msg = matches[2]
    }
    const element = {
      url,
      func: ErrorTypes.UNKNOWN_FUNCTION,
      args: ErrorTypes.UNKNOWN,
      line: lineno,
      col: colno,
    }
    return {
      url,
      name,
      message: msg,
      level: Severity.Normal,
      time: getTimestamp(),
      stack: [element],
    }
  },

  handleHistory(data: Replace.IRouter): void {
    const { from, to } = data
    const { relative: parsedFrom } = parseUrlToObj(from)
    const { relative: parsedTo } = parseUrlToObj(to)
  },

  handleHashchange(data: HashChangeEvent): void {},

  handleUnhandleRejection(ev: PromiseRejectionEvent): void {},
}

export { HandleEvents }
