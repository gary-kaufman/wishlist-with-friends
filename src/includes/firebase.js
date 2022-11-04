import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
