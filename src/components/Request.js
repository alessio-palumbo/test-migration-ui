import axios from 'axios'

export function sendReq({ url, host, pid, token }) {
  if (token) {
    console.log('is token', token)
    return sendTokenReq({ url, token })
  } else {
    console.log('is pid', url, host, pid)
    return sendCustomReq({ url, host, pid })
  }
}

async function sendTokenReq(props) {
  const response = await axios
    .get(props.url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${props.token}`
      }
    });
  return response.data;
}

async function sendCustomReq(props) {
  console.log(props)
  const response = await axios
    .get(props.url, {
      headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
        'X-Host-Override': props.host,
        'OSS-PrincipalId': props.pid
      }
    });
  return response.data;
}
