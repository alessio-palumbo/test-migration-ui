import React, { Fragment } from 'react'
import { Inputs } from './Inputs'

export function ReqForm({
  leftApi,
  rightApi,
  onChangeApiField,
  onClearApiField,
  onChangeMethod,
  onChangeEnv,
  onCopyClip,
  onLogin,
  onPressEnter,
  onChangeLoginType,
  onUpdatePayload,
  onChangeEndpoint
}) {
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
          onChangeEndpoint={onChangeEndpoint}
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
          onChangeEndpoint={onChangeEndpoint}
        />
      </div>
    </Fragment>
  )
}
