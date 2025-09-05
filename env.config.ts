// env.config.ts
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

export {config}