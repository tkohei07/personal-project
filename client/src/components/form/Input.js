import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.id} className="form-label">
        {props.title}
      </label>
      <input
        id={props.id}
        type={props.type}
        className={props.className}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
        required={props.required}
      />
      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  );
});

export default Input;
