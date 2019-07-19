import React, { Fragment } from 'react'
import { Gutter } from './Gutter'

export function CodeBlock({ resp, style, diffLines, colors }) {
  let lines = []
  if (typeof resp === 'string') {
    lines = resp.split('\n')
  }

  return (
    <Fragment>
      <Gutter resp={resp} style={style} />
      <div>
        {lines &&
          lines.map((line, index) => (
            <div
              key={index}
              className={`codeLine p-0 line${index + 1}
               ${(diffLines[index + 1] === 'eq' || diffLines[index + 1] === 'type') && colors[0]}
               ${diffLines[index + 1] === 'missing' && colors[1]}
              `}
            >
              <span className="code">
                <p>{line}</p>
              </span>
            </div>
          ))}
      </div>
    </Fragment>
  )
}
