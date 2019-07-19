import React from 'react'

export function Gutter({ style, resp, idxErr }) {
  let lines = []
  if (typeof resp === 'string' && resp !== '') {
    lines = resp.split('\n')
  }

  return (
    <div className={style}>
      {lines &&
        lines.map((line, index) => (
          <div key={index} className={`line-number ${index + 1 === parseInt(idxErr, 10) && 'bg-danger'}`}>
            <p>{index + 1}.</p>
          </div>
        ))}
    </div>
  )
}
