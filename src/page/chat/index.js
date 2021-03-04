import React from 'react';
import './index.scss';

function Card(props) {
    return (
        <div className={'card '+ props.className}>
            <div className="name">
                {props.info.name}
            </div>
            <div className="message">
                {props.info.message}
            </div>
        </div>
    );
}

function Tip(props) {
    return (
        <div className="tip">
            <div className="text">
                <span className={"name "+ (props.info.isOnline ? '' : 'offline-name')}>
                    {props.info.name}
                </span>
                <span>{props.info.isOnline ? '进入' : '离开'}</span>聊天室
            </div>
        </div>
    );
}

class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            arr: [],
            message: ''
        };
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    }

    clearInput = () => {
        this.inputEl.innerText = '';
        this.setState({ message: '' });
        this.inputEl.focus();
    }
    
    handleChange =  (e) => {
        const message = e.target.innerText.trim();
        this.setState({ message });
        this.props.handleInputText(message);
    }

    handleCLick = () => {
        this.props.sendMessage();
        this.clearInput();
    }

    componentDidMount() {
        this.scrollToBottom();
    }
      
    componentDidUpdate() {
        this.scrollToBottom();
    }

	render() {
		return (
			<div className="page-chat">
				<div className="header">
                    聊天室({this.props.count})
                </div>
                <div className="main">
                    <div className="message-list">
                        {this.props.messageArr.map((v, index) => (
                            v.isMessage 
                            ?   <Card className={v.name === this.props.name ? 'isMe' : ''} info={v} key={index}></Card>
                            :   <Tip info={v} key={index}></Tip>
                        ))}
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div className="send-box">
                        <div className="input"
                            contentEditable="plaintext-only"
                            onInputCapture={this.handleChange}
                            ref={(el) => { this.inputEl = el; }}
                            ></div>
                        {this.state.message.length > 0 
                            ? <div className="btn" onClickCapture={this.handleCLick}>发送</div>
                            : null
                        }  
                    </div>
                </div>
			</div>
		);
	}
}

export default Chat;
