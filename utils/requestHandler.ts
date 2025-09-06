import { APIRequestContext } from "@playwright/test"
import { expect } from '@playwright/test';
import { APILogger } from "./logger";
import { test } from "@playwright/test"

export class RequestHandler {
  // 5 basic components
  private baseUrl:string | undefined
  private apiPath: string = ''
  private queryParams: object ={}
  private apiHeaders: Record<string,string> = {}
  private apiBody: object = {}
  private request: APIRequestContext
  private defaultBaseUrl: string
  private apiLogger: APILogger
  private defaultAuthToken: string
  private clearAuthTokenFlag: boolean // drive the Token changes

  constructor(request: APIRequestContext, apiBaseUrl:string, apiLogger: APILogger, authToken: string = '') {
    this.request = request
    this.defaultBaseUrl = apiBaseUrl
    this.apiLogger = apiLogger
    this.defaultAuthToken = authToken
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
    let responseJSON: any
    const url = this.getUrl()
    await test.step(`GET Request to ${url}`, async() => {
      this.apiLogger.requestLog('GET',url, this.getHeaders())
      const response = await this.request.get(url, {
        headers: this.getHeaders()
      })
      this.removeRequestFields()
      const actualStatus = response.status()
      responseJSON = await response.json()
      this.apiLogger.responseLog(actualStatus, responseJSON)
      this.statusCodeValidateLogger(actualStatus, statusCode, this.getRequest)
    })
    return responseJSON
  }

  async postRequest(statusCode: number) {
    let responseJSON: any
    const url = this.getUrl()
    await test.step(`POST Request to ${url}`, async() => {
      this.apiLogger.requestLog('POST',url, this.getHeaders(),this.apiBody)
      const response = await this.request.post(url, {
        headers: this.getHeaders(),
        data: this.apiBody
      })
      this.removeRequestFields()
      const actualStatus = response.status()
      responseJSON = await response.json()
      this.apiLogger.responseLog(actualStatus, responseJSON)
      this.statusCodeValidateLogger(actualStatus, statusCode, this.postRequest)
    })
    return responseJSON
  }

  async putRequest(statusCode: number) {
    let responseJSON: any
    const url = this.getUrl()
    await test.step(`PUT Request to ${url}`, async() => {
      this.apiLogger.requestLog('PUT',url, this.getHeaders(), this.apiBody)
      const response = await this.request.put(url, {
        headers: this.getHeaders(),
        data: this.apiBody
      })
      this.removeRequestFields()
      const actualStatus = response.status()
      responseJSON = await response.json()
      this.apiLogger.responseLog(actualStatus, responseJSON)
      this.statusCodeValidateLogger(actualStatus, statusCode, this.putRequest)
    })
    return responseJSON
  }

  async deleteRequest(statusCode: number) {
    let responseJSON: any
    const url = this.getUrl()
    await test.step(`PUT Request to ${url}`, async() => {
      this.apiLogger.requestLog('DELETE',url, this.getHeaders())
      const response = await this.request.delete(url, {
        headers: this.getHeaders()
      })
      this.removeRequestFields()
      const actualStatus = response.status()
      this.apiLogger.responseLog(actualStatus)
      this.statusCodeValidateLogger(actualStatus, statusCode, this.deleteRequest)
    })
  }

  clearAuth() {
    this.clearAuthTokenFlag = true 
    return this
  }

  private getHeaders() {
    if (!this.clearAuthTokenFlag) {
      this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthToken
    }
    return this.apiHeaders
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

  private removeRequestFields() {
    this.baseUrl = undefined
    this.apiPath = ''
    this.queryParams = {}
    this.apiHeaders = {}
    this.apiBody = {}
    this.clearAuthTokenFlag = false
  }
}