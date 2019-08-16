import React, { Fragment } from 'react'
import { Inputs } from './Inputs'

export function ReqForm({ leftApi, rightApi, onChangeApiField, onClearApiField, onChangeMethod, onChangeEnv, onCopyClip, onLogin, onPressEnter, onChangeLoginType, onUpdatePayload }) {
  return (
    <Fragment>
      <div className="d-flex flex-wrap justify-content-around">
        <Inputs api={leftApi}
          onChangeApiField={onChangeApiField}
          onClearApiField={onClearApiField}
          onChangeMethod={onChangeMethod}
          onChangeEnv={onChangeEnv}
          onCopyClip={onCopyClip}
          onLogin={onLogin}
          onPressEnter={onPressEnter}
          onChangeLoginType={onChangeLoginType}
          onUpdatePayload={onUpdatePayload}
        />
        <Inputs api={rightApi}
          onChangeApiField={onChangeApiField}
          onClearApiField={onClearApiField}
          onChangeMethod={onChangeMethod}
          onChangeEnv={onChangeEnv}
          onCopyClip={onCopyClip}
          onLogin={onLogin}
          onPressEnter={onPressEnter}
          onChangeLoginType={onChangeLoginType}
          onUpdatePayload={onUpdatePayload}
        />
      </div>
    </Fragment>
  )
}
