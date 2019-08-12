import React, { Fragment } from 'react'
import { Input } from './Input'
import { Method } from './Method'

export function Inputs({
  api,
  onChangeApiField,
  onClearApiField,
  onChangeMethod,
  onCopyClip,
  onPressEnter,
  onUpdatePayload
}) {
  const { id, label } = api
  console.log(api.payloadError)

  return (
    <Fragment>
      <div>
        <div className="d-flex align-items-center justify-content-around">
          <button className="btn btn-sm btn-inputs" onClick={() => onCopyClip(api.id)}>
           Paste Curl
          </button>
          <Method api={api} onChangeMethod={onChangeMethod} />
          <button className="btn btn-sm btn-inputs" onClick={() => onCopyClip(api.id)}>
            Login
          </button>
        </div>
        <Input
          label={`${label} - Endpoint`}
          name={`${id}-endpoint`}
          value={api.endpoint}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
          onPressEnter={onPressEnter}
        />
        <Input
          label={`${label} - Token`}
          name={`${id}-token`}
          value={api.token}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
          onPressEnter={onPressEnter}
        />
        {(api.method === 'POST' || api.method === 'PUT') && (
          <Fragment>
            <div className={`text-danger ${(!api.payloadError || !api.payloadError.display) && 'invisible'}`}>Parse Error at line: {api.payloadError && api.payloadError.line}</div>
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
      </div>
    </Fragment>
  )
}
