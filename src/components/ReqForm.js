import React, { Fragment } from 'react'
import { Inputs } from './Inputs'

export function ReqForm({ leftApi, rightApi, onChangeApiField, onClearApiField, onChangeMethod, onCopyClip, onPressEnter, onUpdatePayload }) {
  return (
    <Fragment>
      <div className="d-flex flex-wrap justify-content-around">
        <Inputs api={leftApi} onChangeApiField={onChangeApiField} onClearApiField={onClearApiField} onChangeMethod={onChangeMethod} onCopyClip={onCopyClip} onPressEnter={onPressEnter} onUpdatePayload={onUpdatePayload} />
        <Inputs api={rightApi} onChangeApiField={onChangeApiField} onClearApiField={onClearApiField} onChangeMethod={onChangeMethod} onCopyClip={onCopyClip} onPressEnter={onPressEnter} onUpdatePayload={onUpdatePayload}/>
      </div>
    </Fragment>
  )
}
