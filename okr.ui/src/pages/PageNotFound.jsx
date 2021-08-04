import React from 'react'
import ButtonEx from '../components/Button'
import img from '../assets/images/not-found.png'
import '../styles/pages/page-not-found.scss'
import { useHistory } from 'react-router';

const PageNotFound = () => {
    const history = useHistory();
    return (
        <div className="not-found">
            <img src={img} className="not-found__image" alt={img} />
            
                <div className="not-found__buttons">
                    <ButtonEx
                    label="Go Back"
                    color="primary"
                    onClick={()=>{history.goBack()}}
                    />
                    <ButtonEx 
                    color="primary" 
                    label='Navigate To Home Page'
                    onClick={()=>{history.push("/")}}
                    />
                    
                </div>
           
        </div>
    )
}
export default PageNotFound;