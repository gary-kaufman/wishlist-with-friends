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
        <button id="add_item_button" @click.prevent="addItem"><font-awesome-icon style="color: white;" icon="fa-solid fa-plus" size="2x"/></button>
      </div>
    </form>
    <span v-if="errorMessage.isError" :style="this.messageColor">{{ errorMessage.message }}</span>
    <span v-else :style="this.messageColor">{{ errorMessage.message }}</span>

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
      errorMessage: {
        isError: false,
        message: "",
      }
    };
  },
  computed: {
    messageColor() {
      if(this.errorMessage.isError) {
        return "color: red";
      } else {
        return "color: green";
      }
    }
  },
  methods: {
    async addItem() {
      if (this.new_item_name == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter item name.";
        return;
      } if (this.new_item_url == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter item URL.";
        return;
      }
      this.errorMessage.isError = false;
      this.errorMessage.message = `${this.new_item_name} added!`;
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
  border: solid 1px rgb(34, 64, 108);
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
