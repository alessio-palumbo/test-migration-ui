import axios from 'axios'

export function sendReq({ url, host, pid, endpoint, token }) {
  return token ? sendTokenReq({ endpoint, token }) : sendCustomReq({ url, host, pid })
}

async function sendTokenReq(props) {
  const response = await axios
    .get(props.endpoint, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${props.token}`
      }
    });
  return response.data;
}

async function sendCustomReq(props) {
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
