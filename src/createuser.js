

import firebase from 'firebase';

function User(name, email, password) {
    this.name = name;
    this.email = email;
    this.password = password;
}

User.prototype.giveInfoToFirbase = function() {
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password).catch(function(error) {
	var errorCode = error.code;
	var errorMessage = error.message
	// handle errors
    });
    // add name to firebase. 
    // add stuff to firebase
}
    
