import {test as base } from '@playwright/test'
import { RequestHandler } from './requestHandler'
import { APILogger } from './logger'
import {config} from '../env.config'
import { createAuthToken } from '../helpers/createAuthToken'

export type TestOptions = {
  api: RequestHandler
  config: typeof config
}

export type WorkerFixture = {
  authToken: string
}

export const test = base.extend<TestOptions, WorkerFixture>({
  authToken: [async ({}, use) => {
    const authToken = await createAuthToken(config.userEmail, config.userPassword)
    await use(authToken)   // use(authToken) as return result
  }, {scope: 'worker'}],
  
  api: async({request, authToken}, use) => {
    const baseUrl = 'https://conduit-api.bondaracademy.com/api'
    const apiLogger = new APILogger()
    const requestHandler = new RequestHandler(request,config.apiUrl,apiLogger, authToken)
    await use(requestHandler)
  },
  config: async({}, use) => {
      await use(config)
  }
})