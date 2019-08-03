import axios from 'axios'

export async function sendReq(props) {
  const response = await axios.get(props.endpoint, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${props.token}`
    }
  })
  return response.data
}
