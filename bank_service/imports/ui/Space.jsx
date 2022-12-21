import React from 'react';
import { Cookies } from 'meteor/ostrio:cookies';
import {useTracker} from 'meteor/react-meteor-data';
import {ClientsCollection} from "../api/ClientsCollection";
import {CashiersCollection} from "../api/CashiersCollection";
import {CurrenciesCollection} from "../api/CurrenciesCollection";
import {RatesCollection} from "../api/RatesCollection";
import {TransactionsCollection} from "../api/TransactionsCollection";
import {UsersCollection} from "../api/UsersCollection";

const cookie = new Cookies();

export class Space extends React.Component {



	constructor(props) {
		super(props);
		this.buttonClients = this.buttonClients.bind(this);
		this.buttonCashiers = this.buttonCashiers.bind(this);
		this.buttonCurrencies = this.buttonCurrencies.bind(this);
		this.buttonRates = this.buttonRates.bind(this);
		this.buttonTransactions = this.buttonTransactions.bind(this);
		this.buttonUsers = this.buttonUsers.bind(this);
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

	buttonClients() {
		this.setState({columns : ["N", "name", "surname", "patronymic", "passport_series", "passport_number"]});
		this.setState({countRows : ClientsCollection.find().count()});
		this.setState({table : "clients"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	buttonCashiers() {
		this.setState({columns : ["N", "name", "surname", "patronymic"]});
		this.setState({countRows : CashiersCollection.find().count()});
		this.setState({table : "cashiers"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	buttonCurrencies() {
		this.setState({columns : ["N", "code", "name"]});
		this.setState({countRows : CurrenciesCollection.find().count()});
		this.setState({table : "currencies"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	buttonRates() {
		this.setState({columns : ["N", "sold", "purchased", "date", "sale_rate", "purchase_rate"]});
		this.setState({countRows : RatesCollection.find().count()});
		this.setState({table : "rates"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	buttonTransactions() {
		this.setState({columns : ["N", "sold", "purchased", "client", "cashier", "rate_sold", "rate_purchased", "date", "sum_sold", "sum_purchased"]});
		this.setState({countRows : TransactionsCollection.find().count()});
		this.setState({table : "transactions"});
		this.setState({page : 1});
		this.setState({inputsInsert : []});
		this.setState({inputsUpdate : []});
	}

	buttonUsers() {
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
		if(this.state.table == "clients") {
			ClientsCollection.insert({
				name: data[0],
				surname: data[1],
				patronymic: data[2],
				passport_series: data[3],
				passport_number: data[4],
			});
			this.setState({countRows : ClientsCollection.find().count()});
		}
		if(this.state.table == "cashiers") {
			CashiersCollection.insert({
				name: data[0],
				surname: data[1],
				patronymic: data[2]
			});
			this.setState({countRows : CashiersCollection.find().count()});
		}
		if(this.state.table == "currencies") {
			CurrenciesCollection.insert({
				code: data[0],
				name: data[1]
			});
			this.setState({countRows : CurrenciesCollection.find().count()});
		}
		if(this.state.table == "rates") {
			let Nsold = CurrenciesCollection.find({}, {skip: parseInt(data[0]) - 1, limit: 1}).fetch()[0]['_id'];
    		let Npurchased = CurrenciesCollection.find({}, {skip: parseInt(data[1]) - 1, limit: 1}).fetch()[0]['_id'];
    		RatesCollection.insert({
				id_currency_sold: Nsold,
				id_currency_purchased: Npurchased,
				date_of_use: new Date(),
				sale_rate: data[2],
				purchase_rate: data[3]
			});
			this.setState({countRows : RatesCollection.find().count()});
		}
		if(this.state.table == "transactions") {
			let Nsold = CurrenciesCollection.find({}, {skip: parseInt(data[0]) - 1, limit: 1}).fetch()[0]['_id'];
    		let Npurchased = CurrenciesCollection.find({}, {skip: parseInt(data[1]) - 1, limit: 1}).fetch()[0]['_id'];
    		let Nclient = ClientsCollection.find({}, {skip: parseInt(data[2]) - 1, limit: 1}).fetch()[0]['_id'];
    		let Ncashier = CashiersCollection.find({}, {skip: parseInt(data[3]) - 1, limit: 1}).fetch()[0]['_id'];
    		let rateSold = RatesCollection.find({id_currency_sold: Nsold, id_currency_purchased: Npurchased}, {sort: {date_of_use: -1}}).fetch()[0]['sale_rate'];
    		let ratePurchased = RatesCollection.find({id_currency_sold: Nsold, id_currency_purchased: Npurchased}, {sort: {date_of_use: -1}}).fetch()[0]['purchase_rate'];
    		let sum1;
    		let sum2;
    		console.log(data[4]);
    		if(data[4] == 1) {
    			sum2 = parseFloat(data[5]) * parseFloat(rateSold);
                sum1 = parseFloat(data[5]);
    		}
    		if(data[4] == 2) {
    			sum1 = parseFloat(data[5]) / parseFloat(ratePurchased);
    			sum2 = parseFloat(data[5]);
    		}
    		TransactionsCollection.insert({
				id_currency_sold: Nsold,
				id_currency_purchased: Npurchased,
				id_client: Nclient,
				id_cashier: Ncashier,
				rate_sold: rateSold,
				rate_purchased: ratePurchased,
				date_of_transaction: new Date(),
				sum_currency_sold: sum1,
				sum_currency_purchased: sum2
			});
			this.setState({countRows : TransactionsCollection.find().count()});
		}
		if(this.state.table == "users") {
    		UsersCollection.insert({
				login: data[0],
				password: data[1]
			});
			this.setState({countRows : UsersCollection.find().count()});
		}
		alert("Запись добавлена!");
	}

	buttonDelete(id) {
		let id2;
		if(this.state.table == "clients") {
			id2 = ClientsCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
			TransactionsCollection.find({id_client: id2}).map(function(res) {
				TransactionsCollection.remove(res._id);
			});
    		ClientsCollection.remove(id2);
    		this.setState({countRows : ClientsCollection.find().count()});
		}
		if(this.state.table == "cashiers") {
			id2 = CashiersCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
			TransactionsCollection.find({id_cashier: id2}).map(function(res) {
				TransactionsCollection.remove(res._id);
			});
    		CashiersCollection.remove(id2);
    		this.setState({countRows : CashiersCollection.find().count()});
		}
		if(this.state.table == "currencies") {
			id2 = CurrenciesCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
			RatesCollection.find({id_currency_sold: id2}).map(function(res) {
				RatesCollection.remove(res._id);
			});
			RatesCollection.find({id_currency_purchased: id2}).map(function(res) {
				RatesCollection.remove(res._id);
			});
			TransactionsCollection.find({id_currency_sold: id2}).map(function(res) {
				TransactionsCollection.remove(res._id);
			});
			TransactionsCollection.find({id_currency_purchased: id2}).map(function(res) {
				TransactionsCollection.remove(res._id);
			});
    		CurrenciesCollection.remove(id2);
    		this.setState({countRows : CurrenciesCollection.find().count()});
		}
		if(this.state.table == "rates") {
			id2 = RatesCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		RatesCollection.remove(id2);
    		this.setState({countRows : RatesCollection.find().count()});
		}
		if(this.state.table == "transactions") {
			id2 = TransactionsCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		TransactionsCollection.remove(id2);
    		this.setState({countRows : TransactionsCollection.find().count()});
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
		if(this.state.table == "clients") {
			id2 = ClientsCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		if(data[0] != undefined) {
    			ClientsCollection.update({_id : id2},{$set:{name : data[0]}});
    		}
    		if(data[1] != undefined) {
    			ClientsCollection.update({_id : id2},{$set:{surname : data[1]}});
    		}
    		if(data[2] != undefined) {
    			ClientsCollection.update({_id : id2},{$set:{patronymic : data[2]}});
    		}
    		if(data[3] != undefined) {
    			ClientsCollection.update({_id : id2},{$set:{passport_series : data[3]}});
    		}
    		if(data[4] != undefined) {
    			ClientsCollection.update({_id : id2},{$set:{passport_number : data[4]}});
    		}
    		this.setState({countRows : ClientsCollection.find().count()});
		}
		if(this.state.table == "cashiers") {
			id2 = CashiersCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		if(data[0] != undefined) {
    			CashiersCollection.update({_id : id2},{$set:{name : data[0]}});
    		}
    		if(data[1] != undefined) {
    			CashiersCollection.update({_id : id2},{$set:{surname : data[1]}});
    		}
    		if(data[2] != undefined) {
    			CashiersCollection.update({_id : id2},{$set:{patronymic : data[2]}});
    		}
    		this.setState({countRows : CashiersCollection.find().count()});
		}
		if(this.state.table == "currencies") {
			id2 = CurrenciesCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
    		if(data[0] != undefined) {
    			CurrenciesCollection.update({_id : id2},{$set:{code : data[0]}});
    		}
    		if(data[1] != undefined) {
    			CurrenciesCollection.update({_id : id2},{$set:{name : data[1]}});
    		}
    		this.setState({countRows : CurrenciesCollection.find().count()});
		}
		if(this.state.table == "rates") {
			id2 = RatesCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
			let Nsold = CurrenciesCollection.find({}, {skip: parseInt(data[0]) - 1, limit: 1}).fetch()[0]['_id'];
    		let Npurchased = CurrenciesCollection.find({}, {skip: parseInt(data[1]) - 1, limit: 1}).fetch()[0]['_id'];
    		if(data[0] != undefined) {
    			RatesCollection.update({_id : id2},{$set:{id_currency_sold : Nsold}});
    		}
    		if(data[1] != undefined) {
    			RatesCollection.update({_id : id2},{$set:{id_currency_purchased : Npurchased}});
    		}
    		if(data[2] != undefined) {
    			RatesCollection.update({_id : id2},{$set:{date_of_use : data[2]}});
    		}
    		if(data[3] != undefined) {
    			RatesCollection.update({_id : id2},{$set:{sale_rate : data[3]}});
    		}
    		if(data[4] != undefined) {
    			RatesCollection.update({_id : id2},{$set:{purchase_rate : data[4]}});
    		}
    		this.setState({countRows : RatesCollection.find().count()});
		}
		if(this.state.table == "transactions") {
			id2 = TransactionsCollection.find({}, {skip: id - 1, limit: 1}).fetch()[0]['_id'];
			let Nsold = CurrenciesCollection.find({}, {skip: parseInt(data[0]) - 1, limit: 1}).fetch()[0]['_id'];
    		let Npurchased = CurrenciesCollection.find({}, {skip: parseInt(data[1]) - 1, limit: 1}).fetch()[0]['_id'];
    		let Nclient = ClientsCollection.find({}, {skip: parseInt(data[2]) - 1, limit: 1}).fetch()[0]['_id'];
    		let Ncashier = CashiersCollection.find({}, {skip: parseInt(data[3]) - 1, limit: 1}).fetch()[0]['_id'];
    		if(data[0] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{id_currency_sold : Nsold}});
    		}
    		if(data[1] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{id_currency_purchased : Npurchased}});
    		}
    		if(data[2] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{id_client : Nclient}});
    		}
    		if(data[3] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{id_cashier : Ncashier}});
    		}
    		if(data[4] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{rate_sold : data[4]}});
    		}
    		if(data[5] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{rate_purchased : data[5]}});
    		}
    		if(data[6] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{date_of_transaction : data[6]}});
    		}
    		if(data[7] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{sum_currency_sold : data[7]}});
    		}
    		if(data[8] != undefined) {
    			TransactionsCollection.update({_id : id2},{$set:{sum_currency_purchased : data[8]}});
    		}
    		this.setState({countRows : TransactionsCollection.find().count()});
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
    	alert("Запись обновлена!");
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
		location.reload();
	}

	render() {
		//console.log( useTracker(() => ClientsCollection.find({}).fetch()));
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
				<button onClick={this.buttonPrev}>Назад</button>
    			<button onClick={this.buttonNext}>Далее</button>
    			<span style={{margin: "0 0 0 30px"}}>Страница: {this.state.page}/{maxPage}</span>	
			</div>);
		}
		if(this.state.table == "clients") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			ClientsCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
            		<td>{res.name}</td>
            		<td>{res.surname}</td>
            		<td>{res.patronymic}</td>
            		<td>{res.passport_series}</td>
            		<td>{res.passport_number}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 190 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -170px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -90px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}

		if(this.state.table == "cashiers") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			CashiersCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
            		<td>{res.name}</td>
            		<td>{res.surname}</td>
            		<td>{res.patronymic}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 190 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -170px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -90px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}

		if(this.state.table == "currencies") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			CurrenciesCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
            		<td>{res.code}</td>
            		<td>{res.name}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 190 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -170px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -90px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}

		if(this.state.table == "rates") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			RatesCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
				let today = new Date(res.date_of_use);
				let dd = String(today.getDate()).padStart(2, '0');
				let mm = String(today.getMonth() + 1).padStart(2, '0');
				let yyyy = today.getFullYear();
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
            		<td>{CurrenciesCollection.find({_id: res.id_currency_sold}).fetch()[0]['name']}</td>
            		<td>{CurrenciesCollection.find({_id: res.id_currency_purchased}).fetch()[0]['name']}</td>
            		<td>{dd + '.' + mm + '.' + yyyy}</td>
            		<td>{res.sale_rate}</td>
            		<td>{res.purchase_rate}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 190 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -170px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -90px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}

		if(this.state.table == "transactions") {
			let id1 = 1 + (this.state.page - 1) * this.state.countObjectOnPage;
			let id2 = this.state.countObjectOnPage + (this.state.page - 1) * this.state.countObjectOnPage;
			let id = id1;
			TransactionsCollection.find({}, {skip: id1 - 1, limit: id2 - id1 + 1}).map(function(res) {
				let today = new Date(res.date_of_transaction);
				let dd = String(today.getDate()).padStart(2, '0');
				let mm = String(today.getMonth() + 1).padStart(2, '0');
				let yyyy = today.getFullYear();
    			htmlCode.push(<tr class="custom-table__row">
    				<td>{id++}</td>
            		<td>{CurrenciesCollection.find({_id: res.id_currency_sold}).fetch()[0]['name']}</td>
            		<td>{CurrenciesCollection.find({_id: res.id_currency_purchased}).fetch()[0]['name']}</td>
            		<td>{ClientsCollection.find({_id: res.id_client}).fetch()[0]['surname']}</td>
            		<td>{CashiersCollection.find({_id: res.id_cashier}).fetch()[0]['surname']}</td>
            		<td>{res.rate_sold}</td>
            		<td>{res.rate_purchased}</td>
            		<td>{dd + '.' + mm + '.' + yyyy}</td>
            		<td>{res.sum_currency_sold}</td>
            		<td>{res.sum_currency_purchased}</td>
           		</tr>);
    		});
    		for(let i = id1, s = 190 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -170px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -90px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
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
    		for(let i = id1, s = 190 - 40 * (5 - (id  - id1)); i <= id - 1; i++, s = s - 40) {
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -170px"}} onClick={() => this.buttonDelete(i)}>Удалить</button>);
    			htmlCode.push(<button class="table-button" style={{margin: "-"+s+"px 0  0 -90px"}} onClick={() => this.buttonUpdate(i)}>Обновить</button>);
    		}
		}

		if(this.state.table == "clients") {
			formInsert.push(<div><br/>
				<div class="title-page">Добавление записи</div><br/>
				<input type="text" placeholder="Enter name" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter surname" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter patronymic" onChange={(event) => this.inputInsert(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter passport_series" onChange={(event) => this.inputInsert(3, event.target.value)}/><br/>
				<input type="text" placeholder="Enter passport_number" onChange={(event) => this.inputInsert(4, event.target.value)}/><br/>
				<button onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter name" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter surname" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter patronymic" onChange={(event) => this.inputUpdate(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter passport_series" onChange={(event) => this.inputUpdate(3, event.target.value)}/><br/>
				<input type="text" placeholder="Enter passport_number" onChange={(event) => this.inputUpdate(4, event.target.value)}/><br/>
			</div>);
		}

		if(this.state.table == "cashiers") {
			formInsert.push(<div><br/>
				<div class="title-page">Добавление записи</div><br/>
				<input type="text" placeholder="Enter name" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter surname" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter patronymic" onChange={(event) => this.inputInsert(2, event.target.value)}/><br/>
				<button onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter name" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter surname" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter patronymic" onChange={(event) => this.inputUpdate(2, event.target.value)}/><br/>
			</div>);
		}

		if(this.state.table == "currencies") {
			formInsert.push(<div><br/>
				<div class="title-page">Добавление записи</div><br/>
				<input type="text" placeholder="Enter code" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter name" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<button onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter code" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter name" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
			</div>);
		}

		if(this.state.table == "rates") {
			formInsert.push(<div><br/>
				<div class="title-page">Добавление записи</div><br/>
				<input type="text" placeholder="Enter N sold" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter N purchased" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter sale_rate" onChange={(event) => this.inputInsert(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter purchase_rate" onChange={(event) => this.inputInsert(3, event.target.value)}/><br/>
				<button onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter N sold" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter N purchased" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter date_of_use" onChange={(event) => this.inputUpdate(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter sale_rate" onChange={(event) => this.inputUpdate(3, event.target.value)}/><br/>
				<input type="text" placeholder="Enter purchase_rate" onChange={(event) => this.inputUpdate(4, event.target.value)}/><br/>
			</div>);
		}

		if(this.state.table == "transactions") {
			formInsert.push(<div><br/>
				<div class="title-page">Добавление записи</div><br/>
				<input type="text" placeholder="Enter N sold" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter N purchased" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter N client" onChange={(event) => this.inputInsert(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter N cashier" onChange={(event) => this.inputInsert(3, event.target.value)}/><br/>
				<input name="r1" type="radio" value="1" onClick={(event) => this.inputInsert(4, event.target.value)}/>
				<span>Купить</span>
				<input name="r1" type="radio" value="2" onClick={(event) => this.inputInsert(4, event.target.value)}/>
				<span>Продать</span><br/>
				<input type="text" placeholder="Enter money" onChange={(event) => this.inputInsert(5, event.target.value)}/><br/>
				<button onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter N sold" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter N purchased" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
				<input type="text" placeholder="Enter N client" onChange={(event) => this.inputUpdate(2, event.target.value)}/><br/>
				<input type="text" placeholder="Enter N cashier" onChange={(event) => this.inputUpdate(3, event.target.value)}/><br/>
				<input type="text" placeholder="Enter rate_sold" onChange={(event) => this.inputUpdate(4, event.target.value)}/><br/>
				<input type="text" placeholder="Enter rate_purchased" onChange={(event) => this.inputUpdate(5, event.target.value)}/><br/>
				<input type="text" placeholder="Enter date" onChange={(event) => this.inputUpdate(6, event.target.value)}/><br/>
				<input type="text" placeholder="Enter sum_sold" onChange={(event) => this.inputUpdate(7, event.target.value)}/><br/>
				<input type="text" placeholder="Enter sum_purchased" onChange={(event) => this.inputUpdate(8, event.target.value)}/><br/>
			</div>);
		}

		if(this.state.table == "users") {
			formInsert.push(<div><br/>
				<div class="title-page">Добавление записи</div><br/>
				<input type="text" placeholder="Enter login" onChange={(event) => this.inputInsert(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter password" onChange={(event) => this.inputInsert(1, event.target.value)}/><br/>
				<button onClick={this.buttonInsert}>Добавить новую запись</button>
			</div>);
			formUpdate.push(<div><br/>
				<div class="title-page">Обновление записи</div><br/>
				<input type="text" placeholder="Enter login" onChange={(event) => this.inputUpdate(0, event.target.value)}/><br/>
				<input type="text" placeholder="Enter password" onChange={(event) => this.inputUpdate(1, event.target.value)}/><br/>
			</div>);
		}
		if(cookie.get('user') == "admin") {
			buttonAdmin.push(<button class="menu-button" onClick={this.buttonUsers}>Users</button>);
		}

		return <div class="container">
    		<div class="menu" >
				<button class="menu-button" onClick={this.buttonClients}>Clients</button>
				<button class="menu-button" onClick={this.buttonCashiers}>Cashiers</button>
				<button class="menu-button" onClick={this.buttonCurrencies}>Currencies</button>
				<button class="menu-button" onClick={this.buttonRates}>Rates</button>
				<button class="menu-button" onClick={this.buttonTransactions}>Transactions</button>
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