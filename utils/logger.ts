export class APILogger {
  private currentLogs: any[] =[]
  
  // requestBody - Optional for Get, Delete Methods
  requestLog(method: string, url:string, headers: Record<string, string>, requestBody?: any) {
    const currRequestLog = {method, url, headers, requestBody}
    this.currentLogs.push({type: 'Request API Info', data:currRequestLog})
  }

  // responseBody - Optional for Delete Method
  responseLog(statusCode: number, responseBody?: any) {
    const currResponseLog = {statusCode, responseBody}
    this.currentLogs.push({type: 'Response API Info', data: currResponseLog})
  }

  getCurrentLog() {
    const currLogs = this.currentLogs.map(log => {
      return `${log.type}: \n ${JSON.stringify(log.data, null, 2)}`
    }).join('\n\n')
    return currLogs
  }
}