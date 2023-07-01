const Select = (props) => {
  return (
    <div className="mb-3">
      <label htmlFor={props.name} className="form-label">
        {props.title}
      </label>
      <select
        id={props.id}
        className={props.className}
        name={props.name}
        value={props.value}
        onChange={props.onChange}
      >
        <option value="">{props.optionDefault}</option>
        {/* {props.options} */}
        {props.options.map((option) => {
          return (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
