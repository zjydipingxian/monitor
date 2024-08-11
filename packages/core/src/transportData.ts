import {
  _support,
  validateOption,
  logger,
  isBrowserEnv,
  variableTypeDetection,
  Queue,
  isEmpty,
} from 'monitor-utils'
import { SDK_NAME, SDK_VERSION } from 'monitor-shared'
import {
  AuthInfo,
  TransportDataType,
  EMethods,
  InitOptions,
  isReportDataType,
  DeviceInfo,
  FinalReportType,
} from 'monitor-types'
import { createErrorId } from './errorId'

export class TransportData {
  queue: Queue
  beforeDataReport: unknown = null
  backTrackerId: unknown = null
  configReportXhr: unknown = null
  configReportUrl: unknown = null
  useImgUpload = false
  apikey = ''
  trackKey = ''
  errorDsn = ''
  trackDsn = ''
  constructor() {
    this.queue = new Queue()
  }
  imgRequest(data: any, url: string): void {
    const requestFun = () => {
      let img = new Image()
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&'
      img.src = `${url}${spliceStr}data=${encodeURIComponent(
        JSON.stringify(data)
      )}`
      img = null
    }
    this.queue.addFn(requestFun)
  }

  getRecord(): any[] {
    const recordData = _support.record
    if (
      recordData &&
      variableTypeDetection.isArray(recordData) &&
      recordData.length > 2
    ) {
      return recordData
    }
    return []
  }

  getDeviceInfo(): DeviceInfo | any {
    return _support.deviceInfo || {}
  }

  async beforePost(data: FinalReportType) {
    if (isReportDataType(data)) {
      const errorId = createErrorId(data, this.apikey)
      if (!errorId) return false
      data.errorId = errorId
    }
    let transportData = this.getTransportData(data)
    if (typeof this.beforeDataReport === 'function') {
      transportData = await this.beforeDataReport(transportData)
      if (!transportData) return false
    }

    return transportData
  }

  async xhrPost(data: any, url: string) {
    const requestFun = (): void => {
      const xhr = new XMLHttpRequest()
      xhr.open(EMethods.Post, url)
      xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
      xhr.withCredentials = true
      if (typeof this.configReportXhr === 'function') {
        this.configReportXhr(xhr, data)
      }
      xhr.send(JSON.stringify(data))
    }
    this.queue.addFn(requestFun)
  }

  getAuthInfo(): AuthInfo {
    const trackerId = this.getTrackerId()
    const result: AuthInfo = {
      trackerId: String(trackerId),
      sdkVersion: SDK_VERSION,
      sdkName: SDK_NAME,
    }
    this.apikey && (result.apikey = this.apikey)
    this.trackKey && (result.trackKey = this.trackKey)
    return result
  }

  getApikey() {
    return this.apikey
  }

  getTrackKey() {
    return this.trackKey
  }

  getTrackerId(): string | number {
    if (typeof this.backTrackerId === 'function') {
      const trackerId = this.backTrackerId()
      if (typeof trackerId === 'string' || typeof trackerId === 'number') {
        return trackerId
      } else {
        logger.error(
          `trackerId:${trackerId} 期望 string 或 number 类型，但是传入类型为 ${typeof trackerId}`
        )
      }
    }
    return ''
  }

  getTransportData(data: FinalReportType): TransportDataType {
    return {
      authInfo: this.getAuthInfo(),
      //   breadcrumb: breadcrumb.getStack(),
      data,
      record: this.getRecord(),
      deviceInfo: this.getDeviceInfo(),
    }
  }

  isSdkTransportUrl(targetUrl: string): boolean {
    let isSdkDsn = false
    if (this.errorDsn && targetUrl.indexOf(this.errorDsn) !== -1) {
      isSdkDsn = true
    }
    if (this.trackDsn && targetUrl.indexOf(this.trackDsn) !== -1) {
      isSdkDsn = true
    }
    return isSdkDsn
  }

  bindOptions(options: InitOptions = {}): void {
    const {
      dsn,
      beforeDataReport,
      apikey,
      configReportXhr,
      backTrackerId,
      trackDsn,
      trackKey,
      configReportUrl,
      useImgUpload,
    } = options
    console.log('🚀 ~ TransportData ~ bindOptions ~ options:', options)

    // 验证并设置配置项
    if (validateOption(apikey, 'apikey', 'string')) {
      // 验证 apikey 是否为字符串
      this.apikey = apikey // 设置 apikey
    }
    if (validateOption(trackKey, 'trackKey', 'string')) {
      // 验证 trackKey 是否为字符串
      this.trackKey = trackKey // 设置 trackKey
    }
    if (validateOption(dsn, 'dsn', 'string')) {
      // 验证 dsn 是否为字符串
      this.errorDsn = dsn // 设置 errorDsn
    }
    if (validateOption(trackDsn, 'trackDsn', 'string')) {
      // 验证 trackDsn 是否为字符串
      this.trackDsn = trackDsn // 设置 trackDsn
    }
    if (validateOption(useImgUpload, 'useImgUpload', 'boolean')) {
      // 验证 useImgUpload 是否为布尔值
      this.useImgUpload = useImgUpload // 设置 useImgUpload
    }
    if (validateOption(beforeDataReport, 'beforeDataReport', 'function')) {
      // 验证 beforeDataReport 是否为函数
      this.beforeDataReport = beforeDataReport // 设置 beforeDataReport
    }
    if (validateOption(configReportXhr, 'configReportXhr', 'function')) {
      // 验证 configReportXhr 是否为函数
      this.configReportXhr = configReportXhr // 设置 configReportXhr
    }
    if (validateOption(backTrackerId, 'backTrackerId', 'function')) {
      // 验证 backTrackerId 是否为函数
      this.backTrackerId = backTrackerId // 设置 backTrackerId
    }
    if (validateOption(configReportUrl, 'configReportUrl', 'function')) {
      // 验证 configReportUrl 是否为函数
      this.configReportUrl = configReportUrl // 设置 configReportUrl
    }
  }

  /**
   * 监控错误上报的请求函数
   * @param data 错误上报数据格式
   * @returns
   */
  async send(data: FinalReportType) {
    let dsn = ''
    if (isReportDataType(data)) {
      dsn = this.errorDsn
      if (isEmpty(dsn)) {
        logger.error('dsn为空，没有传入监控错误上报的dsn地址，请在init中传入')
        return
      }
    } else {
      dsn = this.trackDsn
      if (isEmpty(dsn)) {
        logger.error('trackDsn为空，没有传入埋点上报的dsn地址，请在init中传入')
        return
      }
    }
    const result = await this.beforePost(data)
    if (!result) return
    if (typeof this.configReportUrl === 'function') {
      dsn = this.configReportUrl(result, dsn)
      if (!dsn) return
    }

    if (isBrowserEnv) {
      return this.useImgUpload
        ? this.imgRequest(result, dsn)
        : this.xhrPost(result, dsn)
    }
  }
}

const transportData =
  _support.transportData || (_support.transportData = new TransportData())

export { transportData }
