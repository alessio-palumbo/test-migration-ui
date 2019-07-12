import React, { Fragment } from 'react'
import { Input } from './Input'
import { Method } from './Method'

export function ReqForm({ env, endpoint, token, pid, onChangeField, onClearField, onChangeMethod }) {
  return (
    <Fragment>
      <Method onChangeMethod={onChangeMethod} />
      <Input
        label={env ? `Endpoint - ${env.toUpperCase()}` : "Endpoint"}
        name="endpoint"
        value={endpoint}
        onChangeField={onChangeField}
        onClearField={onClearField}
      />
      <Input
        label="Token"
        name="token"
        value={token}
        onChangeField={onChangeField}
        onClearField={onClearField}
      />
      {
        pid &&
        <Input
          label="PrincipalId"
          name="pid"
          value={pid}
          onChangeField={onChangeField}
          onClearField={onClearField}
        />
      }
    </Fragment>
  )
}