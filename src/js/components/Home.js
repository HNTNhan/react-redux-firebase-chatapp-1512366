import React, {Component} from 'react';
import {compose} from "redux";
import {withFirebase, firebaseConnect, isLoaded, isEmpty} from "react-redux-firebase";
import connect from "react-redux/es/connect/connect";
import * as routes from "../constants/routes";

const mapStateToProps = state => {
    return { Auth: state.reducers.auth };
};

class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            chatWith: null,
        };
        this.sendMessage =this.sendMessage.bind(this);
        this.selectToChat = this.selectToChat.bind(this);
    }

    componentWillMount() {
        if(!this.props.Auth){
            this.props.history.push(routes.SIGN_IN);
        }
        this.setState({
            users: this.props.users
        });
    }

    sendMessage() {
        
    }

    selectToChat(key) {
        for(let i = 0; i < this.props.users.length; i++) {
            if(this.props.users[i].key === key.key) {
                this.setState({
                    chatWith: this.props.users[i]
                });
                break;
            }
        }
    }

    render() {
        let users = [];
        let chatWith = <div className="chat-header clearfix"> </div>;
        if(this.state.chatWith !== null) {
            chatWith= <div className="chat-header clearfix">
                <img className="avatar"
                     src={this.state.chatWith.value.avatarUrl}
                     alt="avatar"/>
                <div className="chat-about">
                    <div className="chat-with">Chat with {this.state.chatWith.value.displayName}</div>
                    <div className="chat-num-messages">already 1 902 messages</div>
                </div>
                <i className="fa fa-star"/>
            </div>;
        }
        if(isLoaded(this.props.users && this.props.presence)){
            if(!isEmpty(this.props.users && this.props.presence)) {
                for(let i = 0; i < this.props.users.length; i++) {
                    this.props.users[i] = Object.assign(this.props.users[i], {status: "offline"});
                    if(this.props.users[i].key === this.props.presence[0].key) {
                        this.props.users[i].status = "me";
                        continue;
                    }
                    for(let j = 0; j < this.props.presence.length; j++) {
                        if(this.props.presence[j].key === this.props.users[i].key)
                            this.props.users[i].status = "online";
                    }
                }
                this.props.users.map((key) => (
                        users = users.concat(
                            <button
                                className="button-list"
                                key={key.key}
                                onClick={() => this.selectToChat(key)}>
                                <li className="clearfix">
                                    <img className="avatar"
                                         src={key.value.avatarUrl}
                                         alt="avatar"/>
                                    <div className="about">
                                        <div className="name">{key.value.displayName}</div>
                                        <div className={key.status}>
                                            <i className="fa fa-circle online"/> {key.status}
                                        </div>
                                    </div>
                                </li>
                            </button>
                        )
                    )
                );
            }
        }

        return (
            <div>
                <div className="container clearfix">
                    <div className="people-list" id="people-list">
                        <div className="search">
                            <input type="text" placeholder="search"/>
                            <i className="fa fa-search"/>
                        </div>
                        <ul className="list">
                            {users}
                        </ul>
                    </div>

                    <div className="chat">
                        {chatWith}
                        <div className="chat-history">
                            <ul>
                                <li className="clearfix">
                                    <div className="message-data align-right">
                                        <span className="message-data-time">10:10 AM, Today</span> &nbsp; &nbsp;
                                        <span className="message-data-name">Olia</span> <i
                                        className="fa fa-circle me"/>

                                    </div>
                                    <div className="message other-message float-right">
                                        Hi Vincent, how are you? How is the project coming along?
                                    </div>
                                </li>

                                <li>
                                    <div className="message-data">
                                        <span className="message-data-name"><i className="fa fa-circle online"/> Vincent</span>
                                        <span className="message-data-time">10:12 AM, Today</span>
                                    </div>
                                    <div className="message my-message">
                                        Are we meeting today? Project has been already finished and I have results to
                                        show you.
                                    </div>
                                </li>

                                <li className="clearfix">
                                    <div className="message-data align-right">
                                        <span className="message-data-time">10:14 AM, Today</span> &nbsp; &nbsp;
                                        <span className="message-data-name">Olia</span> <i
                                        className="fa fa-circle me"/>

                                    </div>
                                    <div className="message other-message float-right">
                                        Well I am not sure. The rest of the team is not here yet. Maybe in an hour or
                                        so? Have you faced any problems at the last phase of the project?
                                    </div>
                                </li>

                                <li>
                                    <div className="message-data">
                                        <span className="message-data-name"><i className="fa fa-circle online"/> Vincent</span>
                                        <span className="message-data-time">10:20 AM, Today</span>
                                    </div>
                                    <div className="message my-message">
                                        Actually everything was fine. I'm very excited to show this to our team.
                                    </div>
                                </li>

                                <li>
                                    <div className="message-data">
                                        <span className="message-data-name"><i className="fa fa-circle online"/> Vincent</span>
                                        <span className="message-data-time">10:31 AM, Today</span>
                                    </div>
                                    <i className="fa fa-circle online"/>
                                    <i className="fa fa-circle online" style={{color: "#AED2A6"}}/>
                                    <i className="fa fa-circle online" style={{color: "#AED2A6"}}/>
                                </li>

                            </ul>

                        </div>

                        <div className="chat-message clearfix">
                            <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3"/>
                            <i className="fa fa-file-o"/> &nbsp;&nbsp;&nbsp;
                            <i className="fa fa-file-image-o"/>
                            <button className="send" onClick={this.sendMessage}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    firebaseConnect([
        'presence',  'users'
    ]),
    connect(({ firebase: { auth } }) => ({ auth })),
    connect((state) => ({
        withFirebase,
        presence: state.firebase.ordered.presence,// profile: state.firebase.profile // load profile
        users: state.firebase.ordered.users,
    })),
    connect(mapStateToProps),
)(Homepage)