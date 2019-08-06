import React from 'react'
import { Gutter } from './Gutter'

export function TextAreas({ leftApi, rightApi, onUpdateRes }) {
  return (
    <div className="taFCont d-flex justify-content-around">
      <div className="taCont left d-flex justify-content-around form-group">
        <Gutter style={`ta-Gutter`} resp={leftApi.resp} idxErr={leftApi.parseError && leftApi.parseError.line} />
        <textarea
          spellCheck="false"
          className="form-control left"
          onChange={onUpdateRes}
          id="textarealeft"
          name="left"
          placeholder={leftApi.respError || "Enter JSON to compare"}
          value={leftApi.resp || leftApi.respError}
        />
      </div>
      <div className="taCont right d-flex justify-content-around form-group">
        <Gutter style={`ta-Gutter`} resp={rightApi.resp} idxErr={rightApi.parseError && rightApi.parseError.line} />
        <textarea
          spellCheck="false"
          className="form-control right"
          onChange={onUpdateRes}
          id="textarearight"
          name="right"
          placeholder={rightApi.parseError || "Enter JSON to compare"}
          value={rightApi.resp || rightApi.respError}
        />
      </div>
    </div>
  )
}
