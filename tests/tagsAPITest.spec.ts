import { test } from '../utils/fixtures'
import { expect } from '../utils/custom-expect';
import { validateSchema } from '../utils/schemaValidator'

test('Get Tags Test', async({api}) => {
  const response = await api.path('/tags')
                      .getRequest(200)
  await expect(response).shouldMatchSchema('tags', 'GET_tags')                    
  expect(response.tags[0]).shouldEqual('Test')
  expect(response.tags.length).shouldBeLessThanOrEqual(10)                      
})