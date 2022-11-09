<template>
  <main>
  <h2 v-if="display_name">{{ display_name }}'s Wishlist</h2>
<section id="ItemList">
    <ul>
      <li v-for="item in favoriteItems" :key="item.url">
          <font-awesome-icon id="favoriteIcon" icon="fa-solid fa-star" />
          <a :href="item.url"  target="_blank" rel="noopener noreferrer"><h4 id="item_name">{{ item.name }}</h4></a>
          <button @click="markAsPurchased(item)">
            <span v-if="!item.purchased"><font-awesome-icon icon="fa-regular fa-square" /> Mark as Purchased</span>
            <span v-else style="color: green"><font-awesome-icon icon="fa-regular fa-square-check" /> Purchased</span>
          </button>
      </li>
      <li v-for="item in items" :key="item.url">
          <a :href="item.url"  target="_blank" rel="noopener noreferrer"><h4 id="item_name">{{ item.name }}</h4></a>
          <button @click="markAsPurchased(item)">
            <span v-if="!item.purchased"><font-awesome-icon icon="fa-regular fa-square" /> Mark as Purchased</span>
            <span v-else style="color: green"><font-awesome-icon icon="fa-regular fa-square-check" /> Purchased</span>
          </button>
      </li>
    </ul>
  </section>
  </main>
</template>

<script>
import { db } from "../includes/firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import NProgress from "nprogress";
  export default {
    name: "WishlistById",
    data() {
      return {
        items: [],
        favoriteItems: [],
        itemIDs: [],
        display_name: "",
      }
    },
    methods: {
      async getItems(){
      NProgress.start();
      const q = query(
        collection(db, "items"),
        where("favorite", "==", false),
        where("uid", "==", this.$route.params.id)
      );
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
      const fq = query(
        collection(db, "items"),
        where("favorite", "==", true),
        where("uid", "==", this.$route.params.id)
      );
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
      NProgress.done();
      },
      async markAsPurchased(item) {
      if (item.purchased === false) {
        await updateDoc(doc(db, "items", item.docID), { purchased: true });
        item.purchased = true;
      } else {
        await updateDoc(doc(db, "items", item.docID), { purchased: false });
        item.purchased = false;
      }
      },
    },
    created() {
      this.getItems();
      
    },
    async beforeCreate() {
      console.log(this.$route.params.id);
      const usersRef = collection(db, "users")
      const docSnap = await getDocs(usersRef, where("uid", "==", this.$route.params.id));
      docSnap.forEach(doc => {
        if (doc.data().uid == this.$route.params.id) {
          this.display_name = doc.data().username;
        }
    })
   }
  }
</script>

<style scoped>
li {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 0.5rem;
}

#favoriteIcon {
  color: white;
  z-index: 99;
  position: relative;
  left: 10px;
  top: 10px;
  align-self: flex-start;
}

section {
  margin-bottom: 1rem;
}

h3 {
  text-align: center;
}

#item_name {
  width: auto;
}

a {
  flex-grow: 1;
  color: white;
}

button {
  padding: 0;
}
button:hover {
  border-color: transparent;
}
</style>