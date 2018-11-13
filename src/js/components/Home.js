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
            search: "",
            chatWith: null,
            chatBetween: "",
        };
        this.sendMessage =this.sendMessage.bind(this);
        this.selectToChat = this.selectToChat.bind(this);
        this.searchUser = this.searchUser.bind(this);
        this.star = this.star.bind(this);
    }

    componentWillMount() {
        if(!this.props.Auth){
            this.props.history.push(routes.SIGN_IN);
        }
    }

    star(id) {
        let star_user = [];
        for(let i = 0; i < this.props.users.length; i++) {
            if (this.props.users[i].star === true) star_user = star_user.concat(this.props.users[i].key);
        }
        const link_star = "star/" + this.props.auth.uid;
        for (let i =0; i < star_user.length; i++) {
            if(star_user[i] === this.props.users[id].key) {
                star_user.splice(i, 1);
                this.props.firebase.push(link_star, star_user);
                this.props.users[id].star = false;
                if(star_user.length === 0) this.props.firebase.push(link_star, "");
                return
            }
        }
        this.props.users[id].star = true;
        star_user = star_user.concat(this.props.users[id].key);
        this.props.firebase.push(link_star, star_user);
        //this.forceUpdate();
    }

    searchUser(event) {
        const search = event.target.value;
        this.setState({
            search: search
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
                document.getElementById("search").value = "";
                this.setState({
                    search: "",
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
        let historymessage = [];
        let chatWith = <div className="chat-header clearfix"> </div>;
        if(isLoaded(this.props.users && this.props.presence && this.props.messages && this.props.star)){
            if(!isEmpty(this.props.users && this.props.presence && this.props.messages && this.props.star)) {
                let ids;
                let stars;
                for (let i = 0; i < this.props.star.length; i++) {
                    if(this.props.star[i].key === this.props.auth.uid) {
                        ids = Object.keys(this.props.star[i].value);
                        stars = this.props.star[i].value[ids[ids.length-1]];
                        break;
                    }
                }

                for(let i = 0; i < this.props.users.length; i++) {
                    this.props.users[i] = Object.assign(this.props.users[i], {status: "offline", star: false});
                    for(let j = 0; j < stars.length; j++) {
                        if(this.props.users[i].key === stars[j]) {
                            this.props.users[i].star = true;
                            break;
                        }
                    }
                    if(this.props.users[i].key === this.props.auth.uid) {
                        this.props.users[i].status = "me";
                        user = this.props.users[i];
                        continue;
                    }
                    for(let j = 0; j < this.props.presence.length; j++) {
                        if(this.props.presence[j].key === this.props.users[i].key){
                            this.props.users[i].status = "online";
                            break;
                        }
                    }
                }

                //Sap xep people list
                let people_list = [];
                //Dua doi tuong chua id va thoi gian chat vao people_list
                for(let j = 0; j < this.props.messages.length; j++) {
                    const id = this.props.messages[j].key.split("-");
                    if(this.props.auth.uid === id[0]) {
                        let tmessage_id = Object.keys(this.props.messages[j].value);
                        const people = {
                            id:  id[1],
                            createdAt: this.props.messages[j].value[tmessage_id[tmessage_id.length-1]].createdAt,
                        };
                        people_list = people_list.concat(people);
                    }
                    else if (this.props.auth.uid === id[1]) {
                        let tmessage_id = Object.keys(this.props.messages[j].value);
                        const people = {
                            id:  id[0],
                            createdAt: this.props.messages[j].value[tmessage_id[tmessage_id.length-1]].createdAt,
                        };
                        people_list = people_list.concat(people);
                    }
                }
                //Sap xep list theo thoi gian
                for(let i = 0; i < people_list.length - 1; i++) {
                    for(let j = i + 1; j < people_list.length; j++) {
                        if(people_list[j].createdAt > people_list[i].createdAt) {
                            const temp = people_list[i];
                            people_list[i] = people_list[j];
                            people_list[j] = temp;
                        }
                    }
                }
                let numberstar = 0;
                //Sap xep cac nguoi dung co star len dau
                for(let i = 0; i < this.props.users.length; i++) {
                    if(this.props.users[i].star === true) { numberstar++; continue; }
                    for(let j = i + 1; j < this.props.users.length; j++) {
                        if(this.props.users[j].star === true) {
                            numberstar++;
                            const temp = this.props.users[j];
                            this.props.users[j] = this.props.users[i];
                            this.props.users[i] = temp;
                            break;
                        }
                    }
                }

                let vt = 0;
                //Sap xep danh sap nguoi dung danh sach cac doi tuong da tao.
                for(let i = 0; i < people_list.length - 1; i++) {
                    for(let j = vt; j < numberstar; j++) {
                        if(this.props.users[j].key === people_list[i].id) {
                            const temp = this.props.users[j];
                            this.props.users[j] = this.props.users[vt];
                            this.props.users[vt] = temp;
                            vt++;
                            break;
                        }
                    }
                }
                
                vt = numberstar;
                for(let i = 0; i < people_list.length; i++) {
                    for(let j = vt; j < this.props.users.length; j++) {
                        if(this.props.users[j].key === people_list[i].id) {
                            const temp = this.props.users[j];
                            this.props.users[j] = this.props.users[vt];
                            this.props.users[vt] = temp;
                            vt++;
                            break;
                        }
                    }
                }



                //tao people list
                this.props.users.map((key, id) => (
                    (this.state.search==="") ?
                        users = users.concat(
                            <div key={key.key}>
                                <button
                                    className="button-list"
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
                                <img className="image-star"
                                     src={(key.star) ? require("../../image/Star Filled.png"): require("../../image/Star.png")}
                                     alt="star"
                                     onClick={()=>this.star(id)}
                                />
                            </div>
                        ) :
                        (key.value.displayName.indexOf(this.state.search) === -1)? "" :
                        users = users.concat(
                            <div key={key.key}>
                                <button
                                    className="button-list"
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
                                <img className="image-star"
                                     src={(key.star) ? require("../../image/Star Filled.png"): require("../../image/Star.png")}
                                     alt="star"
                                     onClick={()=>this.star(id)}
                                />
                            </div>
                        )
                    )
                );
            }
        }

        if(this.state.chatWith !== null) {
            // tao thong tin nguoi chat
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

            //tao history message
            for(let i = (message_id.length>50) ? message_id.length-50: 0; i < message_id.length; i++) {
                if(historymessage.length >= 50) break;
                const timestamp = this.props.messages[stt_message].value[message_id[i]].createdAt;
                if(this.props.messages[stt_message].value[message_id[i]].createdBy === this.props.auth.uid)
                {
                    historymessage = historymessage.concat(
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
                    historymessage = historymessage.concat(
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
                            <input type="text"
                                   placeholder="search"
                                   name="search"
                                   id="search"
                                   onChange={this.searchUser}/>
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
                                {historymessage}
                            </ul>
                            <div ref={(el) => { this.messagesEnd = el; }}> </div>
                        </div>
                            {
                                (this.state.chatWith) ?
                                    <div className="chat-message clearfix">
                                        <textarea name="message-to-send" id="message-to-send"
                                                  placeholder="Type your message" rows="2"/>
                                        <i className="fa fa-file-o"/> &nbsp;&nbsp;&nbsp;
                                        <i className="fa fa-file-image-o"/>
                                        <button className="send" onClick={this.sendMessage}>Send</button>
                                    </div>:
                                    <div className="chat-message clearfix">  </div>
                            }
                    </div>
                </div>
            </div>
        );
    }
}

export default compose(
    firebaseConnect([
        'presence',  'users', 'messages', 'star'
    ]),
    connect(({ firebase: { auth } }) => ({ auth })),
    connect((state) => ({
        withFirebase,
        presence: state.firebase.ordered.presence,// profile: state.firebase.profile // load profile
        users: state.firebase.ordered.users,
        messages: state.firebase.ordered.messages,
        star: state.firebase.ordered.star,
    })),
    connect(mapStateToProps),
)(Homepage)