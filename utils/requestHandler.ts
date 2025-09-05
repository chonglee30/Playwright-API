import { APIRequestContext } from "@playwright/test"
import { expect } from '@playwright/test';
import { APILogger } from "./logger";

export class RequestHandler {
  // 5 basic components
  private baseUrl:string 
  private apiPath: string = ''
  private queryParams: object ={}
  private apiHeaders: Record<string,string> = {}
  private apiBody: object = {}
  private request: APIRequestContext
  private defaultBaseUrl: string
  private apiLogger: APILogger

  constructor(request: APIRequestContext, apiBaseUrl:string, apiLogger: APILogger) {
    this.request = request
    this.defaultBaseUrl = apiBaseUrl
    this.apiLogger = apiLogger
  }

  url(url: string) {
    this.baseUrl = url
    return this
  }

  path(path: string) {
    this.apiPath = path 
    return this
  }

  params(params: object) {
    this.queryParams = params
    return this
  }

  headers(headers: Record<string,string>) {
    this.apiHeaders = headers
    return this
  }

  body(body: object) {
    this.apiBody = body
    return this
  }

  async getRequest(statusCode: number) {
    const url = this.getUrl()
    this.apiLogger.requestLog('GET',url, this.apiHeaders)
    const response = await this.request.get(url, {
      headers: this.apiHeaders
    })

    const actualStatus = response.status()
    const responseJSON = await response.json()
    this.apiLogger.responseLog(actualStatus, responseJSON)
    this.statusCodeValidateLogger(actualStatus, statusCode, this.getRequest)
    return responseJSON
  }

  async postRequest(statusCode: number) {
    const url = this.getUrl()
    this.apiLogger.requestLog('POST',url, this.apiHeaders,this.apiBody)
    const response = await this.request.post(url, {
      headers: this.apiHeaders,
      data: this.apiBody
    })

    const actualStatus = response.status()
    const responseJSON = await response.json()
    this.apiLogger.responseLog(actualStatus, responseJSON)
    this.statusCodeValidateLogger(actualStatus, statusCode, this.postRequest)
    return responseJSON
  }

  async putRequest(statusCode: number) {
    const url = this.getUrl()
    this.apiLogger.requestLog('PUT',url, this.apiHeaders,this.apiBody)
    const response = await this.request.put(url, {
      headers: this.apiHeaders,
      data: this.apiBody
    })

    const actualStatus = response.status()
    const responseJSON = await response.json()
    this.apiLogger.responseLog(actualStatus, responseJSON)
    this.statusCodeValidateLogger(actualStatus, statusCode, this.putRequest)
    return responseJSON
  }

  async deleteRequest(statusCode: number) {
    const url = this.getUrl()
    this.apiLogger.requestLog('DELETE',url, this.apiHeaders)
    const response = await this.request.delete(url, {
      headers: this.apiHeaders
    })

    const actualStatus = response.status()
    this.apiLogger.responseLog(actualStatus)
    this.statusCodeValidateLogger(actualStatus, statusCode, this.deleteRequest)
  }

  private getUrl() {
    const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
    for (const [key,value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key,value)
    }
    return url.toString()
  }

  private statusCodeValidateLogger(actualStatusCode: number, expectStatusCode: number, currentMethod: Function) {
    if (actualStatusCode !==expectStatusCode) {
      const logs = this.apiLogger.getCurrentLog()
      const error = new Error(`Expected Status: ${expectStatusCode} but received ${actualStatusCode} \n API Logs:\n${logs}`)
      Error.captureStackTrace(error, currentMethod)
      throw error
    }

    // improvement: test result fail
  }

}