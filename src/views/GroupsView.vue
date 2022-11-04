<template>
  <main>
    <section id="selector">
      <button><router-link to="/join_group">Join Group</router-link></button>
      <button><router-link to="/create_group">Create Group</router-link></button>
    </section>
    <section>
      <h2>My Groups</h2>
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
export default {
  name: "GroupsView",
  data() {
    return {
      group_names: [],
      uid: "",
    };
  },
  methods: {
    async getGroups() {
      const q = query(
        collection(db, "groups"),
        where("members", "array-contains", this.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        this.group_names.push({ docID: doc.id, ...doc.data() });
      });
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
}
</style>
