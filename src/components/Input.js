import React from "react";

export function Input({ label, value, name, onChangeField, onClearField }) {
  return (
    <p className="ml-4">
      <label className="text-white">
        {label}: <input className="form-control input-box" value={value} type="text" name={name} onChange={onChangeField} />
      </label>
      <button className="btn btn-sm ml-1 mb-1" name={name} onClick={onClearField}>X</button>
    </p>
  )
}