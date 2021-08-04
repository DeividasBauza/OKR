import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
export const InputText = (props) => {
  return (
    <>
      <TextField
        type={props.type}
        id={props.id}
        label={props.placeholder}
        variant={props.variant}
        required={props.required}
        disabled={props.disabled}
        helperText={props.helperText}
        value={props.value}
        size={props.size}
        style={{ width: "100%" }}
        onChange={props.onChange}
        inputProps={props.inputProps}
      />
    </>
  );
};

InputText.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  value: PropTypes.string,
  size: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.string,
  inputProps: PropTypes.object,
};

InputText.defaultProps = {
  placeholder: "placeholder",
  size: "medium",
  disabled: false,
  variant: "standard",
};
