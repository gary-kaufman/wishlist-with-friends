<template>
  <main>
    <section id="selector">
      <button><router-link to="/join_group">Join Group</router-link></button>
      <button><router-link to="/create_group">Create Group</router-link></button>
    </section>
    <section>
      <h2>My Groups</h2>
      <p v-if="isEmpty">Join a group or create your own!</p>
      <ul>
        <li v-for="group in group_names" :key="group.docID">
          <router-link
            :to="{ name: 'groupById', params: { id: group.docID } }"
            >{{ group.group_name }}</router-link
          >
        </li>
      </ul>
    </section>
  </main>
</template>
<script>
import { db, auth } from "../includes/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";
import NProgress from "nprogress";

export default {
  name: "GroupsView",
  data() {
    return {
      group_names: [],
      uid: "",
      isEmpty: false,
    };
  },
  methods: {
    async getGroups() {
      NProgress.start();
      const q = query(
        collection(db, "groups"),
        where("members", "array-contains", this.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.group_names.push({ docID: doc.id, ...doc.data() });
      });
      if (this.group_names.length == 0) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
      NProgress.done();
    },
  },
  async created() {
    await onAuthStateChanged(auth, (user) => {
      this.uid = user.uid;
    });
    this.getGroups();
  },
};
</script>
<style scoped>
li {
  justify-content: center;
}

#selector {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

button {
  flex-grow: 1;
}

a {
  padding: 1rem;
  color: white;
}
</style>
