import { APILogger } from "../utils/logger"
import { config } from "../env.config"
import {request} from "@playwright/test"
import { RequestHandler } from "../utils/requestHandler"


export async function createAuthToken(email: string, password: string) {
  const context = await request.newContext()
  const apiLogger = new APILogger()
  const api = new RequestHandler(context, config.apiUrl, apiLogger)
  
  try {
    const response = await api.path('/users/login')
                      .body({"user":{"email": email, "password": password}})
                      .postRequest(200)
    return `Token `+response.user.token
  } catch (error) {
     Error.captureStackTrace(error, createAuthToken)
      throw error
   } finally {
      await context.dispose()
   }
  
}

