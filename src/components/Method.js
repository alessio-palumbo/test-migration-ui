import React from 'react'

export function Method({ api, onChangeMethod, onChangeEnv }) {
  return (
    <p>
      {
        api.isLogin
          ? (
            <label className="text-white" htmlFor="env">
              Env:
          <br />
              <select
                id="env"
                className="btn btn-sm btn-inputs btn-method form-control-sm"
                value={api.env}
                onChange={e => onChangeEnv(e, api.id)}
              >
                {
                  process.env.REACT_APP_ENVS.split(',').map(env => {
                    return <option value={env}>{env.toUpperCase()}</option>
                  })
                }
              </select>
            </label>
          )
          : (
            <label className="text-white" htmlFor="method">
              Method:
          <br />
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
            </label>
          )
      }
    </p>
  )
}
