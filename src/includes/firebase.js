// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9rLItmX1_xnVAmbmcAKpZdgUh9vXcwYw",
  authDomain: "wishlist-with-friends.firebaseapp.com",
  projectId: "wishlist-with-friends",
  storageBucket: "wishlist-with-friends.appspot.com",
  messagingSenderId: "827032669385",
  appId: "1:827032669385:web:af503bd1b7f2bd6b66d118",
  measurementId: "G-3BL1ERES03",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
