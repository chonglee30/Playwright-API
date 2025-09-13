import { test } from '../utils/fixtures';
import {expect} from '@playwright/test';

test.describe('Username Error Validation Test Scenario', () => {
  [
    { username: 'dd', usernameErrorMessage: 'is too short (minimum is 3 characters)'},
    { username: 'ddd', usernameErrorMessage: ''},
    { username: 'ddd22ddd22ddd22ddd22', usernameErrorMessage: ''},
    { username: 'ddd22ddd22ddd22ddd221', usernameErrorMessage: 'is too long (maximum is 20 characters)'},
  ].forEach(({username, usernameErrorMessage}) => {
    test(`Error Message Validation for Username: ${username}`, async({api}) => {
      const userLoginResponse = await api
      .path('/users')
      .body({
          "user": {
            "email": "a",
            "password": "a",
            "username": username
          }
        })
      .clearAuth()
      .postRequest(422)

      if ((username.length >=3) && (username.length<=20)) {
        expect(userLoginResponse.errors).not.toHaveProperty('username')  // no username error property
      } else {
        expect(userLoginResponse.errors.username[0]).toEqual(usernameErrorMessage) // username error property
      }
      console.log(userLoginResponse)
    })
  })
});