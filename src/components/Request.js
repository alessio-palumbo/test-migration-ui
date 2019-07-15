import axios from 'axios'

export function sendReq({ endpoint, token, host, pid }) {
  return token ? sendTokenReq({ endpoint, token }) : sendCustomReq({ endpoint, host, pid })
}

async function sendTokenReq(props) {
  const response = await axios.get(props.endpoint, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${props.token}`
    }
  })
  return response.data
}

async function sendCustomReq(props) {
  const response = await axios.get(props.endpoint, {
    headers: {
      Accept: 'application/json',
      'X-Host-Override': props.host,
      'OSS-PrincipalId': props.pid
    }
  })
  return response.data
}
