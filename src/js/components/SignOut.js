import React, {Component} from 'react';
import connect from "react-redux/es/connect/connect";
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import {auth} from "../actions";
import { Link } from 'react-router-dom';
import * as routes from "../constants/routes";

const mapDispatchToProps = dispatch => {
    return {
        auth: bool => dispatch(auth(bool))
    };
};

class SignOutButton extends Component {
    constructor(props) {
        super(props);
        this.signOut=this.signOut.bind(this);
    }

    signOut(){
        const bool = false;
        this.props.firebase.logout().then(()=>{
            this.props.auth(bool);
            //this.props.history.push(routes.SIGN_IN);
        });
    }

    render() {
        return (
            <button className="navigation_item" onClick={this.signOut}>
                <Link to={routes.LANDING}>Sign Out</Link>
            </button>
        );
    }
}


export default compose(
    firebaseConnect(), // withFirebase can also be used
    connect(null, mapDispatchToProps),
)(SignOutButton)