import { compose, createStore } from '@reduxjs/toolkit';
import { applyMiddleware} from 'redux'
import rootReducer from '../redux/rootReducer'
import reduxImutableStateInvariant from "redux-immutable-state-invariant";
import thunk from 'redux-thunk'

export default function configureStore(initialState){
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk, reduxImutableStateInvariant()))
  );
}

