import React from 'react'
import { Api } from './Api'

export function Apis({
  leftApi,
  rightApi,
  token,
  endpoint,
  onCopyCurl,
  onSendReq,
  onCopyRes
}) {
  const lid = leftApi.id
  const rid = rightApi.id

  return (
    <div className="d-flex justify-content-around api-container">
      <Api
        api={leftApi}
        token={token}
        endpoint={endpoint}
        onCopyCurl={() => onCopyCurl(lid)}
        onSendReq={() => onSendReq(lid)}
        onCopyRes={() => onCopyRes(lid, leftApi.respJson)}
      />
      <Api
        api={rightApi}
        token={token}
        endpoint={endpoint}
        onCopyCurl={() => onCopyCurl(rid)}
        onSendReq={() => onSendReq(rid)}
        onCopyRes={() => onCopyRes(rid, rightApi.respJson)}
      />
    </div>
  )
}