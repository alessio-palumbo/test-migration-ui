import React, { Fragment } from 'react'
import { Input } from './Input'
import { Method } from './Method'
import { Token } from './Token'
import { Endpoint } from './Endpoint'

export function Inputs({
  api,
  onChangeApiField,
  onClearApiField,
  onChangeMethod,
  onChangeEnv,
  onCopyClip,
  onLogin,
  onPressEnter,
  onChangeLoginType,
  onUpdatePayload
}) {
  const { id, isLogin } = api
  return (
    <Fragment>
      <div>
        <div className="btn-cont d-flex align-items-top justify-content-around">
          <button className="btn btn-sm btn-inputs" onClick={() => onCopyClip(api.id)}>
            Paste Curl
          </button>
          <Method api={api} onChangeMethod={onChangeMethod} onChangeEnv={onChangeEnv} />
          <button className="btn btn-sm btn-inputs" onClick={() => onLogin(api.id)}>
            {isLogin ? 'Back' : 'OSS-Login'}
          </button>
        </div>
        {
          isLogin
            ? (
              <Fragment>
                <Input
                  label='Login'
                  name={`${id}-login`}
                  value={api.login}
                  onChangeField={onChangeApiField}
                  onClearField={onClearApiField}
                  onPressEnter={onPressEnter}
                />
                <Input
                  label='Password'
                  name={`${id}-password`}
                  type='password'
                  value={api.password}
                  onChangeField={onChangeApiField}
                  onClearField={onClearApiField}
                  onPressEnter={onPressEnter}
                />
              </Fragment>
            )
            : (
              <Fragment>
                <Endpoint
                  api={api}
                  onChangeField={onChangeApiField}
                  onClearField={onClearApiField}
                  onPressEnter={onPressEnter}
                />
                <Token
                  api={api}
                  onChangeField={onChangeApiField}
                  onClearField={onClearApiField}
                  onPressEnter={onPressEnter}
                  onChangeLoginType={onChangeLoginType}
                />
                {(api.method === 'POST' || api.method === 'PUT') && (
                  <Fragment>
                    <div className={`payload-parse ${(!api.payloadError || !api.payloadError.display) && 'invisible'}`}>Parse Error at line: {api.payloadError && api.payloadError.line}</div>
                    <textarea
                      spellCheck="false"
                      className={`form-control payload ${api.payloadError && 'payload-err'}`}
                      onChange={onUpdatePayload}
                      id="payloadleft"
                      name={api.id}
                      placeholder={api.payloadError || 'Enter payload ...'}
                      value={api.payload}
                    />
                  </Fragment>
                )}
              </Fragment>
            )
        }
      </div>
    </Fragment>
  )
}
