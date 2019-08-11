import React, { Fragment } from 'react'
import { Input } from './Input'
import { Method } from './Method'

export function Inputs({ api, onChangeApiField, onClearApiField, onChangeMethod, onCopyClip, onPressEnter }) {
  const { id, label } = api

  return (
    <Fragment>
      <div>
        <div className="d-flex align-items-center justify-content-around">
          <button className='btn btn-sm btn-inputs' onClick={() => onCopyClip(api.id)}>Paste Curl</button>
          <Method onChangeMethod={onChangeMethod} />
          <button className='btn btn-sm btn-inputs' onClick={() => onCopyClip(api.id)}>Login</button>
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
      </div>
    </Fragment>
  )
}