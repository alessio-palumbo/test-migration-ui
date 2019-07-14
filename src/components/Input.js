import React from "react";

export function Input({ label, value, name, onChangeField, onClearField }) {
  return (
    <p>
      <label className="text-white input-container">
        {label}: <input className="form-control pr-5 input-box" value={value} type="text" name={name} onChange={onChangeField} />
        <button className="btn btn-outline-secondary clear-btn" name={name} onClick={onClearField}>X</button>
      </label>
    </p>
  )
}


// <div class="input-group mb-3">
//   <input type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2">
//   <div class="input-group-append">
//     <button class="btn btn-outline-secondary" type="button">Button</button>
//   </div>
// </div>