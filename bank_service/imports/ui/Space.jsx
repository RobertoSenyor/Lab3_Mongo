import React from 'react';
import { Cookies } from 'meteor/ostrio:cookies';
import { useTracker } from 'meteor/react-meteor-data';
import { BankAccountCollection } from "../api/BankAccountCollection";
import { ClientCollection } from '../api/ClientCollection';
import { DepositCollection } from '../api/DepositCollection';
import { HomeCollection } from '../api/HomeCollection';
import { UsersCollection } from "../api/UsersCollection";

const cookie = new Cookies();

export class Space extends React.Component {

	constructor(props) 
	{
		super(props);

		this.bankaccountButton = this.bankaccountButton.bind(this);
		this.clientButton = this.clientButton.bind(this);
		this.depositButton = this.depositButton.bind(this);
		this.homeButton = this.homeButton.bind(this);
		this.usersButton = this.usersButton.bind(this);
	
		this.buttonPrev = this.buttonPrev.bind(this);
		this.buttonNext = this.buttonNext.bind(this);
		this.buttonInsert = this.buttonInsert.bind(this);
		this.buttonDelete = this.buttonDelete.bind(this);
		this.buttonUpdate = this.buttonUpdate.bind(this);
		
		this.buttonLogout = this.buttonLogout.bind(this);
		this.inputInsert = this.inputInsert.bind(this);
		this.inputUpdate = this.inputUpdate.bind(this);

		this.state = {
			reset: true,
			columns: [],
			countRows: 0,
			table: "",
			page: 1,
			countObjectOnPage: 5,
			inputsInsert: [],
			inputsUpdate: []
		};
	}

