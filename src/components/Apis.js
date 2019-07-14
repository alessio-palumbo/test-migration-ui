import React from 'react'
import { Api } from './Api'

export function Apis({
  leftApi,
  rightApi,
  token,
  endpoint,
  onChangeApiField,
  onCopyCurl,
  onSendReq,
  onCopyRes
}) {
  const lid = leftApi.id
  const rid = rightApi.id

  return (
    <div className="d-flex justify-content-around">
      <Api
        api={leftApi}
        token={token}
        endpoint={endpoint}
        onChangeField={onChangeApiField}
        onCopyCurl={() => onCopyCurl(lid)}
        onSendReq={() => onSendReq(lid)}
        onCopyRes={() => onCopyRes(lid, leftApi.respJson)}
      />
      <Api
        api={rightApi}
        token={token}
        endpoint={endpoint}
        onChangeField={onChangeApiField}
        onCopyCurl={() => onCopyCurl(rid)}
        onSendReq={() => onSendReq(rid)}
        onCopyRes={() => onCopyRes(rid, rightApi.respJson)}
      />
    </div>
  )
}