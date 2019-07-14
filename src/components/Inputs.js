import React, { Fragment } from 'react'
import { Input } from './Input'

export function Inputs({ leftApi, rightApi, onChangeApiField, onClearApiField }) {
  return (
    <Fragment>
      <div className='d-flex justify-content-around'>
        <Input
          label={`${leftApi.label} Endpoint`}
          name="left-endpoint"
          value={leftApi.endpoint}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
        />
        <Input
          label={`${rightApi.label} Endpoint`}
          name="right-endpoint"
          value={rightApi.endpoint}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
        />
      </div>
      <div className='d-flex justify-content-around'>
        <Input
          label={`${leftApi.label} Token`}
          name="left-token"
          value={leftApi.token}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
        />
        <Input
          label={`${rightApi.label} Token`}
          name="right-token"
          value={rightApi.token}
          onChangeField={onChangeApiField}
          onClearField={onClearApiField}
        />
      </div>

    </Fragment>
  )
}