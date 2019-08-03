import React from 'react'
import { Api } from './Api'

export function Apis({ leftApi, rightApi, onChangeApiField, onCopyCurl, onSendReq, onCopyResp }) {
  const lid = leftApi.id
  const rid = rightApi.id

  return (
    <div className="d-flex justify-content-around">
      <Api
        api={leftApi}
        onChangeField={onChangeApiField}
        onCopyCurl={onCopyCurl}
        onSendReq={() => onSendReq(lid)}
        onCopyResp={() => onCopyResp(lid)}
      />
      <Api
        api={rightApi}
        onChangeField={onChangeApiField}
        onCopyCurl={onCopyCurl}
        onSendReq={() => onSendReq(rid)}
        onCopyResp={() => onCopyResp(rid)}
      />
    </div>
  )
}
