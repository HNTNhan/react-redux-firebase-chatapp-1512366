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
            chatBetween: "",
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
        let chatBetween;
        const messages = {
            content: document.getElementById("message-to-send").value,
        };
        document.getElementById("message-to-send").value = "";
        chatBetween = "messages/" + this.state.chatBetween;
        this.props.firebase.pushWithMeta(chatBetween, messages);
    }

    selectToChat(key) {
        for(let i = 0; i < this.props.users.length; i++) {
            if(this.props.users[i].key === key.key) {
                let chatBetween = "";
                for(let j =0; j < this.props.auth.uid.length; j++) {
                    if(this.props.auth.uid[j] < this.props.users[i].key[j]) {
                        chatBetween = this.props.auth.uid + "-" + this.props.users[i].key;
                        break;
                    }
                    else if(this.props.auth.uid[j] > this.props.users[i].key[j]) {
                        chatBetween = this.props.users[i].key + "-" + this.props.auth.uid;
                        break;
                    }
                }
                if(chatBetween === "") chatBetween = this.props.auth.uid + "-" + this.props.users[i].key;
                this.setState({
                    chatBetween: chatBetween,
                    chatWith: this.props.users[i]
                });
                break;
            }
        }
    }
    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    };

    componentDidUpdate() {
        if(!this.state.chatWith) return;
        this.scrollToBottom();
    }

    render() {
        let users = [];
        let user;
        let messagehistory = [];
        let chatWith = <div className="chat-header clearfix"> </div>;
        if(isLoaded(this.props.users && this.props.presence && this.props.messages)){
            if(!isEmpty(this.props.users && this.props.presence && this.props.messages)) {
                for(let i = 0; i < this.props.users.length; i++) {
                    this.props.users[i] = Object.assign(this.props.users[i], {status: "offline"});
                    if(this.props.users[i].key === this.props.auth.uid) {
                        this.props.users[i].status = "me";
                        user = this.props.users[i];
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


        if(this.state.chatWith !== null) {
            chatWith= <div className="chat-header clearfix">
                <img className="avatar"
                     src={this.state.chatWith.value.avatarUrl}
                     alt="avatar"/>
                <div className="chat-about">
                    <div className="chat-with">Chat with {this.state.chatWith.value.displayName}</div>
                </div>
                <i className="fa fa-star"/>
            </div>;
            let message_id = [];
            let stt_message;
            for(let i = 0; i < this.props.messages.length; i++) {
                if(this.props.messages[i].key === this.state.chatBetween) {
                    stt_message = i;
                    Object.keys(this.props.messages[i].value).map(
                        (key) =>  message_id = message_id.concat(key)
                    );
                    break;
                }
            }
            for(let i = (message_id.length>20) ? message_id.length-20: 0; i < message_id.length; i++) {
                if(messagehistory.length >= 20) break;
                const timestamp = this.props.messages[stt_message].value[message_id[i]].createdAt;
                if(this.props.messages[stt_message].value[message_id[i]].createdBy === this.props.auth.uid)
                {
                    messagehistory = messagehistory.concat(
                        <li className="clearfix" key={i}>
                            <div className="message-data align-right">
                            <span className="message-data-time">
                                {
                                    new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit',  minute: '2-digit', second: '2-digit' }).format(timestamp)
                                }
                            </span> &nbsp; &nbsp;
                                <span className="message-data-name">{user.value.displayName}</span> <i
                                className="fa fa-circle me"/>
                            </div>
                            <div className="message other-message float-right">
                                {this.props.messages[stt_message].value[message_id[i]].content}
                            </div>
                        </li>
                    )
                }
                else {
                    messagehistory = messagehistory.concat(
                        <li key={i}>
                            <div className="message-data">
                                <span className="message-data-name"><i className="fa fa-circle online"/>
                                    {this.state.chatWith.value.displayName}
                                </span>
                                <span className="message-data-time">
                                    {
                                        new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit',
                                            hour: '2-digit',  minute: '2-digit', second: '2-digit' }).format(timestamp)
                                    }
                                </span>
                            </div>
                            <div className="message my-message">
                                {this.props.messages[stt_message].value[message_id[i]].content}
                            </div>
                        </li>
                    )
                }

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
                                {messagehistory}
                            </ul>
                        </div>
                            {
                                (this.state.chatWith) ?
                                    <div className="chat-message clearfix" ref={(el) => { this.messagesEnd = el; }}>
                                        <textarea name="message-to-send" id="message-to-send" placeholder="Type your message" rows="3"/>
                                        <i className="fa fa-file-o"/> &nbsp;&nbsp;&nbsp;
                                        <i className="fa fa-file-image-o"/>
                                        <button className="send" onClick={this.sendMessage}>Send</button>
                                    </div>:
                                    <div className="chat-message clearfix" ref={(el) => { this.messagesEnd = el; }}>  </div>

                            }

                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    firebaseConnect([
        'presence',  'users', 'messages'
    ]),
    connect(({ firebase: { auth } }) => ({ auth })),
    connect((state) => ({
        withFirebase,
        presence: state.firebase.ordered.presence,// profile: state.firebase.profile // load profile
        users: state.firebase.ordered.users,
        messages: state.firebase.ordered.messages,
    })),
    connect(mapStateToProps),
)(Homepage)