import React from "react";
import PropTypes from "prop-types";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const Toggle = ({
  id,
  disabled,
  size,
  required,
  color,
  value,
  label,
  labelPlacement,
  onChange
}) => {
	const [checked, setChecked] = React.useState(value);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    onChange(event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          id={id}
          disabled={disabled}
          size={size}
          required={required}
          checked={checked}
          color={color}
          value={value}
          onChange={handleChange}/>
      }
      label={label} 
      labelPlacement={labelPlacement}/>
  );
};

Toggle.propTypes = {
  id: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.bool,
  size: PropTypes.string,
  required: PropTypes.bool,
  color: PropTypes.string,
  label: PropTypes.string,
  labelPlacement: PropTypes.string,
  onChange: PropTypes.func
};

Toggle.defaultProps = {
  disabled: false,
  value: false,
  size: "medium",
  required: false,
  color: "primary",
  labelPlacement: "end",
  onChange: () => {}
};

export default Toggle;