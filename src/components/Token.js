import React from "react";

export function Token({ api, onChangeField, onClearField, onPressEnter, onChangeLoginType }) {
  const { id, companies, loginType, token, userToken } = api

  return (
    <p>
      <label className="text-white">
        Token:
        <div className="input-container">
          {
            companies.length > 0 && (
              <select className="btn btn-sm profile-btn" value={`${loginType}|${token}`}
                onChange={e => onChangeLoginType(e, api.id)}
              >
                <option value={`U|${userToken}`}>U</option>
                {
                  companies.map(companyId => {
                    return <option value={`C|${companyId}`}>C</option>
                  })
                }
              </select>
            )
          }
          <input
            name={`${id}-token`}
            value={token}
            className={`form-control pr-5 input-box ${companies.length > 0 && 'pl-5'}`}
            type='text'
            onChange={onChangeField}
            onKeyPress={(e) => onPressEnter(e)}
          />
          <button className="btn btn-outline-secondary clear-btn" name={`${id}-token`} onClick={onClearField}>X</button>
        </div>
      </label>
    </p>
  )
}
