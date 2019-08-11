import axios from 'axios'
import _ from 'lodash'

export async function sendReq(props) {
  const defaultHeaders = {
    Accept: 'application/json',
    Authorization: `Bearer ${props.token}`
  }

  const config = {
    method: props.method || 'get',
    headers: !_.isEmpty(props.headers) ? props.headers : defaultHeaders,
    url: props.endpoint
  }

  if (!_.isEmpty(props.payload)) {
    config.data = props.payload
  }

  const response = await axios(config)
  return response.data
}
