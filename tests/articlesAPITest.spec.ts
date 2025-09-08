import { test } from '../utils/fixtures';
//import {expect} from '@playwright/test';
import { expect } from '../utils/custom-expect';
import { APILogger } from '../utils/logger';
import { createAuthToken } from '../helpers/createAuthToken';
import articleRequestPayload from '../request-objects/articleRequest.json'
import {generateRandomArticle} from '../utils/dataGenerator'

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
  expect(response.articles.length).shouldBeLessThanOrEqual(10)
  expect(response.articlesCount).shouldBeGreaterThanOrEqual(10)  
})

test('Get Articles Request', async({api}) => {
  const response = await api
     .path('/articles')
     .params({limit: 10, offset:0})
     .getRequest(200)
  expect(response.articles.length).shouldBeLessThanOrEqual(10)
  expect(response.articlesCount).shouldBeGreaterThanOrEqual(10)
  await expect(response).shouldMatchSchema('articles', 'GET_articles')
})

test('Create, Update and Delete Article', async({api}) => {
const articleRequest = generateRandomArticle()
  // Create:
const createArticleResponse = await api.path('/articles')
     .body(articleRequest)
     .postRequest(201)

  expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title)
  await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles')
  const slugId = createArticleResponse.article.slug

  // Update:
  const updatedArticleRequest = generateRandomArticle()
  const updateArticleResponse = await api.path(`/articles/${slugId}`)
     .body(updatedArticleRequest)
     .putRequest(200)

  expect(updateArticleResponse.article.title).shouldEqual(updatedArticleRequest.article.title)
  await expect(updateArticleResponse).shouldMatchSchema('articles', 'PUT_articles') 
  const updatedSlugId = updateArticleResponse.article.slug   
  
  const articlesResponse = await api
  .path('/articles')
  .params({limit: 10, offset:0})
  .getRequest(200)

  expect(articlesResponse.articles[0].title).shouldEqual(updatedArticleRequest.article.title)

  // Delete:
  api.path(`/articles/${updatedSlugId}`)
     .deleteRequest(204)

  const articleDeleteResponse = await api
     .path('/articles')
     .params({limit: 10, offset:0})
     .getRequest(200)   

  expect(articleDeleteResponse.articles[0].title).not.shouldEqual(updatedArticleRequest.article.title)   
})
