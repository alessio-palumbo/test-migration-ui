import React from 'react'
import { CodeBlocks } from './CodeBlocks'
import { TextAreas } from './TextAreas'

export function Diff({
  showDiffs,
  leftResp,
  rightResp,
  show,
  onCompare,
  compared,
  report,
  onUpdateRes,
  leftErr,
  rightErr,
  idxErrLeft,
  idxErrRight,
  diffLinesL,
  diffLinesR,
  diffNum
}) {

  return (
    <div className="diff">
      <button className="btn btn-sm diff-btn btn-outline-secondary" onClick={showDiffs}>
        Show Diffs
      </button>
      {show === true && (
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
                leftResp={leftResp}
                rightResp={rightResp}
                diffLinesL={diffLinesL}
                diffLinesR={diffLinesR}
              />
            </div>
          ) : (
              <div spellCheck="false" id="initContainer">
                <div className="d-flex justify-content-around">
                  <pre id="errorLeft" className="error col text-danger">
                    {leftErr}
                  </pre>
                  <button
                    className="btn btn-sm btn-custom"
                    id="compare"
                    onClick={onCompare}
                    disabled={!(typeof leftResp === 'string' && typeof rightResp === 'string')}
                  >
                    Compare
                  </button>
                  <pre id="errorRight mt-1" className="error col text-danger">
                    {rightErr}
                  </pre>
                </div>
                <TextAreas
                  leftResp={leftResp}
                  rightResp={rightResp}
                  idxErrLeft={idxErrLeft}
                  idxErrRight={idxErrRight}
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
