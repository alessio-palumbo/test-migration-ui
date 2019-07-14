import React, { Fragment } from 'react'
import { Input } from './Input'

export function InputsCustom({ env, endpoint, token, pid, onChangeCustomField, onClearCustomField }) {
  return (
    <Fragment>
      <Input
        label={env ? `Endpoint - ${env.toUpperCase()}` : "Endpoint"}
        name="endpoint"
        value={endpoint}
        onChangeField={onChangeCustomField}
        onClearField={onClearCustomField}
      />
      <Input
        label="Token"
        name="token"
        value={token}
        onChangeField={onChangeCustomField}
        onClearField={onClearCustomField}
      />
      {
        pid &&
        <Input
          label="PrincipalId"
          name="pid"
          value={pid}
          onChangeField={onChangeCustomField}
          onClearField={onClearCustomField}
        />
      }
    </Fragment>
  )
}