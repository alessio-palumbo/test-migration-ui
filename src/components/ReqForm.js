import React, { Fragment } from 'react'
import { Inputs } from './Inputs'
import { Method } from './Method'
import { InputsCustom } from './InputsCustom';

export function ReqForm({ env, endpoint, token, pid, leftApi, rightApi, onChangeCustomField, onChangeApiField, onClearCustomField, onClearApiField, onChangeMethod }) {
  return (
    <Fragment>
      <Method onChangeMethod={onChangeMethod} />
      {
        env ?
          <InputsCustom
            env={env}
            endpoint={endpoint}
            token={token}
            pid={pid}
            onChangeCustomField={onChangeCustomField}
            onClearCustomField={onClearCustomField}
          />
          :
          <Inputs
            leftApi={leftApi}
            rightApi={rightApi}
            onChangeApiField={onChangeApiField}
            onClearApiField={onClearApiField}
          />
      }
    </Fragment>
  )
}