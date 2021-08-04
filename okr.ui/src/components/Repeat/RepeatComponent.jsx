import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DropDown from "../DropDown";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import "./RepeatComponent.scss";
import { InputNumeric } from "../InputNumeric/InputNumeric";

const RepeatComponent = ({
  onChange,
  options,
  dropdownLabel,
  inputLabel,
  maxLength,
  numericInputLabel,
  keyResults
}) => {
  const [fields, setFields] = useState([
    { type: "", description: "", value: 0, maxValue: null, id: Math.random() },
  ]);

  const limitReached = fields.length === 20;

  useEffect(() => {
    onChange(fields);
  }, [fields, onChange]);

  useEffect(() => {
    if(keyResults.length !== 0) {
      setFields(keyResults);
    }
  }, [keyResults.length]);

  const handleAdd = () => {
    setFields([
      ...fields,
      {
        type: "",
        description: "",
        value: 0,
        maxValue: null,
        id: Math.random(),
      },
    ]);
  };
  const handleRemove = (id) => {
    const newArray = fields.filter((field) => field.id !== id);
    setFields([...newArray]);
  };

  const handleInputChange = (newDescription, index) => {
    const stateCopy = [...fields];
    stateCopy[index] = {
      ...stateCopy[index],
      description: newDescription,
    };
    setFields([...stateCopy]);
  };
  const handleNumericChange = (newMaxValue, index) => {
    const stateCopy = [...fields];
    stateCopy[index] = {
      ...stateCopy[index],
      maxValue: newMaxValue,
    };
    setFields([...stateCopy]);
  };
  const handleDropDownChange = (newType, index) => {
    const stateCopy = [...fields];
    if (newType === "Numeric") {
      stateCopy[index] = {
        ...stateCopy[index],
        type: newType,
        maxValue: 0,
      };
    } else {
      stateCopy[index] = {
        ...stateCopy[index],
        type: newType,
        maxValue: newType === "Completion" ? 1 : 100,
      };
    }

    setFields([...stateCopy]);
  };
  return (
    <div className="key-results">
      {fields.map((field, index) => {
        return (
          <div key={field.id} className="key-results__item">
            <div className="key-results__item__row">
              <DropDown
                value={fields ? fields[index].type : ""}
                options={options}
                variant="outlined"
                label={dropdownLabel}
                onChange={(value) => {
                  handleDropDownChange(value, index);
                }}
              />
              <div className="key-results__item__row__remove-button">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemove(field.id)}
                  disabled={fields.length === 1}
                >
                  <DeleteOutlineIcon
                    style={{ fontSize: "28px", padding: "8px" }}
                  />
                </Button>
              </div>
            </div>
            {field.type === "Numeric" && (
              <div className="key-results__item__row">
                <InputNumeric
                  size="medium"
                  variant="outlined"
                  style={{ width: "100%" }}
                  placeholder={numericInputLabel}
                  value={field.maxValue}
                  inputProps={{ maxLength: maxLength, step: 1, min: 1 }}
                  onChange={(value) => {
                    handleNumericChange(value, index);
                  }}
                />
              </div>
            )}
            <div className="key-results__item__row">
              <TextField
                size="medium"
                variant="outlined"
                style={{ width: "100%" }}
                label={inputLabel}
                value={field.description}
                inputProps={{ maxLength: maxLength }}
                onChange={(event) => {
                  handleInputChange(event.target.value, index);
                }}
              />
            </div>
          </div>
        );
      })}
      <Button
        className={`${limitReached ? 'limit-reached' : ''}`}
        color="secondary"
        variant="contained"
        disabled={limitReached}
        onClick={handleAdd}
        style={{ margin: "0.4rem 0 0 0", backgroundColor: "#2c29de", color: "#fff" }}
      >
        <span 
        >{limitReached? 'Limit of 20 key results reached' : 'Add another'}</span>
      </Button>
    </div>
  );
};

RepeatComponent.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.array,
  dropdownLabel: PropTypes.string,
  inputLabel: PropTypes.string,
  maxLength: PropTypes.number,
  numericInputLabel: PropTypes.string,
  keyResults: PropTypes.array
};
RepeatComponent.defaultProps = {
  maxLength: 150,
  numericInputLabel: "Max value",
};

export default RepeatComponent;
