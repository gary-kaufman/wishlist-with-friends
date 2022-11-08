<template>
  <main>
    <div id="selector">
      <button @click.prevent="loginOrRegister = 'login'">Login</button>
      <button @click.prevent="loginOrRegister = 'register'">Register</button>
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
  </main>
</template>
<script>
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
updateProfile,
} from "firebase/auth";
import { auth, db } from "../includes/firebase";
import { collection, addDoc } from "@firebase/firestore";

export default {
  name: "LoginView",
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
      }
    };
  },
  methods: {
    async register() {
      if (this.username == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter a valid name.";
        return;
      }
      if (this.user_email == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter valid email.";
        return;
      } if (this.user_password == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter valid password.";
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
          return;
        })
      if (this.user_id == "") {
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
  border: solid 1px rgb(34, 64, 108);
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
