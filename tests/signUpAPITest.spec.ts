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

test.describe('Password Error Validation Test Scenario', () => {
  [
    { password: 'ddddddd', passwordErrorMessage: 'is too short (minimum is 8 characters)'},
    { password: 'dddddddd', usernameErrorMessage: ''},
    { password: 'ddd22ddd22ddd22ddd22', passwordErrorMessage: ''},
    { password: 'ddd22ddd22ddd22ddd221', passwordErrorMessage: 'is too long (maximum is 20 characters)'},
  ].forEach(({password, passwordErrorMessage}) => {
    test(`Error Message Validation for Password: ${password}`, async({api}) => {
      const signUpResponse = await api
      .path('/users')
      .body({
          "user": {
            "email": "a",
            "password": password,
            "username": "aa"
          }
        })
      .clearAuth()
      .postRequest(422)

      if ((password.length >=8) && (password.length<=20)) {
        expect(signUpResponse.errors).not.toHaveProperty('password')  // no password error property
      } else {
        expect(signUpResponse.errors.password[0]).toEqual(passwordErrorMessage) // password error property
      }
      console.log(signUpResponse)
    })
  })
});

test.describe('Email Error Validation Test Scenario', () => {
  test('Error Message Validation for Email', async({api}) => {
    const signUpResponse = await api
    .path('/users')
    .body({
        "user": {
          "email": "a",
          "password": "aa",
          "username": "aa"
        }
      })
    .clearAuth()
    .postRequest(422)
    expect(signUpResponse.errors.email[0]).toEqual('is invalid')
  });
}); 