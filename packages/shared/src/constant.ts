export type voidFun = () => void

/**
 * 上报错误类型
 */
export enum ErrorTypes {
  UNKNOWN = 'UNKNOWN', // 未知错误
  UNKNOWN_FUNCTION = 'UNKNOWN_FUNCTION', // 未知函数调用错误
  JAVASCRIPT_ERROR = 'JAVASCRIPT_ERROR', // JavaScript运行时错误
  LOG_ERROR = 'LOG_ERROR', // 日志记录错误
  FETCH_ERROR = 'HTTP_ERROR', // HTTP请求错误
  VUE_ERROR = 'VUE_ERROR', // Vue框架相关错误
  RESOURCE_ERROR = 'RESOURCE_ERROR', // 资源加载错误
  PROMISE_ERROR = 'PROMISE_ERROR', // Promise异步操作错误
  ROUTE_ERROR = 'ROUTE_ERROR', // 路由导航错误
}

/**
 * 用户行为栈事件类型
 */
export enum BreadCrumbTypes {
  ROUTE = 'Route', // 导航相关的面包屑类型
  CLICK = 'Click',
  CONSOLE = 'Console', // 控制台日志
  XHR = 'Xhr', // XHR请求
  FETCH = 'Fetch', // FETCH请求
  UNHANDLEDREJECTION = 'Unhandledrejection', // 未处理的拒绝事件
  VUE = 'Vue', // Vue框架相关事件
  RESOURCE = 'Resource', // 资源加载事件
  CODE_ERROR = 'Code Error', // 代码错误
  CUSTOMER = 'Customer', // 自定义事件

  // 应用生命周期事件
  APP_ON_SHOW = 'App On Show',
  APP_ON_LAUNCH = 'App On Launch',
  APP_ON_HIDE = 'App On Hide',

  // 页面生命周期事件
  PAGE_ON_SHOW = 'Page On Show',
  PAGE_ON_HIDE = 'Page On Hide',
  PAGE_ON_UNLOAD = 'Page On Unload',
  PAGE_ON_SHARE_APP_MESSAGE = 'Page On Share App Message',
  PAGE_ON_SHARE_TIMELINE = 'Page On Share Timeline',
  PAGE_ON_TAB_ITEM_TAP = 'Page On Tab Item Tap',

  // 触控事件
  TAP = 'Tap',
  TOUCHMOVE = 'Touchmove',
}

/**
 * 用户行为整合类型
 */
export enum BreadCrumbCategory {
  HTTP = 'http',
  USER = 'user',
  DEBUG = 'debug',
  EXCEPTION = 'exception',
  LIFECYCLE = 'lifecycle',
}

/**
 * 重写的事件类型
 */
export enum EventTypes {
  XHR = 'xhr',
  FETCH = 'fetch',
  CONSOLE = 'console',
  DOM = 'dom',
  HISTORY = 'history',
  ERROR = 'error',
  HASHCHANGE = 'hashchange',
  UNHANDLEDREJECTION = 'unhandledrejection',
  MONITOR = 'monitor',
  VUE = 'Vue',
  MINI_ROUTE = 'miniRoute',
  MINI_PERFORMANCE = 'miniPerformance',
  MINI_MEMORY_WARNING = 'miniMemoryWarning',
  MINI_NETWORK_STATUS_CHANGE = 'miniNetworkStatusChange',
  MINI_BATTERY_INFO = 'miniBatteryInfo',
}

export enum HttpTypes {
  XHR = 'xhr',
  FETCH = 'fetch',
}

export enum HttpCodes {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_EXCEPTION = 500,
}

export const ERROR_TYPE_RE =
  /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/

const globalVar = {
  isLogAddBreadcrumb: true,
  crossOriginThreshold: 1000,
}
export { globalVar }
