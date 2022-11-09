<template>
  <MyWishlist />
</template>

<script lang="ts">
import AppHeader from "../components/AppHeader.vue";
import MyWishlist from "../components/MyWishlist.vue";
export default {
  name: "HomeView",
  components: {
    AppHeader,
    MyWishlist,
  },
};
</script>
