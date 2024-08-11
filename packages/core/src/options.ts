import {
  generateUUID,
  _support,
  validateOption,
  toStringValidateOption,
  logger,
  setSilentFlag,
} from 'monitor-utils'
import { transportData } from './transportData'

export class Options {
  beforeAppAjaxSend: Function = () => {}
  enableTraceId: Boolean
  filterXhrUrlRegExp: RegExp
  includeHttpUrlTraceIdRegExp: RegExp
  traceIdFieldName = 'Trace-Id'
  throttleDelayTime = 0
  maxDuplicateCount = 2
  onRouteChange?: Function

  constructor() {
    this.enableTraceId = false
  }
  bindOptions(options: any = {}): void {
    const {
      beforeAppAjaxSend,
      enableTraceId,
      filterXhrUrlRegExp,
      traceIdFieldName,
      throttleDelayTime,
      includeHttpUrlTraceIdRegExp,
      maxDuplicateCount,
      onRouteChange,
    } = options
    validateOption(beforeAppAjaxSend, 'beforeAppAjaxSend', 'function') &&
      (this.beforeAppAjaxSend = beforeAppAjaxSend)

    // browser hooks
    if (validateOption(onRouteChange, 'onRouteChange', 'function')) {
      this.onRouteChange = onRouteChange
    }

    if (validateOption(enableTraceId, 'enableTraceId', 'boolean')) {
      this.enableTraceId = enableTraceId
    }

    if (validateOption(traceIdFieldName, 'traceIdFieldName', 'string')) {
      this.traceIdFieldName = traceIdFieldName
    }

    if (validateOption(throttleDelayTime, 'throttleDelayTime', 'number')) {
      this.throttleDelayTime = throttleDelayTime
    }
    if (validateOption(maxDuplicateCount, 'maxDuplicateCount', 'number')) {
      this.maxDuplicateCount = maxDuplicateCount
    }

    if (
      toStringValidateOption(
        filterXhrUrlRegExp,
        'filterXhrUrlRegExp',
        '[object RegExp]'
      )
    ) {
      this.filterXhrUrlRegExp = filterXhrUrlRegExp
    }

    if (
      toStringValidateOption(
        includeHttpUrlTraceIdRegExp,
        'includeHttpUrlTraceIdRegExp',
        '[object RegExp]'
      )
    ) {
      this.includeHttpUrlTraceIdRegExp = includeHttpUrlTraceIdRegExp
    }
  }
}

const options = _support.options || (_support.options = new Options())
export function setTraceId(
  httpUrl: string,
  callback: (headerFieldName: string, traceId: string) => void
) {
  const { includeHttpUrlTraceIdRegExp, enableTraceId } = options
  if (
    enableTraceId &&
    includeHttpUrlTraceIdRegExp &&
    includeHttpUrlTraceIdRegExp.test(httpUrl)
  ) {
    const traceId = generateUUID()
    callback(options.traceIdFieldName, traceId)
  }
}

export function initOptions(paramOptions = {}) {
  setSilentFlag(paramOptions)
  // breadcrumb.bindOptions(paramOptions);
  logger.bindOptions(paramOptions.debug)
  transportData.bindOptions(paramOptions)
  options.bindOptions(paramOptions)
}

export { options }
