import React from 'react';

export function Method({ onChangeValue }) {
  return (
    <div className="">
      <label className="text-white" htmlFor="stage">Stage: <br />
        <select className="btn dropB form-control" id="stage" onChange={onChangeValue}>
          <option value="Alessio">Alessio</option>
          <option value="PG">PG</option>
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