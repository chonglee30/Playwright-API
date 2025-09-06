import { test } from '../utils/fixtures';
import {expect} from '@playwright/test';
import { APILogger } from '../utils/logger';
import { createAuthToken } from '../helpers/createAuthToken';

// let authToken: string

// test.beforeAll('Get Token', async({api, config}) => {
//   // const tokenResponse = await api.path('/users/login')
//   //    .body({
//   //     "user":{"email":config.userEmail,"password":config.userPassword}
//   //     })
//   //   .postRequest(200)
//   //   authToken = `Token `+tokenResponse.user.token 

//     authToken = await createAuthToken(config.userEmail, config.userPassword)
// })

// test('Get Articles Request with New Auth Token', async({api}) => {
//   const response = await api
//      .path('/articles')
//      .params({limit: 10, offset:0})
//      //.headers({Authorizatin: 'authToken*'})
//      .getRequest(200)
//   expect(response.articles.length).toBeLessThanOrEqual(10)
//   expect(response.articlesCount).toBeGreaterThanOrEqual(10)  
// })

test('Get Articles Request with Clear Auth Header', async({api}) => {
  const response = await api
     .path('/articles')
     .params({limit: 10, offset:0})
     .clearAuth()
     .getRequest(200)
  expect(response.articles.length).toBeLessThanOrEqual(10)
  expect(response.articlesCount).toBeGreaterThanOrEqual(10)  
})

test('Get Articles Request', async({api}) => {
  const response = await api
     .path('/articles')
     .params({limit: 10, offset:0})
     .getRequest(200)
  expect(response.articles.length).toBeLessThanOrEqual(10)
  expect(response.articlesCount).toBeGreaterThanOrEqual(10)  
})

test('Create, Update and Delete Article', async({api}) => {
  // Create:
const createArticleResponse = await api.path('/articles')
     .body({"article":{"title":"Seahawks Vs 49ers","description": "Sack Purdy","body":"Seahawks 23 vs 17 49ers","tagList":[]}})
     .postRequest(201)

  expect(createArticleResponse.article.title).toEqual('Seahawks Vs 49ers')
  const slugId = createArticleResponse.article.slug

  // Update:
  const updateArticleResponse = await api.path(`/articles/${slugId}`)
     .body({"article":{"title":"Updated Seahawks Game","description": "JSN and K9 Score","body":"Seahawks 23 vs 17 49ers","tagList":[]}})
     .putRequest(200)

  expect(updateArticleResponse.article.title).toEqual('Updated Seahawks Game')
  const updatedSlugId = updateArticleResponse.article.slug   
  
  const articlesResponse = await api
  .path('/articles')
  .params({limit: 10, offset:0})
  .getRequest(200)

  expect(articlesResponse.articles[0].title).toEqual('Updated Seahawks Game')

  // Delete:
  api.path(`/articles/${updatedSlugId}`)
     .deleteRequest(204)

  const articleDeleteResponse = await api
     .path('/articles')
     .params({limit: 10, offset:0})
     .getRequest(200)   

  expect(articleDeleteResponse.articles[0].title).not.toEqual('Updated Seahawks Game')   
})
