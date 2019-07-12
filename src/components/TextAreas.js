import React from 'react'
import { Gutter } from './Gutter'

export function TextAreas({ leftResp, rightResp, idxErrLeft, idxErrRight, onUpdateRes }) {

  return (
    <div className="taFCont d-flex justify-content-around">
      <div className="taCont left d-flex justify-content-around form-group">
        <Gutter style={`ta-Gutter`} res={leftResp} idxErr={idxErrLeft} />
        <textarea
          spellCheck="false"
          className="form-control left"
          onChange={onUpdateRes}
          id="textarealeft"
          placeholder="Enter JSON to compare"
          defaultValue={leftResp}
        />
      </div>
      <div className="taCont right d-flex justify-content-around form-group">
        <Gutter style={`ta-Gutter`} res={rightResp} idxErr={idxErrRight} />
        <textarea
          spellCheck="false"
          className="form-control right"
          onChange={onUpdateRes}
          id="textarearight"
          placeholder="Enter JSON to compare"
          defaultValue={rightResp}
        />
      </div>
    </div>
  )
}