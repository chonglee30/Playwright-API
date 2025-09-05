import { test } from '../utils/fixtures'
import {expect} from '@playwright/test'

test('Get Tags Test', async({api}) => {
  const response = await api.path('/tags')
                      .getRequest(200)

  expect(response.tags[0]).toEqual('Test')
  expect(response.tags.length).toBeLessThanOrEqual(10)                      
})