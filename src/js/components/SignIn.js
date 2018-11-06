import React, { Component } from 'react';
import { connect } from "react-redux";
import * as routes from '../constants/routes';
import { compose } from 'redux'
import { firebaseConnect, isLoaded, isEmpty} from 'react-redux-firebase'
import { Link } from 'react-router-dom';
import {auth} from "../actions";

const mapDispatchToProps = dispatch => {
    return {
        Auth: bool => dispatch(auth(bool))
    };
};

class SignInPage extends Component{
    constructor(props) {
        super(props);
        this.Login = this.Login.bind(this);
    }

    componentWillMount() {
        setTimeout(()=>{
            if(isLoaded(this.props.auth)){
                if(!isEmpty(this.props.auth)){
                    const bool = true;
                    this.props.Auth(bool);
                    this.props.history.push(routes.HOME);
                }
            }
        }, 800)
    }

    Login() {
        const bool = true;
        this.props.firebase.login({provider: 'google', type: 'popup'}).then(()=>{
            this.props.Auth(bool);
            this.props.history.push(routes.HOME);
        });
    }

    render() {
        return (
            <div className="signin page">
                <p>Please Sign In</p>
                <button onClick={this.Login}>Sign In With Google</button>
                <p>Don't have an account?<Link to={routes.LANDING}>{" "}Sign Up</Link> </p>
            </div>
        );
    }
}


export default compose(
    firebaseConnect(), // withFirebase can also be used
    connect(({ firebase: { auth } }) => ({ auth })),
    connect(null, mapDispatchToProps),
)(SignInPage)
