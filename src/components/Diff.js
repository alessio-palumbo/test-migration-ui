import React from 'react'
import { CodeBlock } from './CodeBlock'
import { Gutter } from './Gutter'

export function Diff({
  showDiffs,
  v2Res,
  v3Res,
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
  const disBtn = !(typeof v2Res === "string" && typeof v3Res === "string")

  return (
    <div className="diff">
      <button className="btn btn-sm diff-btn btn-outline-secondary" onClick={showDiffs}>Show Diffs</button>
      {
        show === true &&
        <div className="diff-box p-4">
          {
            compared ?
              (
                <div id="diffcontainer">
                  <button className="btn btn-sm btn-custom btn-comp-2" id="compare" onClick={onCompare}>Clear</button>
                  <div id="report" className={`p-1 ${diffNum > 0 ? "text-danger" : "text-success"}`}>{report}</div>
                  {/* <ul id="toolbar" className="toolbar"></ul> */}
                  <div className="d-flex justify-content-around">
                    <pre id="out" className="d-flex text-left codeBlock left">
                      <CodeBlock res={v2Res} style={`diffGutter`} diffLines={diffLinesL} colors={["bg-success text-white", "bg-info text-white"]} />
                    </pre>
                    <pre id="out2" className="d-flex text-left codeBlock right">
                      <CodeBlock res={v3Res} style={`diffGutter`} diffLines={diffLinesR} colors={["bg-danger text-white", "bg-warning text-white"]} />
                    </pre>
                  </div>
                </div>
              ) : (
                <div spellCheck="false" id="initContainer">
                  <div className="d-flex justify-content-around">
                    <pre id="errorLeft" className="error col text-danger">{leftErr}</pre>
                    <button className="btn btn-sm btn-custom" id="compare" onClick={onCompare} disabled={disBtn}>Compare</button>
                    <pre id="errorRight mt-1" className="error col text-danger">{rightErr}</pre>
                  </div>
                  <div className="taFCont d-flex justify-content-around">
                    <div className="taCont left d-flex justify-content-around form-group">
                      <Gutter style={`ta-Gutter`} res={v2Res} idxErr={idxErrLeft} />
                      <textarea spellCheck="false" className="form-control left" onChange={onUpdateRes} id="textarealeft" placeholder="Enter JSON to compare" defaultValue={v2Res}></textarea>
                    </div>
                    <div className="taCont right d-flex justify-content-around form-group">
                      <Gutter style={`ta-Gutter`} res={v3Res} idxErr={idxErrRight} />
                      <textarea spellCheck="false" className="form-control right" onChange={onUpdateRes} id="textarearight" placeholder="Enter JSON to compare" defaultValue={v3Res}></textarea>
                    </div>
                  </div>
                </div>
              )
          }
        </div>
      }
      <br />
    </div>
  )
}