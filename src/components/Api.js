import React from "react";

export function Api({ api, onChangeField, onCopyCurl, onSendReq, onCopyResp }) {
  const { id, label, endpoint, token, pid, curlBtn, jsonBtn, resp, respError, host, time } = api

  const credentials = token ? `-H 'Authorization: Bearer ${token}'` : `-H 'Host: ${host}' -H 'OSS-PrincipalId: ${pid}'`
  const curl = `curl -H 'Accept: application/json' ${credentials} ${endpoint}`
  const hasRespError = !!respError

  return (
    <div className="api">
      <h5>
        <input className="api-label" value={label} type="text" name={`${id}-label`} onChange={onChangeField} />
        {time && <span className="elapsed">{`(${time} ms)`}</span>}
      </h5>
      <p id={id} className="d-none">
        {curl}
      </p>
      <button onClick={onCopyCurl} className="btn btn-sm btn-custom">
        {curlBtn}
      </button>
      <button onClick={onSendReq} className="btn btn-sm btn-custom btn-custom-2">
        Send Request
      </button>
      {(resp === '' && !hasRespError) ? (
        <button className="btn btn-sm btn-custom btn-custom-4">JSON</button>
      ) : (
          <button
            onClick={onCopyResp}
            className={`btn btn-sm btn-custom ${hasRespError ? 'btn-danger' : 'btn-custom-3'}`}
            disabled={hasRespError || !!api.parseError}
          >
            {jsonBtn}
          </button>
        )}
    </div>
  )
}
