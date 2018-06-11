import React from 'react'
import JsonDiffReact from 'jsondiffpatch-for-react';

export function Diff({ showDiffs, v2Res, v3Res, show }) {
  return (
    <div className="diff">
      <button className="btn btn-sm diff-btn" onClick={showDiffs}>Show Diffs</button>
      {
        show === true ?
          (
            <JsonDiffReact
              right={v2Res}
              left={v3Res}
              show={true}
              annotated={true}
            />
          ) : null
      }
      <br />
    </div>
  )
}