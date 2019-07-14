import React from "react";

export function Api({
  api,
  endpoint,
  token,
  onCopyCurl,
  onSendReq,
  onCopyRes
}) {

  const { id, label, curlBtn, jsonBtn, resp, url, host, pid } = api
  const credentials = token ? `-H 'Authorization: Bearer ${token}'` : `-H 'Host: ${host}' -H 'OSS-PrincipalId: ${pid}'`
  const curl = `curl -H 'Accept: application/json' ${credentials} ${url || endpoint}`

  return (
    <div className="api">
      <h5>{label}</h5>
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