import React from "react";

export function Input({ label, value, name, onChangeField, onClearField }) {
  return (
    <p>
      <label className="text-white">
        {label}: <input className="form-control input-box" value={value} type="text" name={name} onChange={onChangeField} onClick={onClearField} />
      </label>
    </p>
  )
}