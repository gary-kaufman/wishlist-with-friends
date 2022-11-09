# wishlist-with-friends ✅
## Overview 
This web app can be used to create your own wishlist of items from sites across the web. You can favorite items and share your wishlist. You can also create and join groups where you can see other friends wishlists and mark items as purchased. 

## Installing
Once cloned into a local repository, open a terminal in the root folder and run `npm install` to install the appropriate packages. You must also set up a `firebase.js` file in the `/includes` directory with your firebase configuration in the format described at the appendix below.

## Appendix: firebase.js Config
```
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  <YOUR FIREBASE CONFIG HERE>
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
```

