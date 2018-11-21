import React from 'react'
import classnames from 'classnames';
import PropTypes from 'prop-types';

const SelectListGroup = ({
  name,
  value,
  error,
  info,
  onChange,
  options
}) => {
  const selectOptions = options.map(option => (
    <option value={option.value} key={option.label}>
      {option.label}
    </option>
  ))
  return (
    <div className="form-group">
      <select
        value={value}
        onChange={onChange}
        className={classnames("form-control form-control-lg", {
          'is-invalid': error
        })}
        name={name}
      >
        {selectOptions}
      </select>
      {info && <small className="form-text text-muted">{info}</small>}
      {
        error &&
        <div className="invalid-feedback">{error}</div>
      }
    </div>
  )
}

SelectListGroup.propTypes = {
  name: PropTypes.string.isRequried,
  value: PropTypes.string.isRequried,
  info: PropTypes.string,
  error: PropTypes.string,
  onChange: PropTypes.func.isRequried,
  options: PropTypes.array.isRequried
}

export default SelectListGroup;