import React, {Component} from 'react';
import * as routes from "../constants/routes";
import {compose} from "redux";
import {firebaseConnect, isEmpty, isLoaded} from "react-redux-firebase";
import connect from "react-redux/es/connect/connect";
import {auth} from "../actions";

const mapDispatchToProps = dispatch => {
    return {
        Auth: bool => dispatch(auth(bool))
    };
};
class Landing extends Component {

    componentWillMount() {
        setTimeout(()=>{
            if(isLoaded(this.props.auth)){
                if(!isEmpty(this.props.auth)){
                    const bool = true;
                    this.props.Auth(bool);
                    this.props.history.push(routes.HOME);
                }
            }
        }, 1000)
    }

    render() {
        return (
            <div className="title">
                <img style={{width: 600}} src={require("../../image/landing.png")} alt="landing"/>
            </div>
        );
    }
}

export default compose(
    firebaseConnect(), // withFirebase can also be used
    connect(({ firebase: { auth } }) => ({ auth })),
    connect(null, mapDispatchToProps),
)(Landing)