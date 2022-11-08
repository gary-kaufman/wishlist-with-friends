<template>
  <main>
    <h2 v-if="display_name">{{ display_name }}'s Wishlist <font-awesome-icon icon="fa-regular fa-square-check" /></h2>
    <span id="share_list" @click="share_link"><font-awesome-icon icon="fa-regular fa-share-from-square" />  Share List!</span>
    <span v-if="message.showMessage" 
    style="color: green; 
    align-self: flex-end; 
    margin-bottom: 1rem;">{{ message.message }}</span>
    <ItemForm @listRefresh="listRefresh" v-if="display_name"/>
    <ItemList ref="itemList" v-if="display_name"/>
  </main>
</template>

<script>
import ItemList from "./ItemList.vue";
import ItemForm from "./ItemForm.vue";
import { ref } from "vue";
import { auth, db } from "../includes/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { getDoc } from "@firebase/firestore";

const itemList = ref();

export default {
  name: "MyWishlist",
  components: { ItemList, ItemForm },
  data() {
    return  {
      display_name: "",
      email_for_lookup: "",
      uid: "",
      message: {
        showMessage: false,
        message: "",
      }
    }
  },
  methods: {
    listRefresh() {
      this.$refs.itemList.getItems();
    },
    share_link() {
      const list_link = `https://wishlist-with-friends.gkaufman.dev/#/wishlist/${this.uid}`
      navigator.clipboard.writeText(list_link);
      this.message.showMessage = true;
      this.message.message = "List copied to clipboard!";
      }
  },
  async mounted() {
    await onAuthStateChanged(auth, (user) => {
      this.display_name = user.displayName;
      this.uid = user.uid;
    })
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

#share_list {
  align-self: flex-end;
  margin-bottom: 1rem;
}
</style>
