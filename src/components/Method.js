import React from 'react'

export function Method({ api, onChangeMethod }) {
  return (
    <p>
      <label className="text-white" htmlFor="method">
        Method:
        <br />
        <select
          className="btn btn-sm btn-inputs btn-method form-control-sm"
          value={api.method}
          onChange={e => onChangeMethod(e, api.id)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
    </p>
  )
}