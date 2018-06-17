import React from "react";

export function Apis({
  method,
  token,
  v2Url,
  v3Url,
  onCopyCurl,
  onSendReq,
  onCopyRes,
  btnTextV2,
  btnTextV3,
  btnJsonV2,
  btnJsonV3,
  v2Res,
  v3Res }) {
  return (
    <div className="d-flex justify-content-around api-container">
      <div className="api">
        <h5>V2</h5>
        <p id="v2" className="d-none">curl -H "Accept: application/json" -H "Authorization: Bearer {token}" "{v2Url}"</p>
        <button onClick={() => onCopyCurl("v2")} className="btn btn-sm btn-custom">{btnTextV2}</button>
        <button onClick={() => onSendReq("v2")} className="btn btn-sm btn-custom btn-custom-2">Send Request</button>
        {
          v2Res === "" ?
            <button onClick={() => onCopyRes("v2")} className="btn btn-sm btn-custom btn-custom-4">JSON</button>
            : <button onClick={() => onCopyRes("v2")}
              className={`btn btn-sm btn-custom ${(btnJsonV2 === "JSON" || btnJsonV2 === "Copied!") ?
                "btn-custom-3" : "btn-danger"}`}>{btnJsonV2}</button>

        }
      </div>
      <div className="api">
        <h5>V3</h5>
        <p id="v3" className="d-none">curl -H "Accept: application/json" -H "Authorization: Bearer {token}" "{v3Url}"</p>
        <button onClick={() => onCopyCurl("v3")} className="btn btn-sm btn-custom">{btnTextV3}</button>
        <button onClick={() => onSendReq("v3")} className="btn btn-sm btn-custom btn-custom-2">Send Request</button>
        {
          v3Res === "" ?
            <button onClick={() => onCopyRes("v3")} className="btn btn-sm btn-custom btn-custom-4">JSON</button>
            : <button onClick={() => onCopyRes("v3")}
              className={`btn btn-sm btn-custom ${(btnJsonV3 === "JSON" || btnJsonV3 === "Copied!") ?
                "btn-custom-3" : "btn-danger"}`}>{btnJsonV3}</button>

        }
      </div>
    </div>
  )
}