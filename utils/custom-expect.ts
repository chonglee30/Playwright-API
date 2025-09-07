import { expect as baseExpect} from '@playwright/test'
import { APILogger } from "./logger";
import { validateSchema } from './schemaValidator'

let apiLogger: APILogger

export const setCustomExpectLogger = (logger: APILogger) => {
  apiLogger = logger  
} 

// shouldMatchSchema Note: return type is Promise<R> instead of <R>
// Reason: shouldMatchSchema is asynchronous function
//               |---> validateSchema is asynchronous function
declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      shouldMatchSchema(dirName: string, fileName: string, createSchemaFlag?:boolean): Promise<R>
    }
  }
}

export const expect = baseExpect.extend({
  async shouldMatchSchema(received: any, dirName: string, fileName: string, createSchemaFlag:boolean = true) {
    let pass: boolean;
    let message: string =''

    try {
      await validateSchema(dirName, fileName, received, createSchemaFlag)
      pass = true;
      message = 'Schema validation passed'
    } catch (e: any) {
      pass = false;
      const logs = apiLogger.getCurrentLog() 
      message = `${e.message}\n\nRecent API Activity: \n${logs}`
    }

    return {
      message: () => message,
      pass
    };
  }
})