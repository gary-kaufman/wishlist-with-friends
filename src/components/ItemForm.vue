<template>
  <section id="AddItemForm">
    <form id="new_item_form" ref="new_item_form" autocomplete="off">
      <input type="text" placeholder="Item Name" v-model="new_item_name" />
      <div id="url_and_button">
        <input type="text" placeholder="Item URL" id="item_url" v-model="new_item_url" />
        <button id="add_item_button" @click.prevent="addItem"><font-awesome-icon style="color: white;"
            icon="fa-solid fa-plus" size="2x" /></button>
      </div>
    </form>
    <div id="message" :style="this.messageColor">{{ message.message_text }}</div>

  </section>
</template>
<script>
import { db, auth } from "../includes/firebase";
import { collection, addDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";

export default {
  name: "ItemForm",
  data() {
    return {
      new_item_name: "",
      new_item_url: "",
      uid: "",
      message: {
        isError: false,
        message_text: "",
      }
    };
  },
  computed: {
    messageColor() {
      if (this.message.isError) {
        return "color: red";
      } else {
        return "color: green";
      }
    }
  },
  methods: {
    async addItem() {
      if (this.new_item_name == "") {
        this.message.isError = true;
        this.message.message_text = "Please enter item name.";
        console.log("no item name");
      } else if (this.new_item_url == "") {
        this.message.isError = true;
        this.message.message_text = "Please enter item URL.";
        console.log("no item url");
      } else {
        this.message.isError = false;
        this.message.message_text = `${this.new_item_name} added!`;
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
            this.new_item_url = ""
          console.log("new item added");
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      }
      let messageElement = document.getElementById("message");
      messageElement.classList.toggle("show");
      setTimeout(() => messageElement.classList.toggle("show"), 3000);
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
#message.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

#message {
  visibility: hidden;
  background-color: rgb(160, 188, 195);
  border: solid 1px rgb(34, 64, 108);
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  bottom: 30px;
  font-size: 17px;
  min-width: 250px;
  transform: translateX(-50%);
}

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

@-webkit-keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }

  to {
    bottom: 30px;
    opacity: 1;
  }
}

@keyframes fadein {
  from {
    bottom: 0;
    opacity: 0;
  }

  to {
    bottom: 30px;
    opacity: 1;
  }
}

@-webkit-keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }

  to {
    bottom: 0;
    opacity: 0;
  }
}

@keyframes fadeout {
  from {
    bottom: 30px;
    opacity: 1;
  }

  to {
    bottom: 0;
    opacity: 0;
  }
}
</style>
