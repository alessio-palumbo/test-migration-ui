import React from "react";
import _ from 'lodash'

export function Endpoint({ api, onChangeField, onClearField, onPressEnter }) {
  const { id, baseUrl, endpoint, env } = api

  return (
    <p>
      <label className="text-white">
        {baseUrl ? 'Endpoint' : 'Url'}:
        <div className="input-container">
          {
            baseUrl && <span className='btn baseUrl'>{env === 'bells-dem' ? 'demo' : env} /</span>
          }
          <input
            name={`${id}-endpoint`}
            value={endpoint}
            className={`form-control pr-5 input-box ${baseUrl && 'base'}`}
            type='text'
            onChange={onChangeField}
            onKeyPress={(e) => onPressEnter(e)}
          />
          <button className="btn btn-outline-secondary clear-btn" name={`${id}-endpoint`} onClick={onClearField}>X</button>
        </div>
      </label>
    </p>
  )
}