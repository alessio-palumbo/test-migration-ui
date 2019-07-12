import React, { Fragment } from 'react';

export function Method({ onChangeValue }) {
  return (
    <p>
      <label className="text-white" htmlFor="method">Method: <br />
        <select className="btn dropB form-control" id="method" onChange={onChangeValue}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
    </p>
  )
}