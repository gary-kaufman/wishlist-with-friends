<template>
  <section id="AddItemForm">
    <form id="new_item_form" ref="new_item_form" autocomplete="off">
      <input type="text" placeholder="Item Name" v-model="new_item_name" />
      <div id="url_and_button">
        <input
          type="text"
          placeholder="Item URL"
          id="item_url"
          v-model="new_item_url"
        />
        <button id="add_item_button" @click.prevent="addItem"><font-awesome-icon style="color: green;" icon="fa-solid fa-plus" size="2x"/></button>
      </div>
    </form>
  </section>
</template>
<script>
import { db, auth } from "../includes/firebase";
import { collection, addDoc } from "firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";

export default {
  name: "ItemForm",
  data() {
    return {
      new_item_name: "",
      new_item_url: "",
      uid: "",
    };
  },
  methods: {
    async addItem() {
      try {
        const docRef = await addDoc(collection(db, "items"), {
          name: this.new_item_name,
          url: this.new_item_url,
          purchased: false,
          favorite: false,
          date: new Date(),
          uid: this.uid,
        });
        this.$emit("listRefresh");
        this.new_item_name = "",
        this.new_item_url = "",
        this.$refs.new_item_form.reset();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
  },
  async created() {
    await onAuthStateChanged(auth, (user) => {
      this.uid = user.uid;
    });
  },
};
</script>

<style scoped>
section {
  margin-bottom: 1rem;
}

#new_item_form {
  display: flex;
  flex-direction: column;
  margin: auto;
}

#url_and_button {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

#item_url {
  flex-grow: 1;
}

#add_item_button {
  width: 20%;
  align-self: flex-end;
}
</style>
