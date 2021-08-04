import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";

export const LargeTextInput = (props) => {
  return (
    <TextField
      id="outlined-multiline-static"
      variant="outlined"
      multiline
      label={props.label}
      placeholder={props.placeholder}
      rows={props.rows}
      value={props.value}
      onChange={props.onChange}
      inputProps={props.inputProps}
    />
  );
};
LargeTextInput.propTypes = {
  rows: PropTypes.number,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  width: PropTypes.number,
  value: PropTypes.string,
  onChange: PropTypes.func,
  inputProps: PropTypes.object,
};
