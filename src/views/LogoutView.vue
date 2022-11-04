<template>
  <div>
    <h2>You are now logged out!</h2>
  </div>
</template>
<script>
export default {
  name: "LogoutView",
  mounted() {
    setTimeout(() => {
      this.$router.push("/login")
    }, 2000)
  }
};
</script>
<style scoped></style>
