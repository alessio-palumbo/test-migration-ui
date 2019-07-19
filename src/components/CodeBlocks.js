import React from 'react';
import { CodeBlock } from './CodeBlock'

export function CodeBlocks({ leftResp, rightResp, diffLinesL, diffLinesR }) {
  return (
    <div className="d-flex justify-content-around">
      <pre id="out" className="d-flex text-left codeBlock left">
        <CodeBlock
          resp={leftResp}
          style={`diffGutter`}
          diffLines={diffLinesL}
          colors={['bg-success text-white', 'bg-info text-white']}
        />
      </pre>
      <pre id="out2" className="d-flex text-left codeBlock right">
        <CodeBlock
          resp={rightResp}
          style={`diffGutter`}
          diffLines={diffLinesR}
          colors={['bg-danger text-white', 'bg-warning text-white']}
        />
      </pre>
    </div>
  )
}
