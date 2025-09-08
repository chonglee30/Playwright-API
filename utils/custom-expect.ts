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
      shouldEqual(expected: T): R
      shouldBeLessThanOrEqual(expected: T): R
      shouldBeGreaterThanOrEqual(expected: T): R
      shouldMatchSchema(dirName: string, fileName: string, createSchemaFlag?:boolean): Promise<R>
    }
  }
}

export const expect = baseExpect.extend({
  shouldEqual(received: any, expected: any) {
    let pass: boolean;
    let logs: string =''

    try {
      baseExpect(received).toEqual(expected);
      pass = true;
      if (this.isNot) {
        logs = apiLogger.getCurrentLog()
      }
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getCurrentLog()
    }

    const hint = this.isNot ? 'not': ''
    const message = this.utils.matcherHint('shouldEqual', undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}\n\n`  +
        `Current API Log Info: \n${logs}`

    return {
      message: () => message,  // message required to be function
      pass
    };    
  },

  shouldBeLessThanOrEqual(received: any, expected: any) {
    let pass: boolean;
    let logs: string =''

    try {
      baseExpect(received).toBeLessThanOrEqual(expected);
      pass = true;
      if (this.isNot) {
        logs = apiLogger.getCurrentLog()
      }
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getCurrentLog()
    }

    const hint = this.isNot ? 'not': ''
    const message = this.utils.matcherHint('shouldBeLessThanOrEqual', undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}\n\n`  +
        `Current API Log Info: \n${logs}`

    return {
      message: () => message,  // message required to be function
      pass
    };    
  },

  shouldBeGreaterThanOrEqual(received: any, expected: any) {
    let pass: boolean;
    let logs: string =''

    try {
      baseExpect(received).toBeGreaterThanOrEqual(expected);
      pass = true;
      if (this.isNot) {
        logs = apiLogger.getCurrentLog()
      }
    } catch (e: any) {
      pass = false;
      logs = apiLogger.getCurrentLog()
    }

    const hint = this.isNot ? 'not': ''
    const message = this.utils.matcherHint('shouldBeGreaterThanOrEqual ', undefined, undefined, { isNot: this.isNot }) +
        '\n\n' +
        `Expected: ${hint} ${this.utils.printExpected(expected)}\n` +
        `Received: ${this.utils.printReceived(received)}\n\n`  +
        `Current API Log Info: \n${logs}`

    return {
      message: () => message,  // message required to be function
      pass
    };    
  },

  async shouldMatchSchema(received: any, dirName: string, fileName: string, createSchemaFlag:boolean = false) {
    let pass: boolean;
    let message: string =''

    try {
      await validateSchema(dirName, fileName, received, createSchemaFlag)
      pass = true;
      message = 'Schema validation passed'
    } catch (e: any) {
      pass = false;
      const logs = apiLogger.getCurrentLog() 
      message = `${e.message}\n\nCurrent API Log Info: \n${logs}`
    }

    return {
      message: () => message,
      pass
    };
  }
})