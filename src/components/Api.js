import React from "react";

export function Api({ api, onChangeField, onCopyCurl, onSendReq, onCopyResp }) {
  const { id, label, endpoint, token, pid, curlCopied, jsonCopied, reqSent, resp, respError, host, time } = api

  const credentials = token ? `-H 'Authorization: Bearer ${token}'` : `-H 'Host: ${host}' -H 'OSS-PrincipalId: ${pid}'`
  const curl = `curl -H 'Accept: application/json' ${credentials} ${endpoint}`

  const hasRespError = !!respError
  let errCode = hasRespError && respError.status
  if (hasRespError && !respError.status) {
    errCode = '!CORS'

    if (respError.message.indexOf('code') !== -1) {
      let idx = respError.message.indexOf('code') + 5
      errCode = respError.message.slice(idx, idx + 3)
    }
  }

  return (
    <div className="api">
      <h5>
        <input className="api-label" value={label} type="text" name={`${id}-label`} onChange={onChangeField} />
        {time && <span className="elapsed">{`(${time} ms)`}</span>}
      </h5>
      <button
        onClick={() => onCopyCurl({ id, curl })}
        className="btn btn-sm btn-custom"
        disabled={!(token || host) | !endpoint}
      >
        {curlCopied ? 'Copied!' : 'Copy Curl'}
      </button>
      <button onClick={onSendReq} className="btn btn-sm btn-custom btn-custom-2" disabled={reqSent}>
        {
          reqSent ? "Sending..." : "Send Request"
        }
      </button>
      {
        (resp === '' && !hasRespError) ? (
          <button
            className="btn btn-sm btn-custom btn-custom-4"
            disabled={resp === ''}
          >JSON</button>
        ) : (
            <button
              onClick={onCopyResp}
              className={`btn btn-sm btn-custom ${hasRespError ? 'btn-danger' : 'btn-custom-3'}`}
              disabled={hasRespError || !!api.parseError}
            >
              {
                !!errCode ?
                  errCode :
                  (
                    jsonCopied && 'Copied' || 'JSON'
                  )
              }
            </button>
          )
      }
    </div >
  )
}
