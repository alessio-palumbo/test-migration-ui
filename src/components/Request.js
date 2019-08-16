import axios from 'axios'
import _ from 'lodash'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export async function sendReq(props) {
  defaultHeaders.Authorization = `Bearer ${props.token}`

  const config = {
    method: props.method,
    headers: !_.isEmpty(props.headers) ? props.headers : defaultHeaders,
    url: props.endpoint
  }

  if (props.payloadJson) {
    config.data = props.payloadJson
  }

  const response = await axios(config)
  return response.data
}

export async function loginOSSUser(props) {

  const config = {
    method: 'POST',
    headers: defaultHeaders,
    url: props.env === 'prod'
      ? process.env.REACT_APP_LOGIN_PROD
      : process.env.REACT_APP_LOGIN_URL.replace('ENV', (props.env || 'pg-1')),
    data: {
      'client_id': process.env.REACT_APP_CLIENT_ID,
      'client_secret': process.env.REACT_APP_CLIENT_SECRET,
      'username': props.login,
      'password': props.password,
      'grant_type': 'password'
    }
  }

  const response = await axios(config)
  return response.data
}

export async function loginOSSCompany(props) {

  const config = {
    method: 'POST',
    headers: defaultHeaders,
    url: process.env.REACT_APP_LOGIN_URL.replace('ENV', (props.env || 'pg-1')),
    data: {
      'client_id': process.env.REACT_APP_CLIENT_ID,
      'client_secret': process.env.REACT_APP_CLIENT_SECRET,
      'access_token': props.userToken,
      'company_id': props.companyId,
      'grant_type': 'token'
    }
  }

  const response = await axios(config)
  return response.data
}
