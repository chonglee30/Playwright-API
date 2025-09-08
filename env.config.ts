// env.config.ts
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

const processENV = process.env.ENV
const env = processENV || 'dev'
console.log('Test environment is: '+env)

const config = {
  apiUrl: 'https://conduit-api.bondaracademy.com/api',
  userEmail: 'vantest1@test.com',
  userPassword: 'Welcome#1'
}

if (env === 'qa') {
  config.apiUrl = 'https://conduit-api.bondaracademy.com/api'
  config.userEmail = 'pwtest@test.com',
  config.userPassword = 'Welcome2'
}

if (env === 'prod') {
  config.userEmail = process.env.PROD_USERNAME as string,
  config.userPassword = process.env.PROD_PASSWORD as string
}

export {config}