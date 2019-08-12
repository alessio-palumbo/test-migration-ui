import axios from 'axios'
import _ from 'lodash'

export async function sendReq(props) {
  const defaultHeaders = {
    Accept: 'application/json',
    Authorization: `Bearer ${props.token}`
  }

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
