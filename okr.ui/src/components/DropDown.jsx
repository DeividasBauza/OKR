import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';


export default function DropDown(props) {
  const [options] = useState(["", ...props.options])
  const [value, setValue] = useState(options[0]);
  useEffect(() => {
    if(props.value){
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = (e) => {
    props.onChange(e.target.value);
    setValue(e.target.value);
  };

  return (
    <FormControl style={{width:"100%"}} variant={props.variant}>
      <InputLabel id="demo-simple-select-outlined-label">{props.label}</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        onChange={handleChange}
        value={value}
        options={options}
        label={props.label}
        MenuProps={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left"
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left"
          },
          getContentAnchorEl: null, 
          transitionDuration: 0
        }}
      >
        {options.map((option, i) =>
          <MenuItem
            key={i}
            value={option}>
            {option.description ? option.description : option}
          </MenuItem>)}
      </Select>
      </FormControl>


  );
}

DropDown.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  variant: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string
};

DropDown.defaultProps = {
  options: [],
  onChange: (e) => { },
  label: "Select a value",
  variant: "filled"
};