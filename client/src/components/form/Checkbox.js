const CheckBox = (props) => {
  return (
    // <div className="form-check form-check-inline" key={props.key}>
    <div className="form-check form-check-inline">
      <input
        id={props.id}
        className="form-check-input"
        type="checkbox"
        value={props.value}
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
      />
      <label className="form-check-label" htmlFor={props.id}>
        {props.value}
      </label>
    </div>
  );
}

export default CheckBox;
