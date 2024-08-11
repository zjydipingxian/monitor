// export enum SpanStatus {
//   /** The operation completed successfully. */
//   Ok = 'ok',
//   /** Deadline expired before operation could complete. */
//   DeadlineExceeded = 'deadline_exceeded',
//   /** 401 Unauthorized (actually does mean unauthenticated according to RFC 7235) */
//   Unauthenticated = 'unauthenticated',
//   /** 403 Forbidden */
//   PermissionDenied = 'permission_denied',
//   /** 404 Not Found. Some requested entity (file or directory) was not found. */
//   NotFound = 'not_found',
//   /** 429 Too Many Requests */
//   ResourceExhausted = 'resource_exhausted',
//   /** Client specified an invalid argument. 4xx. */
//   InvalidArgument = 'invalid_argument',
//   /** 501 Not Implemented */
//   Unimplemented = 'unimplemented',
//   /** 503 Service Unavailable */
//   Unavailable = 'unavailable',
//   /** Other/generic 5xx. */
//   InternalError = 'internal_error',
//   /** Unknown. Any non-standard HTTP status code. */
//   UnknownError = 'unknown_error',
//   /** The operation was cancelled (typically by the user). */
//   Cancelled = 'cancelled',
//   /** Already exists (409) */
//   AlreadyExists = 'already_exists',
//   /** Operation was rejected because the system is not in a state required for the operation's */
//   FailedPrecondition = 'failed_precondition',
//   /** The operation was aborted, typically due to a concurrency issue. */
//   Aborted = 'aborted',
//   /** Operation was attempted past the valid range. */
//   OutOfRange = 'out_of_range',
//   /** Unrecoverable data loss or corruption */
//   DataLoss = 'data_loss',
// }

export enum SpanStatus {
  /** 操作成功完成。 */
  Ok = '成功',
  /** 操作在截止时间前未能完成。 */
  DeadlineExceeded = '超时',
  /** 客户端未通过身份验证（HTTP 状态码 401）。 */
  Unauthenticated = '未认证',
  /** 没有权限访问资源（HTTP 状态码 403）。 */
  PermissionDenied = '无权限',
  /** 请求的实体（文件或目录）不存在（HTTP 状态码 404）。 */
  NotFound = '未找到',
  /** 资源耗尽（HTTP 状态码 429）。 */
  ResourceExhausted = '资源耗尽',
  /** 客户端指定了无效的参数（HTTP 状态码 4xx）。 */
  InvalidArgument = '无效参数',
  /** 服务端未实现请求的操作（HTTP 状态码 501）。 */
  Unimplemented = '未实现',
  /** 服务暂时不可用（HTTP 状态码 503）。 */
  Unavailable = '服务不可用',
  /** 其他/通用的 5xx 错误。 */
  InternalError = '内部错误',
  /** 未知错误，通常指非标准 HTTP 状态码。 */
  UnknownError = '未知错误',
  /** 操作被取消（通常是用户发起的）。 */
  Cancelled = '已取消',
  /** 请求的实体已存在（HTTP 状态码 409）。 */
  AlreadyExists = '已存在',
  /** 系统状态不符合执行操作的要求。 */
  FailedPrecondition = '条件失败',
  /** 操作因并发问题而被终止。 */
  Aborted = '已终止',
  /** 操作尝试超出有效范围。 */
  OutOfRange = '超出范围',
  /** 数据丢失或损坏，无法恢复。 */
  DataLoss = '数据丢失',
}

export function fromHttpStatus(httpStatus: number): SpanStatus {
  if (httpStatus < 400) {
    return SpanStatus.Ok
  }

  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return SpanStatus.Unauthenticated
      case 403:
        return SpanStatus.PermissionDenied
      case 404:
        return SpanStatus.NotFound
      case 409:
        return SpanStatus.AlreadyExists
      case 413:
        return SpanStatus.FailedPrecondition
      case 429:
        return SpanStatus.ResourceExhausted
      default:
        return SpanStatus.InvalidArgument
    }
  }

  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return SpanStatus.Unimplemented
      case 503:
        return SpanStatus.Unavailable
      case 504:
        return SpanStatus.DeadlineExceeded
      default:
        return SpanStatus.InternalError
    }
  }

  return SpanStatus.UnknownError
}
