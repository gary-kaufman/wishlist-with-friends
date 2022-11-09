<template>
  <nav>
    <h1 v-if="login_logout_message === 'Login'" id="home_nav_link">Wishlist-with-Friends</h1>
    <router-link v-if="login_logout_message === 'Logout'" to="/">My Wishlist</router-link>
    <router-link v-if="login_logout_message === 'Logout'" to="/groups"
      class="little_link">Groups</router-link
    >
    <!-- <a v-if="login_logout_message === 'Logout'" href="">Checklist</a> -->
<!--     <router-link v-if="login_logout_message === 'Login'" to="/login"
      class="little_link">Login or Register</router-link
    > -->
    <router-link v-if="login_logout_message === 'Logout'" to="/logout" @click="logout" class="little_link">Logout</router-link>
  </nav>
</template>

<script>
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../includes/firebase";

export default {
  name: "AppHeader",
  data() {
    return {
      login_logout_message: "Login",
    };
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.login_logout_message = "Logout";
      } else {
        this.login_logout_message = "Login";
      }
    });
  },
  methods: {
    async logout() {
      try {
        await signOut(auth);
        this.$router.push({ path: "/logout" });
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped>
nav {
  display: flex;
  justify-content: flex-start;
}

#home_nav_link {
  text-transform: uppercase;
  font-size: large;
  font-weight: bolder;
  flex-grow: 1;
  }

a {
  padding: 1rem;
}
</style>
