import { combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase'
import { AUTH, } from "../constants/action-types";

const initialState = {
    auth: false,
};

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case AUTH:
            return { ...state, auth: action.payload };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    reducers
});

export default rootReducer