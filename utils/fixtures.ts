import {test as base } from '@playwright/test'
import { RequestHandler } from './requestHandler'
import { APILogger } from './logger'
import {config} from '../env.config'

export type TestOptions = {
  api: RequestHandler
  config: typeof config
}

export const test = base.extend<TestOptions>({
  api: async({request}, use) => {
    const baseUrl = 'https://conduit-api.bondaracademy.com/api'
    const apiLogger = new APILogger()
    const requestHandler = new RequestHandler(request,config.apiUrl,apiLogger)
    await use(requestHandler)
  },
  config: async({}, use) => {
      await use(config)
  }
})