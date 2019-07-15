import React from 'react'
import { Api } from './Api'

export function Apis({ leftApi, rightApi, onChangeApiField, onCopyCurl, onSendReq, onCopyRes }) {
  const lid = leftApi.id
  const rid = rightApi.id

  return (
    <div className="d-flex justify-content-around">
      <Api
        api={leftApi}
        onChangeField={onChangeApiField}
        onCopyCurl={() => onCopyCurl(lid)}
        onSendReq={() => onSendReq(lid)}
        onCopyRes={() => onCopyRes(lid, leftApi.respJson)}
      />
      <Api
        api={rightApi}
        onChangeField={onChangeApiField}
        onCopyCurl={() => onCopyCurl(rid)}
        onSendReq={() => onSendReq(rid)}
        onCopyRes={() => onCopyRes(rid, rightApi.respJson)}
      />
    </div>
  )
}