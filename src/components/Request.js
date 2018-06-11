import axios from 'axios'

export function sendReq({ url, token }) {
  return axios.get(url, {
    headers: {
      "Accept": "application/json",
      "Authorization": "Bearer " + token,
    }
  })
    .then(response => {
      return response.data
    })
}