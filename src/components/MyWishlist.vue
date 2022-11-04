<template>
  <main>
    <h2 v-if="display_name">{{ display_name }}'s Wishlist <font-awesome-icon icon="fa-regular fa-square-check" /></h2>
    <ItemForm @listRefresh="listRefresh" v-if="display_name"/>
    <ItemList ref="itemList" v-if="display_name"/>
  </main>
</template>

<script>
import ItemList from "./ItemList.vue";
import ItemForm from "./ItemForm.vue";
import { ref } from "vue";
import { auth } from "../includes/firebase";
import { onAuthStateChanged } from "@firebase/auth";

const itemList = ref();

export default {
  name: "MyWishlist",
  components: { ItemList, ItemForm },
  data() {
    return  {
      display_name: "",
    }
  },
  methods: {
    listRefresh() {
      this.$refs.itemList.getItems();
    },
  },
  async mounted() {
    await onAuthStateChanged(auth, (user) => this.display_name = user.displayName);
  },
  async beforeMount() {
    await onAuthStateChanged(auth, (user) => {
      if (!user) this.$router.push("/login")
    })
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
