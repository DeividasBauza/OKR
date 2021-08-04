import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import './QuarterSwitch.scss'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useDispatch, useSelector } from 'react-redux';
import { selectQuarterData, setQuarterData } from '../../redux/reducers/quarterSwitchSlice';

const QuarterSwitch = () => {

    const year = useSelector(selectQuarterData).year;
    const quarter = useSelector(selectQuarterData).quarter;
    const dispatch = useDispatch();

    const oneUp = () => {
        if (quarter === 4) {
            dispatch(setQuarterData({quarter:1,year:year+1}))
        } else{
            dispatch(setQuarterData({year, quarter:quarter + 1}));
        }
    }
    const oneDown = () => {
        if (quarter === 1) {
            dispatch(setQuarterData({quarter:4, year:year-1}))
        } else {
            dispatch(setQuarterData({year, quarter:quarter - 1}));
        } 
    }

    return (
        <div className="quarter-switch">
            <IconButton 
            onClick={() => oneDown()} className="quarter-switch__button"
            disabled={year<1}
            >
                 <ChevronLeftIcon/>
            </IconButton>
           <div className="quarter-switch__year-quarter"><span>{year} Q{ quarter}</span></div>
             <IconButton 
             onClick={() => oneUp()}  className="quarter-switch__button">
                 <ChevronRightIcon/>
             </IconButton>
        </div>
    )
}
QuarterSwitch.propTypes = {
}

export default QuarterSwitch;