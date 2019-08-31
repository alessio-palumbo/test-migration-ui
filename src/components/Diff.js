import React from 'react'
import { CodeBlocks } from './CodeBlocks'
import { TextAreas } from './TextAreas'

export function Diff({
  showDiffs,
  leftApi,
  rightApi,
  show,
  onCompare,
  compared,
  report,
  onUpdateRes,
  diffLinesL,
  diffLinesR,
  diffNum
}) {
  const isDisabled = leftApi.parseError || rightApi.parseError || leftApi.resp === '' || rightApi.resp === ''

  return (
    <div className="diff">
      <button className={`btn btn-sm diff-btn ${show ? "btn-light text-secondary" : "btn-outline-secondary"}`} onClick={showDiffs}>
        Show Diffs
      </button>
      {show && (
        <div className="diff-box p-4">
          {compared ? (
            <div id="diffcontainer">
              <button className="btn btn-sm btn-custom btn-comp-2" id="compare" onClick={onCompare}>
                Clear
              </button>
              {/* <div className="d-flex justify-content-around"> */}
              <div id="report" className={`p-1 ${diffNum > 0 ? 'text-danger' : 'text-success'}`}>
                {report}
              </div>
              {/* <ul id="toolbar" className="toolbar"></ul> */}
              {/* </div> */}
              <CodeBlocks
                leftResp={leftApi.resp}
                rightResp={rightApi.resp}
                diffLinesL={diffLinesL}
                diffLinesR={diffLinesR}
              />
            </div>
          ) : (
              <div spellCheck="false" id="initContainer">
                <div className="d-flex justify-content-around">
                  <pre id="errorLeft" className="error col text-danger">
                    {leftApi.parseError && leftApi.parseError.msg}
                  </pre>
                  <button className="btn btn-sm btn-custom" id="compare" onClick={onCompare} disabled={isDisabled}>
                    Compare
                </button>
                  <pre id="errorRight mt-1" className="error col text-danger">
                    {rightApi.parseError && rightApi.parseError.msg}
                  </pre>
                </div>
                <TextAreas
                  leftApi={leftApi}
                  rightApi={rightApi}
                  onUpdateRes={onUpdateRes}
                />
              </div>
            )}
        </div>
      )}
      <br />
    </div>
  )
}
