import React, { Fragment } from 'react'
import { Input } from './Input'

export function Inputs({ api, onChangeApiField, onClearApiField }) {
  const { id, label } = api

  return (
    <Fragment>
      <div>
        <Input
          label={`${label} - Endpoint`}
          name={`${id}-endpoint`}
          value={api.endpoint}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
        />
        <Input
          label={`${label} - Token`}
          name={`${id}-token`}
          value={api.token}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
        />
      </div>
    </Fragment>
  )
}