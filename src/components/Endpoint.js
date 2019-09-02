import React, { Fragment } from "react";
import _ from 'lodash'

export function Endpoint({ api, onChangeEndpoint, onChangeField, onClearField, onPressEnter }) {
  const { id, baseUrl, endpoint, method, env, history, loginId } = api

  return (
    <div className="input-container">
      {
        baseUrl && (
          <Fragment>
            <div className='btn baseUrl basep'>{env} /
            <select className='btn baseUrl'
                onChange={e => onChangeEndpoint(e, id)}
              >
                {
                  history[loginId] && history[loginId][env] &&
                  (
                    history[loginId][env].map((data, idx) => {
                      let isSelected = (data.endpoint === endpoint && data.method === method)
                      if (idx === 0 && endpoint === '') {
                        return (
                          <Fragment>
                            <option selected='selected' value=""></option>
                            <option key={idx} selected={isSelected} value={JSON.stringify(data)}>{data.endpoint}</option>
                          </Fragment>
                        )
                      }
                      return <option key={idx} selected={isSelected} value={JSON.stringify(data)}>{data.endpoint}</option>
                    })
                  )

                }
              </select>
            </div>
          </Fragment>
        )
      }
      <input
        name={`${id}-endpoint`}
        value={endpoint}
        className={`form-control pr-5 input-box ${baseUrl && 'base'}`}
        type='text'
        placeholder={baseUrl ? 'Endpoint' : 'Url'}
        onChange={onChangeField}
        onKeyPress={(e) => onPressEnter(e)}
      />
      <button className="btn btn-outline-secondary clear-btn" name={`${id}-endpoint`} onClick={onClearField}>X</button>
    </div>
  )
}
