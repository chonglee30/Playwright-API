import {test as base } from '@playwright/test'
import { RequestHandler } from './requestHandler'
import { APILogger } from './logger'


export type TestOptions = {
  api: RequestHandler
}

export const test = base.extend<TestOptions>({
  api: async({request}, use) => {
    const baseUrl = 'https://conduit-api.bondaracademy.com/api'
    const apiLogger = new APILogger()
    const requestHandler = new RequestHandler(request,baseUrl,apiLogger)
    await use(requestHandler)
  }
})