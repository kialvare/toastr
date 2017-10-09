// Entry point for the toastr program/web app

function makeToast () {
    this.checkSetup();

    // document elements DOM elements
    this.submitImageButton = document.getElementById('submitImage');
    this.signInButton = document.getElementById('sign-in');
    this.signUpButton = document.getElementById('sign-up');
    
    // Event for image upload
    this.submitImageButton.addEventListener('click', function(e) {
	e.preventDefault();
	this.mediaCapture.click();
    }.bind(this));
    this.mediaCapture.addEventListener('change', this.saveImageMessage.bind(this));

    // Listeners
    this.messageForm.addEventListener('submit', this.saveMessage.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton.bind(this);
    this.messageInput.addEventListener('keyup', buttonTogglingHandler);
    this.messageInput.addEventListener('change', buttonTogglingHandler);

};

// Sets up shortcuts to Firebase features and initiate firebase auth.
makeToast.prototype.initFirebase = function() {

    this.auth = firebase.auth();
    this.database = firebase.database();
    this.storage = firebase.storage();
    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};

// Signs-in with email and password.
makeToast.prototype.signIn = function() {
    // TODO(DEVELOPER): Sign in Firebase with credential from the Google user.
    var provider = firebase.auth().signInWithEmailAndPassword(email, password)
	.catch(function(error) { //new firebase.auth.GoogleAuthProvider();
	    console.log("error on signin");
	    console.log(error);
	});
    this.auth.signInWithPopup(provider);
};

makeToast.prototype.checkSignedInWithMessage = function() {
    /*Check if user is signed-in Firebase. */
    if (this.auth.currentUser) {
	return true;
    }
    // Display a message to the user using a Toast.
    var data = {
	message: 'You must sign-in first',
	timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
};

// Saves a new message containing an image URI in Firebase.
// This first saves the image in firebase storage
makeToast.prototype.saveImageMessage = function(event) {
    event.preventDefault();

    var file = event.target.files[0];

    // Clear the selection in the file picker input.
    this.imageForm.reset();

    if (!file.type.match('image.*')) {
	var data = {
	    message: 'You must only upload an image',
	    timeout: 2000
	};
	this.signInSnackbar.MaterialSnackbar.showSnackBar(data); // no idea what the snackbar is!
	return;
    }
    if (this.checkSignedInWithMessage()) {
	var currentUser = this.auth.currentUser;
	this.messageRef.push({
	    name: currentUser.displayName, // placeholder data
	    image:url: makeToast.LOADING_IMAGE_URL, // placeholder data
	    photoUrl: currentUser.photoUrl || 'images/profile_placeholder.png' // placeholder data
	}).then(function(data) {

	    // upload image to cloud storage
	    var filePath = currentUser.uid + '/' + data.key + '/' + file.name;
	    return this.storage.ref(filePath).put(file).then(function(snapshot) {

		// Get file's storage URI and update chat message placeholder
		var fullPath = snapshot.metadata.fullPath;
		return data.update({imageUrl: this.storage.ref(fullPath).toString()});
	    }.bind(this));
	}bind(this)).catch(function(error) {
	    console.log("an error occurred");
	    console.log(error);
	});
    }
};

makeToast.LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif';

makeToast.prototype.checkSetup = function() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
};

window.onload = function() {
  window.makeToast = new makeToast();
};
