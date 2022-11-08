<template>
  <section id="ItemList">
    <ul>
      <li v-for="item in favoriteItems" :key="item.url">
          <a :href="item.url"  target="_blank" rel="noopener noreferrer"><h4 id="item_name">{{ item.name }}</h4></a>
          <button @click="favoriteItem(item)" class="favoriteIcon">
            <font-awesome-icon v-if="item.favorite === false" icon="fa-regular fa-star" size="xl"/>
            <font-awesome-icon v-else icon="fa-solid fa-star" size="xl"/>
          </button>
          <button id="xmark" @click="deleteItem(item)">
            <font-awesome-icon icon="fa-solid fa-xmark" size="xl" />
          </button>
      </li>
      <li v-for="item in items" :key="item.url">
          <a :href="item.url"  target="_blank" rel="noopener noreferrer"><h4 id="item_name">{{ item.name }}</h4></a>
          <button @click="favoriteItem(item)" class="favoriteIcon">
            <font-awesome-icon v-if="item.favorite === false" icon="fa-regular fa-star" size="xl"/>
            <font-awesome-icon v-else icon="fa-solid fa-star" size="xl"/>
          </button>
          <button id="xmark" @click="deleteItem(item)">
            <font-awesome-icon icon="fa-solid fa-xmark" size="xl"/>
          </button>
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

export default {
  name: "ItemList",
  data() {
    return {
      favoriteItems: [],
      items: [],
      itemIDs: [],
      uid: "",
    };
  },
  methods: {
    async getItems() {
      if (this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;
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
section {
  margin-bottom: 1rem;
}

h3 {
  text-align: center;
}


#xmark {
  color: red;
}

a {
  flex-grow: 1;
  color: white;

}

</style>
