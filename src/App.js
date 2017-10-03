import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

// grabbing "fire" exported from the file we created earlier using
// the information about the firebase project. in this case toastR
import fire from './fire';

var database = fire.database();
//var ref = database.ref('users');

class App extends Component {
    // consturctor
    constructor(props) {
	super(props);
	this.state = { messages: [] };
    }

    // component mounting function?????
    componentWillMount() {
	let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
	messagesRef.on('child_added', snapshot => {
	    
	    // update React State whenever a message is added at the firebase database
	    let message = {text: snapshot.val(), id: snapshot.key};

	    this.setState({messages: [message].concat(this.state.messages) });
	})
    }
    
    // function for adding a message. Not at all sure about the input/parameter "e"
    addMessage(e) {
	e.preventDefault(); 	// prevents a form submit on reloading the page

	// this functino sends a message to firebase. Cool!
	fire.database().ref('messages').push( this.inputEl.value );
	this.inputEl.value = ''; //  clears the input
    }
    login() {
	let password = document.getElementById("password").value;
	let email = document.getElementById("email").value;
	console.log(password, email);

	
	fire.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
	    if (error)
		console.log(error);
//	    var errorMessage = error.message
	// handle errors
	});
	var ref = database.ref('users');
	var data = {
	    email: email,
	    password: password
	}
	console.log(data);
	ref.push(data);
    }

    
    // render function
    render() {
	return (		
		<form onClick="">
		<input type="text" id="email" />
		<input type="text" id="password"/>
		<input type="button" value="Sign Up" onClick={this.login.bind(this)}/>
		
		</form>
	);
    }
}

export default App;
