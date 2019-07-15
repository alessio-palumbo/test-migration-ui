import React from "react";

export function Api({ api, endpoint, token, pid, onChangeField, onCopyCurl, onSendReq, onCopyRes }) {
  const { id, label, curlBtn, jsonBtn, resp, url, host } = api
  token = token || api.token
  const credentials = pid ? `-H 'Host: ${host}' -H 'OSS-PrincipalId: ${pid}'` : `-H 'Authorization: Bearer ${token}'`
  const curl = `curl -H 'Accept: application/json' ${credentials} ${url || endpoint}`

  return (
    <div className="api">
      <h5><input className="api-label" value={label} type="text" name={`${id}-label`} onChange={onChangeField} /></h5>
      <p id={id} className="d-none">{curl}</p>
      <button onClick={onCopyCurl} className="btn btn-sm btn-custom">{curlBtn}</button>
      <button onClick={onSendReq} className="btn btn-sm btn-custom btn-custom-2">Send Request</button>
      {
        resp === ""
          ? <button className="btn btn-sm btn-custom btn-custom-4">JSON</button>
          : <button onClick={onCopyRes}
            className={`btn btn-sm btn-custom ${(jsonBtn === "JSON" || jsonBtn === "Copied!") ?
              "btn-custom-3" : "btn-danger"}`}>{jsonBtn}</button>

      }
    </div>
  )
}