import axios from 'axios'
import _ from 'lodash'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
}

export async function sendReq(props) {
  defaultHeaders.Authorization = `Bearer ${props.token}`
  let url = getFullUrl(props.baseUrl, props.endpoint)

  const config = {
    method: props.method,
    headers: !_.isEmpty(props.headers) ? props.headers : defaultHeaders,
    url: url
  }

  if (props.payloadJson) {
    config.data = props.payloadJson
  }

  const response = await axios(config)
  return response.data
}

export async function loginOSSUser(env, login, password) {
  const baseUrl = getUrlFromEnv(env)

  const config = {
    method: 'POST',
    headers: defaultHeaders,
    url: baseUrl + 'v2/login',
    data: {
      'client_id': process.env.REACT_APP_CLIENT_ID,
      'client_secret': process.env.REACT_APP_CLIENT_SECRET,
      'username': login,
      'password': password,
      'grant_type': 'password'
    }
  }

  const response = await axios(config)
  return response.data
}

export async function loginOSSCompany(companyId, userToken, env) {
  const baseUrl = getUrlFromEnv(env)

  const config = {
    method: 'POST',
    headers: defaultHeaders,
    url: baseUrl + 'v2/login',
    data: {
      'client_id': process.env.REACT_APP_CLIENT_ID,
      'client_secret': process.env.REACT_APP_CLIENT_SECRET,
      'access_token': userToken,
      'company_id': companyId,
      'grant_type': 'token'
    }
  }

  const response = await axios(config)
  return response.data
}

export async function getUserCompanies(props) {
  const baseUrl = getUrlFromEnv(props.env)
  defaultHeaders.Authorization = `Bearer ${props.token}`

  const config = {
    method: 'GET',
    headers: defaultHeaders,
    url: baseUrl + process.env.REACT_APP_USER_COMPANIES,
  }

  const response = await axios(config)
  return response.data
}

export const getUrlFromEnv = env => {
  if (env === 'prod') return process.env.REACT_APP_BASE_PROD
  if (env === 'demo') return process.env.REACT_APP_BASE_DEMO

  const base = process.env.REACT_APP_BASE_URL || ''
  return base.replace('ENV', env)
}

export const getFullUrl = (baseUrl, endpoint) => {
  return baseUrl ? (baseUrl + endpoint) : endpoint
}
