import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from "@material-ui/core/InputAdornment";
import PropTypes from 'prop-types'
import './SearchComponent.scss'
import { selectAzureUsers} from '../../redux/reducers/userSlice';
import { useSelector } from 'react-redux'

const SearchComponent = ({onChange}) => {
    const [searchValue, setSearchValue] = useState('');
    const [autocomplete, setAutocomplete] = useState(false);
    const users = useSelector(selectAzureUsers);

    const handleSelect = (option) => {
        onChange(option);
        setSearchValue(option.displayName);
        setAutocomplete(false)
    }
    const handleChange = (event) => {
        setSearchValue(event.target.value)
        if (event.target.value === '') {
            setAutocomplete(false)
        } else {
            setAutocomplete(true)
        }
    }

    const handleBlur = () => {
        setTimeout(() => {
            setAutocomplete(false);
        }, 300)
    }

    const handleClick = () => {
        if (searchValue !== '') {
            setAutocomplete(true)
        }
    }

    return (
        <div className="autocomplete">
            <TextField className="autocomplete__search-field"
                variant="outlined"
                placeholder="Search for a person"
                value={searchValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onClick={handleClick}
                size="small"
                InputProps={{
                    endAdornment: (
                        <InputAdornment >
                            <SearchIcon />
                        </InputAdornment>
                    )
                }}
            />
            <div className="autocomplete__items">
                {autocomplete && searchValue !== '' &&
                    users.filter((option) => {
                        const targetString = option.displayName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                        return targetString.includes(searchValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
                    }).map((option) =>
                    (
                        <div className="autocomplete__item"
                            key={option.id}
                            onClick={() => { handleSelect(option) }}
                        >
                            <div className="autocomplete__item__name">{option.displayName}</div>
                        </div>
                    )
                    )}
            </div>
        </div>
    )
}
SearchComponent.propTypes = {
    onChange: PropTypes.func,
}

export default SearchComponent;


