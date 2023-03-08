import React from 'react';
import { Cookies } from 'meteor/ostrio:cookies';
import { UsersCollection } from "../api/UsersCollection";

const cookie = new Cookies();

export class Auth extends React.Component { 

	constructor(props) {
		super(props);
		this.inputUser = this.inputUser.bind(this);
		this.buttonLogin = this.buttonLogin.bind(this);
		this.state = {
			inputsUser: []
		};
	}

	inputUser(key, value) {
		let data = this.state.inputsUser;
		data[key] = value;
		this.setState({inputsUser: data});
	}

	buttonLogin() {
		let check = UsersCollection.find({login: this.state.inputsUser[0], password: this.state.inputsUser[1]}).count();
		if(check == 1) {
			if(this.state.inputsUser[0] == 'admin')
			{
				cookie.set('admin', this.state.inputsUser[0]);
				location.reload();
			}
			else
			{
				cookie.set('user', this.state.inputsUser[0]);
				location.reload();
			}
		} else {
			cookie.remove('user');
			cookie.remove('admin');
			alert(check + " " + "Неправильный логин или пароль");
		}
	}

	render() {
		return <div>
			<input type="text" placeholder="Enter login" onChange={(event) => this.inputUser(0, event.target.value)}/>
			<input type="text" placeholder="Enter password" onChange={(event) => this.inputUser(1, event.target.value)}/>
			<button class="table-button" onClick={this.buttonLogin}>Войти</button>
		</div>
	}
}