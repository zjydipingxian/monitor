import { EventTypes, BreadCrumbTypes } from 'monitor-shared'
import { HandleEvents } from './handleEvents'
import { addReplaceHandler } from './replace'
import { handleConsole } from 'monitor-core'
// import { breadcrumb, handleConsole } from 'monitor-core'

export function setupReplace(): void {
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, BreadCrumbTypes.XHR)
    },
    type: EventTypes.XHR,
  })

  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, BreadCrumbTypes.FETCH)
    },
    type: EventTypes.FETCH,
  })

  addReplaceHandler({
    callback: (error) => {
      HandleEvents.handleError(error)
    },
    type: EventTypes.ERROR,
  })

  addReplaceHandler({
    callback: (data) => {
      handleConsole(data)
    },
    type: EventTypes.CONSOLE,
  })

  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHistory(data)
    },
    type: EventTypes.HISTORY,
  })

  addReplaceHandler({
    callback: (e: HashChangeEvent) => {
      HandleEvents.handleHashchange(e)
    },
    type: EventTypes.HASHCHANGE,
  })

  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleUnhandleRejection(data)
    },
    type: EventTypes.UNHANDLEDREJECTION,
  })

  addReplaceHandler({
    callback: (data) => {
      //   const htmlString = htmlElementAsString(data.data.activeElement as HTMLElement);
      //   if (htmlString) {
      //     breadcrumb.push({
      //       type: BreadCrumbTypes.CLICK,
      //       category: breadcrumb.getCategory(BreadCrumbTypes.CLICK),
      //       data: htmlString,
      //       level: Severity.Info,
      //     });
      //   }
    },
    type: EventTypes.DOM,
  })
}
