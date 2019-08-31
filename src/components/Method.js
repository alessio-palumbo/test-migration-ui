import React from 'react'

export function Method({ api, onChangeMethod, onChangeEnv }) {
  return (
    <p>
      {
        api.isLogin
          ? (
            <select
              id="env"
              className="btn btn-sm btn-inputs btn-method form-control-sm"
              value={api.env}
              onChange={e => onChangeEnv(e, api.id)}
            >
              {
                process.env.REACT_APP_ENVS.split(',').map(env => {
                  return <option key={env} value={env}>{env.toUpperCase()}</option>
                })
              }
            </select>
          )
          : (
            <select
              id="method"
              className="btn btn-sm btn-inputs btn-method form-control-sm"
              value={api.method}
              onChange={e => onChangeMethod(e, api.id)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
          )
      }
    </p>
  )
}
