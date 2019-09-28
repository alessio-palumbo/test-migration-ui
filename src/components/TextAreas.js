import React from 'react'
import { Gutter } from './Gutter'
import jdd from '../libs/jdd'
import jsonlint from 'jsonlint-mod'
import _ from 'lodash'

export function TextAreas({ leftApi, rightApi, onUpdateRes }) {

  let leftErrResp = formatErrResp(_.get(leftApi, "respError.response.data"))
  let rightErrResp = formatErrResp(_.get(rightApi, "respError.response.data"))

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
          placeholder={leftApi.parseError || "Enter JSON to compare"}
          value={leftErrResp || leftApi.resp}
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
          value={rightErrResp || rightApi.resp}
        />
      </div>
    </div>
  )
}

const formatErrResp = errorData => {
  if (_.isObject(errorData)) {
    try {
      let validJSON = jsonlint.parse(JSON.stringify(errorData))
      errorData = jdd.formatJSON(validJSON)
    } catch (e) {
      console.log(e)
    }
  }
  return errorData
}