import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGr from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import PropTypes from "prop-types";

export default function RadioGroup(props) {
  const handleChange = (selectedValue) => {
    props.onChange(selectedValue);
  };
  const RadioButtons = () => {
    const map1 = props.elements.map((element, i) => (
      <FormControlLabel
        control={<Radio />}
        label={element}
        value={element}
        key={i}
      />
    ));

    return map1;
  };
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{props.name}</FormLabel>
      <RadioGr
        row={props.row}
        name={props.groupName}
        onChange={(e) => handleChange(e.target.value)}
        defaultValue={props.defaultValue}
        value={props.value}
      >
        {RadioButtons()}
      </RadioGr>
    </FormControl>
  );
}

RadioGroup.propTypes = {
  name: PropTypes.string,
  elements: PropTypes.array,
  groupName: PropTypes.string,
  onChange: PropTypes.func,
  row: PropTypes.bool,
  defaultValue: PropTypes.string,
  value: PropTypes.string
};

RadioGroup.defaultProps = {
  onChange: () => {},
};
