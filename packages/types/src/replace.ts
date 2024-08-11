/**
 * Replace命名空间包含了与替换相关的操作和配置接口
 */
export namespace Replace {
  /**
   * TriggerConsole接口定义了触发控制台日志的配置
   */
  export interface TriggerConsole {
    args: any[] // 触发控制台输出的参数列表
    level: string // 控制台输出的日志级别，例如log、warn、error等
  }

  /**
   * IRouter接口定义了路由替换的配置
   */
  export interface IRouter {
    from: string // 路由的来源路径
    to: string // 路由的目标路径
  }
}
