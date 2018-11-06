import React, {Component} from "react";
import Navigation from './Navigation';
import * as routes from '../constants/routes';
import SignInPage from './SignIn';
import HomePage from './Home';
import AccountPage from './Account';
import LandingPage from  './Landing'
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import connect from "react-redux/es/connect/connect";
import './App.scss'
import {compose} from "redux";

const mapStateToProps = state => {
    return { auth: state.reducers.auth };
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            auth: null
        }
    }

    render() {
        if(this.state.auth !== this.props.auth){
            this.setState({
                auth: this.props.auth
            })
        }
        return (
            <Router>
                <div>
                    <Navigation authUser={this.state.auth} />
                    <Route exact path={routes.SIGN_IN} component={SignInPage} />
                    <Route exact path={routes.HOME} component={HomePage} />
                    <Route exact path={routes.ACCOUNT} component={AccountPage} />
                    <Route exact path={routes.LANDING} component={LandingPage} />
                </div>
            </Router>
        );
    }

}
export default compose(
    connect(mapStateToProps)
)(App)