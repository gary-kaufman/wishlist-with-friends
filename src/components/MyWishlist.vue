<template>
  <main>
    <h2>My Wishlist <font-awesome-icon icon="fa-regular fa-square-check" /></h2>
    <ItemForm @listRefresh="listRefresh" />
    <ItemList ref="itemList" />
  </main>
</template>

<script>
import ItemList from "./ItemList.vue";
import ItemForm from "./ItemForm.vue";
import { ref } from "vue";

const itemList = ref();

export default {
  name: "MyWishlist",
  components: { ItemList, ItemForm },
  methods: {
    listRefresh() {
      this.$refs.itemList.getItems();
    },
  },
};
</script>

<style>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
