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
        <button id="login" @click.prevent="login">Login</button>
      </form>
    </section>
    <section v-if="loginOrRegister == 'register'">
      <form id="new_user_form" ref="new_user_form">
        <input type="text" placeholder="Full Name" v-model="username"/>
        <input type="text" placeholder="Email" v-model="user_email" />
        <input type="password" placeholder="Password" v-model="user_password" />
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
    };
  },
  methods: {
    async register() {
            try {
      await createUserWithEmailAndPassword(auth, this.user_email, this.user_password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.user_id = user.uid;
        })
      await updateProfile(auth.currentUser, {displayName: this.username})
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
      const docRef = await addDoc(collection(db, "users"), {
          username: this.username,
          uid: this.user_id,
        });
      } catch (e) { console.log(e) } finally { 
        console.log("new user registered with id: " + this.user_id);
        this.$router.push({ path: "/" }) 
      };

    },
    login() {
      signInWithEmailAndPassword(auth, this.user_email, this.user_password)
        .then((userCredential) => {
          const user = userCredential.user;
          this.$router.push({ path: "/" });
          console.log("user logged in!");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
    },
  },
};
</script>
<style scoped>
input {
  border-radius: 0;
  border-style:solid;
  padding: 1rem;
}
main {
  margin: auto;
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
</style>
