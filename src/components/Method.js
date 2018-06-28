import React from 'react';

export function Method({ onChangeValue, stages, currentStage }) {
  return (
    <div className="">
      <label className="text-white" htmlFor="stage">Stage: <br />
        <select className="btn dropB form-control" id="stage" onChange={onChangeValue}>
          {
            stages && stages.map(stage =>
              <option value={stage} selected={currentStage === stage && "selected"}>{stage}</option>
            )
          }
        </select>
      </label>
      <label className="text-white ml-4" htmlFor="method">Method: <br />
        <select className="btn dropB form-control" id="method" onChange={onChangeValue}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
    </div>
  )
}