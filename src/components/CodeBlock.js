import React, { Fragment } from 'react';

export function CodeBlock({ res }) {
  const lines = res.split("\n")
  return (
    <Fragment>
      <div className="gutter">
        {
          lines && lines.map((line, index) =>
            <div className="line-number"><p>{index}.</p></div>
          )
        }
      </div>
      <div>
        {
          lines && lines.map((line, index) =>
            <div className={`codeLine line${index + 1}`}><span className="code"><p>{line}</p></span></div>
          )
        }
      </div>
    </Fragment>
  )
}

