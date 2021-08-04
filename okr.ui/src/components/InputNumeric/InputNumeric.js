import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
export const InputNumeric = (props) => {
  const handleChange = (event) => {
    const validValue = event.target.value ? event.target.value : 0;
    props.onChange(Number(validValue));
  };

  return (
    <>
      <TextField
        type="number"
        id={props.id}
        label={props.placeholder}
        style={{ width: "100%" }}
        variant={props.variant}
        required={props.required}
        disabled={props.disabled}
        helperText={props.helperText}
        value={props.value}
        size={props.size}
        onChange={(event) => {
          handleChange(event);
        }}
        inputProps={props.inputProps}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </>
  );
};

InputNumeric.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  value: PropTypes.number,
  size: PropTypes.string,
  onChange: PropTypes.func,
  inputProps: PropTypes.object,
  variant: PropTypes.string,
};

InputNumeric.defaultProps = {
  placeholder: "placeholder",
  disabled: false,
  size: "medium",
  onChange: () => {},
};
