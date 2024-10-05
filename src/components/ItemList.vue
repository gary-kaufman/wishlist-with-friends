<template>
  <section id="ItemList">
    <p v-if="isEmpty">Add some items to start your wishlist!</p>
    <ul aria-live="assertive">

      <!-- Favorite Items List -->
      <li v-for="item in favoriteItems" :key="item.url + item.name" :id="item.url + item.name" class="show">
        <!-- Unlimited Icon -->
        <button @click="unlimitedItem(item)"><font-awesome-icon :class="{limited: !item.unlimited, unlimited: item.unlimited}" icon="fa-solid fa-infinity"/></button>
        
        <!-- Item Name-->
        <a :href="item.url" target="_blank" rel="noopener noreferrer"><h4 id="item_name">{{ item.name }}</h4></a>

        <!-- Idea Icon -->
        <button v-if="item.idea === true" disabled><font-awesome-icon style="color: white;" icon="fa-solid fa-lightbulb" size="2x"/></button>

        <!-- Favorite Button -->
        <button @click="favoriteItem(item)" class="favoriteIcon"><font-awesome-icon icon="fa-solid fa-star" size="lg" /></button>
        
        <!-- Delete Button -->
        <button class="xmark" @click="deleteItem(item)"><font-awesome-icon icon="fa-solid fa-xmark" size="xl" /></button>
      </li>

      <!-- Regular Items List -->
      <li v-for="item in items" :key="item.url + item.name" :id="item.url + item.name" class="show">
        <!-- Unlimited Icon -->
        <button @click="unlimitedItem(item)"><font-awesome-icon :class="{limited: !item.unlimited, unlimited: item.unlimited}" icon="fa-solid fa-infinity"/></button>
        
        <!-- Item Name -->
        <a :href="item.url" target="_blank" rel="noopener noreferrer"><h4 id="item_name">{{ item.name }}</h4></a>

        <!-- Idea Icon -->
        <button v-if="item.idea === true" disabled><font-awesome-icon style="color: white;" icon="fa-solid fa-lightbulb" size="2x"/></button>

        <!-- Favorite Button -->
        <button @click="favoriteItem(item)" class="favoriteIcon"><font-awesome-icon icon="fa-regular fa-star" size="lg" /></button>

        <!-- Delete Button -->
        <button class="xmark" @click="deleteItem(item)"><font-awesome-icon icon="fa-solid fa-xmark" size="xl" /></button>

      </li>
    </ul>
  </section>
</template>
<script>
import { db, auth } from "../includes/firebase";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import NProgress from "nprogress";

export default {
  name: "ItemList",
  data() {
    return {
      favoriteItems: [],
      items: [],
      itemIDs: [],
      uid: "",
      isEmpty: false
    };
  },
  methods: {
    async getItems() {
      NProgress.start();

      const q = query(
        collection(db, "items"),
        where("favorite", "==", false),
        where("uid", "==", this.uid)
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
        where("uid", "==", this.uid)
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

      if (this.favoriteItems.length == 0 & this.items.length == 0) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
      NProgress.done();
    },
    async favoriteItem(item) {
      try {
        const itemRef = doc(db, "items", item.docID);
        if (item.favorite === false) {
          await setDoc(itemRef, { favorite: true }, { merge: true });
          this.items.splice(this.items.indexOf(item), 1);
          this.favoriteItems.push(item);
          item.favorite = true;
        } else {
          await setDoc(itemRef, { favorite: false }, { merge: true });
          this.favoriteItems.splice(this.favoriteItems.indexOf(item), 1);
          this.items.push(item);
          item.favorite = false;
        }
      } catch (e) {
        console.log(e);
      }

      this.getItems();
    },
    async unlimitedItem(item) {
      console.log("UnlimtedItem function...");
      try {
        const itemRef = doc(db, "items", item.docID);
        if (item.unlimited === false) {
          await setDoc(itemRef, { unlimited: true }, { merge: true });
          item.unlimited = true;
        } else {
          await setDoc(itemRef, { unlimited: false }, { merge: true });
          item.unlimited = false;
        }
      } catch (e) {
        console.log(e);
      }

      this.getItems();
    },
    async deleteItem(item) {
      await deleteDoc(doc(db, "items", item.docID));
      let itemElement = document.getElementById(item.url + item.name);
      itemElement.classList.remove("show");
      itemElement.ontransitionend = function () {
        itemElement.remove();
      }
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
  async created() {
    await onAuthStateChanged(auth, (user) => {
      this.uid = user.uid;
    });
    this.getItems();
  },
};
</script>
<style scoped>
.show {
  max-height: 100px;
  visibility: visible;
}

li {
  max-height: 0;
  visibility: collapse;
  transition: all 0.6s ease;
  overflow: hidden;
}

.limited {
  color: gray;
}

.unlimited {
  color: green;
}

.xmark {
  color: red;
}

section {
  margin-bottom: 1rem;
}

h3 {
  text-align: center;
}

a {
  flex-grow: 1;
  color: white;
}
</style>
