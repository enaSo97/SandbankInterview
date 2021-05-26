const firebase = require('firebase');

// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
const firebaseConfig = {
    apiKey: "AIzaSyCvW1E4Hr1zJT3GF4GFBP0_zjIlTfK66MM",
    authDomain: "sandbank-bb310.firebaseapp.com",
    databaseURL: "https://sandbank-bb310-default-rtdb.firebaseio.com/",
    projectId: "sandbank-bb310",
    storageBucket: "sandbank-bb310.appspot.com",
  };
  
  // Initialize Firebase
module.exports = firebase.initializeApp(firebaseConfig);
