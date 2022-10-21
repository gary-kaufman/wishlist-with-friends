<template>
  <section id="ItemList">
    <ul>
      <li v-for="item in favoriteItems" :key="item.url">
        <div class="text_and_button">
          <h3 id="item_name">{{ item.name }}</h3>
          <button @click="favoriteItem(item)">
            <font-awesome-icon
              v-if="item.favorite === false"
              icon="fa-regular fa-star"
            />
            <font-awesome-icon v-else icon="fa-solid fa-star" />
          </button>
        </div>

        <div class="text_and_button">
          <a id="item_url">{{ item.url }}</a>
          <button @click="markAsPurchased(item)">
            <span v-if="!item.purchased">Mark as Purchased</span>
            <span v-else style="color: green">Purchased</span>
          </button>
          <button id="xmark" @click="deleteItem(item)">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>

          <!-- <font-awesome-icon icon="fa-solid fa-star" /> -->
        </div>
      </li>
      <li v-for="item in items" :key="item.url">
        <div class="text_and_button">
          <h3 id="item_name">{{ item.name }}</h3>
          <button @click="favoriteItem(item)">
            <font-awesome-icon
              v-if="item.favorite === false"
              icon="fa-regular fa-star"
            />
            <font-awesome-icon v-else icon="fa-solid fa-star" />
          </button>
        </div>

        <div class="text_and_button">
          <a id="item_url">{{ item.url }}</a>
          <button @click="markAsPurchased(item)">
            <span v-if="!item.purchased">Mark as Purchased</span>
            <span v-else style="color: green">Purchased</span>
          </button>
          <button id="xmark" @click="deleteItem(item)">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>

          <!-- <font-awesome-icon icon="fa-solid fa-star" /> -->
        </div>
      </li>
    </ul>
  </section>
</template>
<script>
import { db } from "../includes/firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  setDoc,
  orderBy,
} from "firebase/firestore";

export default {
  name: "ItemList",
  data() {
    return {
      pendingRequest: false,
      favoriteItems: [],
      items: [],
      itemIDs: [],
    };
  },
  methods: {
    async getItems() {
      if (this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;
      const q = query(collection(db, "items"), where("favorite", "==", false));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (!this.itemIDs.includes(doc.id)) {
          this.itemIDs.push(doc.id);
          this.items.push({
            docID: doc.id,
            ...doc.data(),
          });
        }
      });
      const fq = query(collection(db, "items"), where("favorite", "==", true));
      const fQuerySnapshot = await getDocs(fq);
      fQuerySnapshot.forEach((doc) => {
        if (!this.itemIDs.includes(doc.id)) {
          this.itemIDs.push(doc.id);
          this.favoriteItems.push({
            docID: doc.id,
            ...doc.data(),
          });
        }
      });
      this.pendingRequest = false;
    },
    async favoriteItem(item) {
      try {
        const itemRef = doc(db, "items", item.docID);
        if (item.favorite === false) {
          await setDoc(itemRef, { favorite: true }, { merge: true });
          this.items.splice(this.items.indexOf(item), 1);
          this.favoriteItems.push(item);
          item.favorite = true;
          //this.itemIDs.splice(this.itemIDs.indexOf(item.docID));
        } else {
          await setDoc(itemRef, { favorite: false }, { merge: true });
          this.favoriteItems.splice(this.favoriteItems.indexOf(item), 1);
          this.items.push(item);
          item.favorite = false;
          //this.itemIDs.splice(this.itemIDs.indexOf(item.docID));
        }
      } catch (e) {
        console.log(e);
      }

      this.getItems();
    },
    async deleteItem(item) {
      await deleteDoc(doc(db, "items", item.docID));
      this.items.splice(this.items.indexOf(item), 1);
    },
  },
  async created() {
    this.getItems();
  },
};
</script>
<style>
section {
  margin-bottom: 1rem;
}

ul {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 60%;
  margin: auto;
  list-style: none;
  padding-left: 0;
}

li {
  background-color: #2b2a33;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-style: solid;
  border-color: #2b2a33;
  border-radius: 2px;
}

h3 {
  text-align: center;
}

.text_and_button {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

#item_url,
#item_name {
  flex-grow: 1;
}

#xmark {
  color: red;
}
</style>
