import { forwardRef } from "react";

const Input = forwardRef((props, ref) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <input
        type={props.type}
        className={props.className}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      />
      <div className={props.errorDiv}>{props.errorMsg}</div>
    </div>
  );
});

export default Input;
