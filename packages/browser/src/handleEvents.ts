const HandleEvents = {
  /**
   * 处理xhr、fetch回调
   */

  handleHttp(): void {},

  /**
   * 处理window的error的监听回调
   */
  handleError(errorEvent: ErrorEvent) {
    const target = errorEvent.target
  },

  handleNotErrorInstance() {},

  handleHistory(): void {},

  handleHashchange(): void {},

  handleUnhandleRejection(): void {},
}

export { HandleEvents }
