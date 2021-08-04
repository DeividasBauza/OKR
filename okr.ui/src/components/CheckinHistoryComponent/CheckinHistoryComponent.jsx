import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { selectHistoryModalState } from '../../redux/reducers/checkinHistorySlice';
import IconButton from '@material-ui/core/IconButton'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import './CheckinHistoryComponent.scss'
import { selectObjectiveWithHistory } from '../../redux/reducers/objectiveSlice';

const CheckinHistoryComponent = () => {
    const objectiveWithHistory = useSelector(selectObjectiveWithHistory);
    const [sortedHistory, setSortedHistory] = useState([]);
    const isModal = useSelector(selectHistoryModalState);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const sort = () => {
            const historyCopy = [...objectiveWithHistory.checkInHistory];
            const sortedArray = [...historyCopy.sort((a, b) => new Date(a.checkinDate) - new Date(b.checkinDate))];
            setSortedHistory([...sortedArray])
            setIndex(sortedArray.length - 1);
        }
        if (objectiveWithHistory.checkInHistory) {
            sort();
        }
    }, [objectiveWithHistory]);

    const handleBack = () => {
        setIndex(index - 1);
    }
    const handleForward = () => {
        setIndex(index + 1);
    }

    const getOnTrack = (onTrack) => {
        return onTrack ? "On track" : "Off track";
    }
    return (
        <>
            {sortedHistory.length > 0 && <div className="history-container" style={{ borderRadius: `${isModal ? "0" : "10px"}` }}>
                <div className={`history-container__switch ${isModal ? 'history-container__modal' : ''}`}>
                    <IconButton
                        onClick={() => handleBack()}
                        style={{ visibility: `${index === 0 ? 'hidden' : 'visible'}` }}>
                        <ChevronLeftIcon
                            style={{ fontSize: "40px", color: "white" }}
                        />
                    </IconButton>
                    <div className="history-container__switch__header">{new Date(sortedHistory[index].checkInDate).toLocaleDateString('en-US')}</div>
                    <IconButton
                        style={{ visibility: `${index === sortedHistory.length - 1 ? 'hidden' : 'visible'}` }}
                        onClick={() => handleForward()}
                    >
                        <ChevronRightIcon
                            style={{ fontSize: "40px", color: "white" }} />
                    </IconButton>
                </div>
                <div className="history-container__results">
                    {isModal && <h3 className="history-container__description">{objectiveWithHistory.description}</h3>}
                    {sortedHistory[index].contentObject.values.map((result) => {
                        const postFix = result.type === "Percentage" ? "%" : "";
                        const value = result.type === "Completion" ? result.value === 0 ? 'Incomplete' : 'Complete' : `${result.value}${postFix}`
                        return (
                            <React.Fragment key={Math.random()}>
                                <div className="history-container__results__item" key={Math.random()}>
                                    <span style={{ fontWeight: 500 }}>{result.description}</span>
                                </div>
                                <div className="history-container__results__item">
                                    <span className="bold">Set to:</span> <span style={{ color: "#ff3454", fontWeight: "bold" }}>{value}</span>
                                </div>
                            </React.Fragment>
                        )
                    })}
                    {sortedHistory[index].contentObject.onTrack !== null &&
                        <div className="history-container__results__item" style={{ paddingBottom: "20px" }}>
                            <span className="bold">Marked as:</span> <span style={{ color: "#ff3454", fontWeight: "bold" }}>{getOnTrack(sortedHistory[index].contentObject.onTrack)}</span>
                        </div>}
                    {sortedHistory[index].message && <div className="history-container__results__item">
                    <span className="bold">Message:</span> <span style={{ paddingBottom: "20px" }}>{sortedHistory[index].message}</span>
                    </div>}

                </div>

            </div>}
            {!sortedHistory.length && <div className="history-container" style={{ borderRadius: `${isModal ? "0" : "10px"}` }}>
                <div className={`history-container__switch ${isModal ? 'history-container__modal' : ''}`}>
                    <div className="history-container__switch__header">No history</div>
                </div>
                <div className="history-container__results">
                    <div className="history-container__results__item" style={{ paddingBottom: "20px", textAlign: "center" }}>
                        This objective has no history records
                        </div>
                </div>
            </div>}
        </>
    )
}
export default React.memo(CheckinHistoryComponent);