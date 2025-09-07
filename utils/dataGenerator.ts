import articleRequestPayload from '../request-objects/articleRequest.json'
import { faker } from '@faker-js/faker';

export function generateRandomArticle() {
  const articleRequest = structuredClone(articleRequestPayload)
  articleRequest.article.title = 'Seahawks-'+faker.lorem.sentence(1)+Date.now()
  articleRequest.article.description = faker.lorem.sentence(4)
  articleRequest.article.body = faker.lorem.paragraph(6)
  return articleRequest
}