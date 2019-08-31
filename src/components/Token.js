import React, { Fragment } from "react";
import _ from 'lodash'

export function Token({ api, onChangeField, onClearField, onPressEnter, onChangeLoginType }) {
  const { id, username, logins, loginId, token } = api
  const companyName = (logins && logins[loginId] && logins[loginId].role !== 'worker' && logins[loginId].name && ` - ${logins[loginId].name}`) || ''
  const label = username && `${username}${companyName}`


  return (
    <Fragment>
      <div className={`text-white token-label ${!label && "invisible"}`}>{label}</div>
      <div className="token-container">
        {
          !_.isEmpty(logins) && (
            <select className="btn btn-sm profile-btn" value={`${loginId}|${token}`}
              onChange={e => onChangeLoginType(e, api.id)}
            >
              {
                Object.entries(logins).map((login) => {
                  let role = login[1].role.substr(0, 1).toUpperCase()
                  return <option key={login[0]} value={`${login[0]}|${login[1].token}`}>{role}</option>
                })
              }
            </select>
          )
        }
        <input
          name={`${id}-token`}
          value={token}
          className={`form-control pr-5 input-box ${!_.isEmpty(logins) && 'pl-5'}`}
          type='text'
          placeholder='Token'
          onChange={onChangeField}
          onKeyPress={(e) => onPressEnter(e)}
        />
        <button className="btn btn-outline-secondary clear-btn" name={`${id}-token`} onClick={onClearField}>X</button>
      </div>
    </Fragment>
  )
}
