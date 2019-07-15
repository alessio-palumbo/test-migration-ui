import React, { Fragment } from 'react'
import { Input } from './Input'

export function Inputs({ api, onChangeApiField, onClearApiField }) {
  return (
    <Fragment>
      <div>
        <Input
          label={`${api.label} - Endpoint`}
          name="left-endpoint"
          value={api.endpoint}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
        />
        <Input
          label={`${api.label} - Token`}
          name="left-token"
          value={api.token}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
        />
        {api.pid && (
          <Input
            label={`${api.label} - PrincipalId`}
            name="pid"
            value={api.pid}
            onChangeField={onChangeApiField}
            onClearField={onClearApiField}
          />
        )}
      </div>
    </Fragment>
  )
}