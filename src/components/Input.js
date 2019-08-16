import React from "react";

export function Input({ label, value, type, name, onChangeField, onClearField, onPressEnter }) {
  return (
    <p>
      <label className="text-white input-container">
        {label}:
        <input
          className="form-control pr-5 input-box"
          value={value || ''}
          type={type || 'text'}
          name={name}
          onChange={onChangeField}
          onKeyPress={(e) => onPressEnter(e)}
        />
        <button className="btn btn-outline-secondary clear-btn" name={name} onClick={onClearField}>X</button>
      </label>
    </p>
  )
}
