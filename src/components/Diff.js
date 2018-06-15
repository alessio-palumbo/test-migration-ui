import React from 'react'
import { CodeBlock } from './CodeBlock'

export function Diff({
  showDiffs,
  v2Res,
  v3Res,
  show,
  onCompare,
  btnCompText,
  compared,
  outLeft,
  outRight,
  report
}) {
  return (
    <div className="diff">
      <button className="btn btn-sm diff-btn" onClick={showDiffs}>Show Diffs</button>
      {
        show === true &&
        <div className="diff-box p-4">
          {
            compared ?
              (
                <div id="diffcontainer">
                  <button className={`btn btn-sm btn-custom ${btnCompText === "Clear" && "btn-comp-2"}`} id="compare" onClick={onCompare}>{btnCompText}</button>
                  <div id="report">{report}</div>
                  <ul id="toolbar" className="toolbar"></ul>
                  <div className="d-flex p-2 justify-content-around">
                    <pre id="out" className="d-flex text-left codeBlock left">
                      <CodeBlock res={outLeft} />
                    </pre>
                    <pre id="out2" className="d-flex text-left codeBlock right">
                      <CodeBlock res={outRight} />
                    </pre>
                  </div>
                </div>
              ) : (
                <div spellCheck="false" id="initContainer">
                  <div className="center p-1">
                    <button className={`btn btn-sm btn-custom ${btnCompText === "Clear" && "btn-comp-2"}`} id="compare" onClick={onCompare}>{btnCompText}</button>
                    <div className="throbber-loader"></div>
                  </div>
                  <div className="d-flex p-2 justify-content-around">
                    <div className="form-group taCont left">
                      <textarea spellCheck="false" className="form-control input-sm" id="textarealeft" placeholder="Enter JSON to compare" defaultValue={v2Res}></textarea>
                      <pre id="errorLeft" className="error"></pre>
                    </div>
                    <div className="form-group taCont right">
                      <textarea spellCheck="false" className="form-control right" id="textarearight" placeholder="Enter JSON to compare" defaultValue={v3Res}></textarea>
                      <pre id="errorRight" className="error"></pre>
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