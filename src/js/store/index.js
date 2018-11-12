import rootReducer from "../reducers/index";
import { createStore, compose } from 'redux'
import { reactReduxFirebase } from 'react-redux-firebase'
import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDqGxFDw75yK9pmpFucnuP0C0Y7RJx4On8",
    authDomain: "react-redux-firebase-1512366.firebaseapp.com",
    databaseURL: "https://react-redux-firebase-1512366.firebaseio.com",
    projectId: "react-redux-firebase-1512366",
    storageBucket: "react-redux-firebase-1512366.appspot.com",
    messagingSenderId: "23295064084"
};
firebase.initializeApp(firebaseConfig);

const config = {
    userProfile: 'users',
    //enableLogging: false,
    presence: 'presence',
    sessions: 'sessions'
};

const createStoreWithFirebase = compose(
    reactReduxFirebase(firebase, config)
)(createStore);

const store = createStoreWithFirebase(rootReducer);
export default store;
