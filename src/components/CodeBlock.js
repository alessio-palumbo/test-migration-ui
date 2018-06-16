import React, { Fragment } from 'react';
import { Gutter } from './Gutter'

export function CodeBlock({ res, style, diffLines }) {
  const lines = res.split("\n")

  return (
    <Fragment>
      <Gutter res={res} style={style} />
      <div>
        {
          lines && lines.map((line, index) =>
            <div key={index}
              className={`codeLine p-0 line${index + 1} ${(diffLines.indexOf(index + 1) !== -1) && "bg-danger text-white"}`}
            ><span className="code"><p>{line}</p></span></div>
          )
        }
      </div>
    </Fragment>
  )
}

