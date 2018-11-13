import React, {Component} from 'react';
import * as routes from "../constants/routes";
import {compose} from "redux";
import {firebaseConnect} from "react-redux-firebase";
import connect from "react-redux/es/connect/connect";

const mapStateToProps = state => {
    return { auth: state.reducers.auth };
};

class Account extends Component {

    componentWillMount() {
        if(!this.props.auth){
            this.props.history.push(routes.SIGN_IN);
        }
    }

    render() {
        return (
            <div className="title">
                <h1>Account</h1>
                <h2> In Progress...</h2>
                <h2>Please come back later.</h2>
            </div>
        );
    }
}

export default compose(
    firebaseConnect(), // withFirebase can also be used
    connect(mapStateToProps)
)(Account)