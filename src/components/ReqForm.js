import React, { Fragment } from 'react'
import { Inputs } from './Inputs'
import { Method } from './Method'

export function ReqForm({ leftApi, rightApi, onChangeApiField, onClearApiField, onChangeMethod }) {
  return (
    <Fragment>
      <Method onChangeMethod={onChangeMethod} />
      <div className="d-flex flex-wrap justify-content-around">
        <Inputs api={leftApi} onChangeApiField={onChangeApiField} onClearApiField={onClearApiField} />
        <Inputs api={rightApi} onChangeApiField={onChangeApiField} onClearApiField={onClearApiField} />
      </div>
    </Fragment>
  )
}
