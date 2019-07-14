import axios from 'axios'

export function sendReq({ url, host, pid, endpoint, token }) {
  return token ? sendTokenReq({ endpoint, token }) : sendCustomReq({ url, host, pid })
}

async function sendTokenReq(props) {
  const response = await axios
    .get(props.endpoint, {
      headers: {
        Accept: 'application/json',
        crossdomain: true,
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
        crossdomain: true,
        'X-Host-Override': props.host,
        'OSS-PrincipalId': props.pid
      }
    });
  return response.data;
}
