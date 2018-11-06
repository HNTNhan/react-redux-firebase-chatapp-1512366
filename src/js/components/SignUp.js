/*import React, { Component } from 'react';
import { Link,  withRouter } from 'react-router-dom';
import { auth } from '../firebase';
import * as firebase from "firebase";
import * as routes from '../constants/routes';

const SignUpPage = ({ history }) =>
    <div className="form">
        <h1>SignUp</h1>
        <SignUpForm history={history} />
    </div>;

const INITIAL_STATE = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
};

const byPropKey = (propertyName, value) => () => ({
    [propertyName]: value,
});

class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE };
    }


    onSubmit = (event) => {
        const {
            username,
            email,
            passwordOne,
        } = this.state;

        const {
            history,
        } = this.props;

        auth.doCreateUserWithEmailAndPassword(email, passwordOne)
            .then(authUser => {
                this.setState({ ...INITIAL_STATE });
                history.push(routes.SUCCESS);
            })
            .catch(error => {
                this.setState(byPropKey('error', error));
            });
        event.preventDefault();
    };


    googleAcount = () => {
        const {
            history,
        } = this.props;

        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            history.push(routes.SUCCESS);
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
        });
    };

    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            error,
        } = this.state;

        const isInvalid =
            passwordOne !== passwordTwo ||
            passwordOne === '' ||
            email === '' ||
            username === '';

        return (
            <div>
                <form onSubmit={this.onSubmit}>
                    <p>Creat new acount</p>
                    <input
                        value={username}
                        onChange={event => this.setState(byPropKey('username', event.target.value))}
                        type="text"
                        placeholder="Full Name"
                    />
                    <br/>
                    <input
                        value={email}
                        onChange={event => this.setState(byPropKey('email', event.target.value))}
                        type="text"
                        placeholder="Email Address"
                    />
                    <br/>
                    <input
                        value={passwordOne}
                        onChange={event => this.setState(byPropKey('passwordOne', event.target.value))}
                        type="password"
                        placeholder="Password"
                    />
                    <br/>
                    <input
                        value={passwordTwo}
                        onChange={event => this.setState(byPropKey('passwordTwo', event.target.value))}
                        type="password"
                        placeholder="Confirm Password"
                    />
                    <br/>
                    <button disabled={isInvalid} type="submit">
                        Sign Up
                    </button>
                    <br/>
                    <p>Sign in with Google</p>
                    <button onClick={() => {this.googleAcount()}}>Google</button>
                    { error && <p>{error.message}</p> }
                </form>
            </div>
        );
    }
}

const SignUpLink = () =>
    <p>
        Don't have an account?
        {' '}
        <Link to={routes.SIGN_UP}>Sign Up</Link>
    </p>

export default withRouter(SignUpPage);

export {
    SignUpForm,
    SignUpLink,
}
*/