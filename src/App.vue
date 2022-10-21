<template>
  <div>
    <HomeView />
  </div>
</template>

<script lang="ts">
import HomeView from "./views/HomeView.vue";
import { mapState } from "pinia";
import { useAuthStore } from "./stores/authStore";

export default {
  name: "App",
  components: {
    HomeView,
  },
  computed: {
    ...mapState(useAuthStore, ["isLoggedIn"]),
  },
  mounted() {
    // console.log(this.isLoggedIn);
  },
};
</script>
