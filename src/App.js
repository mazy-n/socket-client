import React from 'react';
import io from 'socket.io-client';
import Config from './assets/config/dev.config.json';
import './App.scss';

import Login from './page/login';
import Chat from './page/chat';

const socket = io(Config.socketUrl);


const dataSource = {
	info: {
		isLogin: false,
		count: 0,
		msg: [],
	},
	get(key = null) {
		if(key) {
			return this.info[key];
		}else {
			return this.info;
		}
	},
	set(key, value) {
		this.info[key] = value;
		this.show();
	},
	show: () => {},
	addHandleChange(func) {
		this.show = func;
	},
	removeHandleChange() {
		this.show = () => {};
	}
};

socket.on('connect', () => {		// 连接远程服务器，并无登录
	console.log('已连接服务器');
});

socket.on('disconnect', () => {		// 断开连接
	console.log('断开连接');
});

socket.on('online', res => {		// 获取登录离开用户
	console.log(res);
	if(res.status === 200) {
		const tip = {...res.result.datas, isMessage: false};
		const arr = [...dataSource.get('msg'), tip];
		dataSource.set('msg', arr);
		dataSource.set('count', res.result.count);
	}
});

socket.on('res', res => {			// 获取消息
	console.log(res);
	if(res.code === 1) {
		dataSource.set('isLogin', true);
	}else if(res.status === 200) {
		const message = res.result;
		const arr = [...dataSource.get('msg'), message];
		dataSource.set('msg', arr);
	}
});

class App extends React.Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			name: '',
			text: '',
			info: dataSource.get() || {}
		};
	}

	componentDidMount() {
		dataSource.addHandleChange(this.handleChange);
	}

	componentWillUnmount() {
		dataSource.removeHandleChange();
	}

	handleChange() {
		// 当数据源更新时，更新组件状态
		this.setState({
			info: dataSource.get() || {}
		});
	}

	handleInput = event => {
		this.setState({ name: event.target.value });
	};

	handleInputText = text => {
		this.setState({ text });
	};

	joinRoom = () => {
		const name = this.state.name.trim();
		if(!name) return;
		socket.emit('chat', name);
	};

	sendMessage = () => {
		const message = {
			name: this.state.name,
			message: this.state.text,
			isMessage: true
		};
		socket.emit('message', message);
		this.setState({ text: '' });
	};

	render() {
		const isLogin = this.state.info.isLogin || false;
		return (
			<div className="App">
				{isLogin
					? 	<Chat
							count={this.state.info.count}
							handleInputText={this.handleInputText}
							sendMessage={this.sendMessage}
							name={this.state.name}
							messageArr={this.state.info.msg}
						></Chat>
					: 	<Login
							name={this.state.name}
							handleInput={this.handleInput}
							joinRoom={this.joinRoom}
						></Login>
				}				
			</div>
		);
	}
}

export default App;
