<template>
  <main>
    <p>Use this app to add items to your wishlist from sites across the web! 
      You can favorite items and even share your list!
      Create or Join a Group with your friends and find the perfect gift!</p>
    <div id="selector">
      <button :class="{ selected: loginOrRegister == 'login'}" 
      @click.prevent="loginOrRegister = 'login'">Login</button>
      <button :class="{ selected: loginOrRegister == 'register'}"
      @click.prevent="loginOrRegister = 'register'">Register</button>
    </div>
    <section v-if="loginOrRegister == 'login'">
      <form id="new_user_form" ref="new_user_form">
        <input type="text" placeholder="Email" v-model="user_email" />
        <input type="password" placeholder="Password" v-model="user_password" />
        <span v-if="errorMessage.isError" class="errorMessage">{{ errorMessage.message }}</span>
        <button id="login" @click.prevent="login">Login</button>
      </form>
    </section>
    <section v-if="loginOrRegister == 'register'">
      <form id="new_user_form" ref="new_user_form">
        <input type="text" placeholder="Full Name" v-model="username"/>
        <input type="text" placeholder="Email" v-model="user_email" />
        <input type="password" placeholder="Password" v-model="user_password" />
        <span v-if="errorMessage.isError" class="errorMessage">{{ errorMessage.message }}</span>
        <button id="register" @click.prevent="register">Register</button>
      </form>
    </section>
    <AppFooter />

  </main>
</template>
<script>
import AppFooter from "../components/AppFooter.vue";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
updateProfile,
} from "firebase/auth";
import { auth, db } from "../includes/firebase";
import { collection, addDoc } from "@firebase/firestore";

export default {
  name: "LoginView",
  components: {
    AppFooter
  },
  data() {
    return {
      username: "",
      user_email: "",
      user_password: "",
      user_id: "",
      loginOrRegister: "login",
      errorMessage: {
        isError: false,
        message: "",
      },
      registering: false,
    };
  },
  methods: {
    async register() {
      if (this.registering) {
        console.log("registration already in progress!");
        return;
      }
      this.registering = true;

      
      if (this.username == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter a valid name.";
        this.registering = false;
        return;
      }
      if (this.user_email == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter valid email.";
        this.registering = false;
        return;
      } if (this.user_password == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter valid password.";
        this.registering = false;
        return;
      }

      
      await createUserWithEmailAndPassword(auth, this.user_email, this.user_password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.user_id = user.uid;
        })
        .catch((error) => {
          if (error.code == "auth/email-already-in-use") {
            this.errorMessage.isError = true;
            this.errorMessage.message = "Email is already in use.";
          } else {
            this.errorMessage.isError = true;
            this.errorMessage.message = error.code;
          }
          this.registering = false;
          return;
        })
      if (this.user_id == "") {
        this.registering = false;
        return;
      }
      await updateProfile(auth.currentUser, {displayName: this.username})
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
      const docRef = await addDoc(collection(db, "users"), {
          username: this.username,
          email: this.user_email,
          uid: this.user_id,
        });
      this.registering = false;
      this.$router.push({ path: "/" });
    },
    async login() {
      if (this.user_email == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter valid email.";
        return;
      } if (this.user_password == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter valid password.";
        return;
      }
      await signInWithEmailAndPassword(auth, this.user_email, this.user_password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.$router.push({ path: "/" });
        })
        .catch((error) => {
          if (error.code == "auth/wrong-password" || error.code == "auth/invalid-email") {
            this.errorMessage.isError = true;
            this.errorMessage.message = "Incorrect email or password. Please try again.";
          } else {
            this.errorMessage.isError = true;
            this.errorMessage.message = error.code;
          }
        });
    },
  },
};
</script>
<style scoped>
main {
  margin: auto;
}

section {
  margin-bottom: 1rem;
  border-top: none;
  border-right: solid 1px rgb(34, 64, 108);
  border-left: solid 1px rgb(34, 64, 108);
  border-bottom: solid 1px rgb(34, 64, 108);

;
}

.selected {
  border: solid 1px rgb(34, 64, 108);
  background-color: rgb(160, 188, 195);
  color: rgb(34, 64, 108);
}

#new_user_form {
  display: flex;
  flex-direction: column;
}

#selector {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

button {
  flex-grow: 1;
}

.errorMessage {
  color: red;
}
</style>