	bankaccountButton() {
		this.setState({columns : ["N","client", "deposit", "number_of_account", "date_open", "date_close", "money_sum"]});
		this.setState({countRows : BankAccountCollection.find().count()});
		this.setState({table : "bankaccount"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	clientButton() {
		this.setState({columns : ["N", "name", "surname", "fathername", "serial_of_passport", "number_of_passport", "telephone", "address"]});
		this.setState({countRows : ClientCollection.find().count()});
		this.setState({table : "client"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	depositButton() {
		this.setState({columns : ["N", "name_of_deposit", "storage_time", "interest_rate"]});
		this.setState({countRows : DepositCollection.find().count()});
		this.setState({table : "deposit"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	homeButton() {
		this.setState({columns : ["N", "address", "number_of_flat"]});
		this.setState({countRows : HomeCollection.find().count()});
		this.setState({table : "home"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	usersButton() {
		this.setState({columns : ["N", "login", "password"]});
		this.setState({countRows : UsersCollection.find().count()});
		this.setState({table : "users"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	buttonPrev() {
		if(this.state.page > 1) {
			let v =  this.state.page - 1;
			this.setState({page : v--});
		}
	}

	buttonNext() {
		let maxPage = parseInt(this.state.countRows % this.state.countObjectOnPage == 0 ? this.state.countRows / this.state.countObjectOnPage : this.state.countRows / this.state.countObjectOnPage + 1);
		if(this.state.page < maxPage) {
			let v =  this.state.page + 1;
			this.setState({page : v++});
		}
	}

	buttonInsert() {
		let data = this.state.inputsInsert;
		let check = true;
		if(this.state.table == "bankaccount") {
		
			BankAccountCollection.insert({
				number_of_account: data[0],
				date_open: data[1],
				date_close: data[2],
				money_sum: data[3],
				client_id: data[4],
				deposit_id: data[5]
			});
			this.setState({countRows : BankAccountCollection.find().count()});
		}
		if(this.state.table == "client") {
			let homeFK = HomeCollection.find({address: data[6]}).fetch()[0]['address'];
			
			ClientCollection.insert({
				name: data[0],
				surname: data[1],
				fathername: data[2],
				serial_of_passport: data[3],
				number_of_passport: data[4],
				telephone: data[5],
				address_id: homeFK
			});
			this.setState({countRows : ClientCollection.find().count()});
		}
		if(this.state.table == "deposit") {
			DepositCollection.insert({
				name_of_deposit: data[0],
				storage_time: data[1],
				interest_rate: data[2]
			});
			this.setState({countRows : DepositCollection.find().count()});
		}
		if(this.state.table == "home") {
			HomeCollection.insert({
				address: data[0],
				number_of_flat: data[1]
			});
			this.setState({countRows : HomeCollection.find().count()});
		}
		if(this.state.table == "users") {
    		UsersCollection.insert({
				login: data[0],
				password: data[1]
			});
			this.setState({countRows : UsersCollection.find().count()});
		}
	}

	buttonDelete(id) {
		let id2;
		if(this.state.table == "bankaccount") {
			id2 = BankAccountCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		BankAccountCollection.remove(id2);
    		this.setState({countRows : BankAccountCollection.find().count()});
		}
		if(this.state.table == "client") {
			id2 = ClientCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
			BankAccountCollection.find({client_id: BankAccountCollection.find({_id: id2})}).map(function(res) {
				BankAccountCollection.remove(res._id);
			});
    		ClientCollection.remove(id2);
    		this.setState({countRows : ClientCollection.find().count()});
		}
		if(this.state.table == "deposit") {
			id2 = DepositCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
			BankAccountCollection.find({deposit_id: DepositCollection.find({_id: id2})}).map(function(res) {
				BankAccountCollection.remove(res._id);
			});
    		DepositCollection.remove(id2);
    		this.setState({countRows : DepositCollection.find().count()});
		}
		if(this.state.table == "home") {
			id2 = HomeCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		HomeCollection.remove(id2);
    		this.setState({countRows : HomeCollection.find().count()});
		}
		if(this.state.table == "users") {
			id++;
			id2 = UsersCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		UsersCollection.remove(id2);
    		this.setState({countRows : UsersCollection.find().count()});
		}
    	let maxPage = parseInt((this.state.countRows - 1) % this.state.countObjectOnPage == 0 ? (this.state.countRows - 1) / this.state.countObjectOnPage : (this.state.countRows - 1) / this.state.countObjectOnPage + 1);
    	if(this.state.page > maxPage) {
    		let page = this.state.page - 1;
    		this.setState({page : page});
    	}
	}

	buttonUpdate(id) {
		let id2;
		let data = this.state.inputsUpdate;
		if(this.state.table == "bankaccount") {
			id2 = BankAccountCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
			let clientFK = ClientCollection.find({number_of_passport: data[4]}).fetch()[0]['number_of_passport'];
			let depositFK = DepositCollection.find({name_of_deposit: data[5]}).fetch()[0]['name_of_deposit'];
    		
    		if(data[0] != undefined) {
    			BankAccountCollection.update({_id : id2},{$set:{number_of_account : data[0]}});
    		}
    		if(data[1] != undefined) {
    			BankAccountCollection.update({_id : id2},{$set:{date_open : data[1]}});
    		}
    		if(data[2] != undefined) {
    			BankAccountCollection.update({_id : id2},{$set:{date_close : data[2]}});
    		}
			if(data[3] != undefined) {
    			BankAccountCollection.update({_id : id2},{$set:{money_sum : data[3]}});
    		}
			if(data[4] != undefined) {
    			BankAccountCollection.update({_id : id2},{$set:{client_id : clientFK}});
    		}
    		if(data[5] != undefined) {
    			BankAccountCollection.update({_id : id2},{$set:{deposit_id : depositFK}});
    		}
    		this.setState({countRows : BankAccountCollection.find().count()});
		}
		if(this.state.table == "client") {
			id2 = ClientCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		let homeFK = HomeCollection.Collection.find({address: data[0]}).fetch()[0]['address'];
    		if(data[0] != undefined) {
    			ClientCollection.update({_id : id2},{$set:{name : data[0]}});
    		}
    		if(data[1] != undefined) {
    			ClientCollection.update({_id : id2},{$set:{surname : data[1]}});
    		}
    		if(data[2] != undefined) {
    			ClientCollection.update({_id : id2},{$set:{fathername : data[2]}});
    		}
    		if(data[3] != undefined) {
    			ClientCollection.update({_id : id2},{$set:{serial_of_passport : data[3]}});
    		}
    		if(data[4] != undefined) {
    			ClientCollection.update({_id : id2},{$set:{number_of_passport : data[4]}});
    		}
			if(data[5] != undefined) {
    			ClientCollection.update({_id : id2},{$set:{telephone : data[5]}});
    		}
			if(data[6] != undefined) {
    			ClientCollection.update({_id : id2},{$set:{address_id : homeFK}});
    		}
    		this.setState({countRows : ClientCollection.find().count()});
		}
		if(this.state.table == "deposit") {
			id2 = DepositCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		if(data[0] != undefined) {
    			DepositCollection.update({_id : id2},{$set:{name_of_deposit : data[0]}});
    		}
    		if(data[1] != undefined) {
    			DepositCollection.update({_id : id2},{$set:{storage_time : data[1]}});
    		}
    		if(data[2] != undefined) {
    			DepositCollection.update({_id : id2},{$set:{interest_rate : data[2]}});
    		}
    		this.setState({countRows : DepositCollection.find().count()});
		}
		if(this.state.table == "home") {
			id2 = HomeCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		if(data[0] != undefined) {
    			HomeCollection.update({_id : id2},{$set:{address : data[0]}});
    		}
    		if(data[1] != undefined) {
    			HomeCollection.update({_id : id2},{$set:{number_of_flat : data[1]}});
    		}
    		this.setState({countRows : HomeCollection.find().count()});
		}
		if(this.state.table == "users") {
			id++;
			id2 = UsersCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		if(data[0] != undefined) {
    			UsersCollection.update({_id : id2},{$set:{login : data[0]}});
    		}
    		if(data[1] != undefined) {
    			UsersCollection.update({_id : id2},{$set:{password : data[1]}});
    		}
    		this.setState({countRows : UsersCollection.find().count()});
		}
	}

	inputInsert(key, value) {
		let data = this.state.inputsInsert;
		data[key] = value;
		this.setState({inputsInsert: data});
	}

	inputUpdate(key, value) {
		let data = this.state.inputsUpdate;
		data[key] = value;
		this.setState({inputsUpdate: data});
	}

	buttonLogout() {
		cookie.remove('user');
		cookie.remove('admin');
		location.reload();
	}

	render() {
		let titlePage = "";
		let htmlCode = [];
		let pageState = [];
		let formInsert = [];
		let formUpdate = [];
		let buttonAdmin = [];
		let maxPage = parseInt(this.state.countRows % this.state.countObjectOnPage == 0 ? this.state.countRows / this.state.countObjectOnPage : this.state.countRows / this.state.countObjectOnPage + 1);
		if(this.state.table == "") {
			titlePage = "Выберите объект";
		} else {
			titlePage = "Объект "+this.state.table;
			pageState.push(<div style={{margin: "0 0 0 170px"}}><br/>
				<button class="table-button" style={{margin: "-"+10+"px 0  -100px -170px"}} onClick={this.buttonPrev}>Назад</button>
    			<button class="table-button" style={{margin: "-"+10+"px 0  -100px -70px"}} onClick={this.buttonNext}>Далее</button>
    			<span style={{margin: "0 0 0 30px"}}>Страница: {this.state.page}/{maxPage}</span>	
			</div>);
		}
		if(this.state.table == "bankaccount") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			BankAccountCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
					<td>{res.client_id}</td>
					<td>{res.deposit_id}</td>
            		<td>{res.number_of_account}</td>
            		<td>{res.date_open}</td>
            		<td>{res.date_close}</td>
            		<td>{res.money_sum}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 200 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -195px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -95px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}
		if(this.state.table == "client") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			ClientCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
            		<td>{res.name}</td>
            		<td>{res.surname}</td>
					<td>{res.fathername}</td>
					<td>{res.serial_of_passport}</td>
					<td>{res.number_of_passport}</td>
					<td>{res.telephone}</td>
					<td>{res.address_id}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 200 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -195px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -95px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}
		if(this.state.table == "deposit") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			DepositCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
            		<td>{res.name_of_deposit}</td>
            		<td>{res.storage_time}</td>
					<td>{res.interest_rate}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 200 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -195px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -95px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}
		if(this.state.table == "home") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			HomeCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
            		<td>{res.address}</td>
            		<td>{res.number_of_flat}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 200 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -195px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -95px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}
		
		if(this.state.table == "users") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			UsersCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
				if(res.login != "admin") {
					htmlCode.push(<tr class="custom-table__row">
    					<td>{id++}</td>
            			<td>{res.login}</td>
            			<td>{res.password}</td>
           			</tr>);
				}
    		});
    		for(let i = id1, s = 200 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -195px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -95px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}

		if(this.state.table == "bankaccount") {
			formInsert.push(<div><br/>
				<input type="text" placeholder="Enter number of account" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter date open" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter date close" onChange={(event) => this.inputInsert(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter money sum" onChange={(event) => this.inputInsert(3, event.target.value)}/><br/>
				<input type="text" placeholder="Enter clients num. of pasport" onChange={(event) => this.inputInsert(4, event.target.value)}/><br/>
				<input type="text" placeholder="Enter name of deposit" onChange={(event) => this.inputInsert(5, event.target.value)}/><br/>
				<button class="table-add-button" style={{margin: "-"+80+"px 0  0 200px"}} onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter number of account" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter date open" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter date close" onChange={(event) => this.inputUpdate(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter money sum" onChange={(event) => this.inputUpdate(3, event.target.value)}/><br/>
				<input type="text" placeholder="Enter clients num. of pasport" onChange={(event) => this.inputUpdate(4, event.target.value)}/><br/>
				<input type="text" placeholder="Enter name of deposit" onChange={(event) => this.inputUpdate(5, event.target.value)}/><br/>
			</div>);
		}

		if(this.state.table == "client") {
			formInsert.push(<div><br/>
				<input type="text" placeholder="Enter name" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter surname" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter fathername" onChange={(event) => this.inputInsert(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter serial of passport" onChange={(event) => this.inputInsert(3, event.target.value)}/><br/>
				<input type="text" placeholder="Enter number of passport" onChange={(event) => this.inputInsert(4, event.target.value)}/><br/>
				<input type="text" placeholder="Enter telephone" onChange={(event) => this.inputInsert(5, event.target.value)}/><br/>
				<input type="text" placeholder="Enter address" onChange={(event) => this.inputInsert(6, event.target.value)}/><br/>
				<button class="table-add-button" style={{margin: "-"+80+"px 0  0 200px"}} onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter name" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter surname" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter fathername" onChange={(event) => this.inputInsert(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter serial of passport" onChange={(event) => this.inputUpdate(3, event.target.value)}/><br/>
				<input type="text" placeholder="Enter number of passport" onChange={(event) => this.inputInsert(4, event.target.value)}/><br/>
				<input type="text" placeholder="Enter telephone" onChange={(event) => this.inputUpdate(5, event.target.value)}/><br/>
				<input type="text" placeholder="Enter address" onChange={(event) => this.inputUpdate(6, event.target.value)}/><br/>
			</div>);
		}

		if(this.state.table == "deposit") {
			formInsert.push(<div><br/>
				<input type="text" placeholder="Enter name of deposit" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter storage time" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter interest rate" onChange={(event) => this.inputInsert(2, event.target.value)}/><br/>
				<button class="table-add-button" style={{margin: "-"+80+"px 0  0 200px"}} onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter name of deposit" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter storage time" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter interest rate" onChange={(event) => this.inputUpdate(2, event.target.value)}/><br/>
			</div>);
		}
		
		if(this.state.table == "home") {
			formInsert.push(<div><br/>
				<input type="text" placeholder="Enter address" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter number of flat" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<button class="table-add-button" style={{margin: "-"+80+"px 0  0 200px"}} onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter address" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter number of flat" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
			</div>);
		}

		if(this.state.table == "users") {
			formInsert.push(<div><br/>
				<input type="text" placeholder="Enter login" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter password" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<button class="table-add-button" style={{margin: "-"+80+"px 0  0 200px"}} onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter login" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter password" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
			</div>);
		}
		if(cookie.get('admin') == "admin") {
			buttonAdmin.push(<button class="menu-button" onClick={this.usersButton}>Users</button>);
		}

		return <div class="container">
    		<div class="menu" >
				<button class="menu-button" onClick={this.bankaccountButton}>BankAccount</button>
				<button class="menu-button" onClick={this.clientButton}>Client</button>
				<button class="menu-button" onClick={this.depositButton}>Deposit</button>
				<button class="menu-button" onClick={this.homeButton}>Home</button>
				{buttonAdmin}
				<button class="menu-button" onClick={this.buttonLogout}>Выйти</button>
			</div>
    		<div class="space"><br/>
    			<div class="title-page">{titlePage}</div><br/>
    			<table class="custom-table" border="1">
    				<tr class="custom-table__row custom-table__row_head">
    					{Array.prototype.map.call(this.state.columns, function (column) {
            					return <th>{column}</th>;
        				}, this)}
    				</tr>
    				{htmlCode}
    			</table>
    			{pageState}
    			{formInsert}
    			{formUpdate}
    		</div>
 		</div>
	}
}