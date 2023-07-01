const TimeSelect = (props) => {
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
            {props.options.map((time, index) => {
                    return (
                        <option key={index} value={time}>
                            {time}
                        </option>
                    )
                })}
          </select>
        </div>
    )
}

export default TimeSelect;
 