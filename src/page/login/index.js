import React from 'react';
import './index.scss';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
    }
    
    handleChange =  (e) => {
        this.props.handleInput(e);
    }

    handleCLick = () => {
        this.props.joinRoom();
    }

	render() {
        const name = this.props.name;
		return (
			<div className="page-login">
				<div className="main">
					<div className="nick-name">
						<div className="label">
							昵称
						</div>
						<div className="input">
							<input
								className="input__inner"
								placeholder="请输入昵称"
								type="text"
								value={name}
								onChange={this.handleChange}
							></input>
						</div>
					</div>
					<div className="button" onClickCapture={this.handleCLick}>
						加入聊天室
					</div>
				</div>
			</div>
		);
	}
}

export default Login;
