<template>
  <nav>
    <a href="" id="home_nav_link">Wishlist-with-Friends</a>
    <a href="">Friends</a>
    <a href="">Groups</a>
    <a href="">Checklist</a>
    <a href="">Login/Logout</a>
  </nav>
</template>

<script lang="ts">
export default {
  name: "AppHeader",
};
</script>

<style>
nav {
  display: flex;
  justify-content: flex-start;
}

a {
  padding: 1rem;
}

#home_nav_link {
  text-transform: uppercase;
  font-size: x-large;
  font-weight: bolder;
}
</style>
