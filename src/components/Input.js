import React from "react";

export function Input({ label, value, name, onChangeField, onClearField }) {
  return (
    <p>
      <label className="text-white input-container">
        {label}: <input className="form-control pr-5 input-box" value={value || ''} type="text" name={name} onChange={onChangeField} />
        <button className="btn btn-outline-secondary clear-btn" name={name} onClick={onClearField}>X</button>
      </label>
    </p>
  )
}
