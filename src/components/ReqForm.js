import React, { Fragment } from 'react'
import { Inputs } from './Inputs'

export function ReqForm({ leftApi, rightApi, onChangeApiField, onClearApiField, onCopyClip }) {
  return (
    <Fragment>
      <div className="d-flex flex-wrap justify-content-around">
        <Inputs api={leftApi} onChangeApiField={onChangeApiField} onClearApiField={onClearApiField} onCopyClip={onCopyClip} />
        <Inputs api={rightApi} onChangeApiField={onChangeApiField} onClearApiField={onClearApiField} onCopyClip={onCopyClip} />
      </div>
    </Fragment>
  )
}
