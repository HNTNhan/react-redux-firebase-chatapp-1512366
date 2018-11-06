import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import SignOutButton from './SignOut';
import * as routes from '../constants/routes';

class Navigation extends  Component  {
    render() {
        let navigation = [];
        if(this.props.authUser) {
            navigation = <NavigationAuth />
        }
        else {
            navigation = <NavigationNonAuth />
        }
        return (
            <div>
                { navigation }
            </div>

        );
    }
}

const NavigationAuth = () =>
    <div className="navigation">
        <button className="navigation_item"><Link to={routes.HOME}>Home</Link></button>
        <button className="navigation_item"><Link to={routes.ACCOUNT}>Account</Link></button>
        <SignOutButton />
    </div>;
const NavigationNonAuth = () =>
    <div className="navigation">
        <button className="navigation_item"><Link to={routes.LANDING}>Landing</Link></button>
        <button className="navigation_item"><Link to={routes.SIGN_IN}>Sign In</Link></button>
    </div>;

export default Navigation;