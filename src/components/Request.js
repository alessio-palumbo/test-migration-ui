import axios from 'axios'

export function sendReq({ url, host }) {
  return axios
    .get(url, {
      headers: {
        Accept: 'application/json',
        Host: host
      }
    })
    .then(response => {
      return response.data
    })
}
