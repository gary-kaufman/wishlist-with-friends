<template>
  <div>
  <h1>{{ group_name }}</h1>
  <ul>
    <li v-for="member in members" :key="member.uid">
      <router-link
            :to="{ name: 'wishlistById', params: { id: member.uid } }"
            >{{ member.username }}</router-link
          >
    </li>
  </ul></div>
</template>
<script>
import { db, auth } from "../includes/firebase";
import { getDocs, doc, getDoc, where, collection, query } from "firebase/firestore";
import { onAuthStateChanged } from "@firebase/auth";
export default {
  name: "GroupById",
  data() {
    return {
      group_name: "",
      members: [],
      uid: "",
    };
  },
  async created() {
    await onAuthStateChanged(auth, (user) => {
      this.uid = user.uid;
    });
  },
  mounted() {
    this.getMembers();
  },
  methods: {
    async getMembers() {
      const docRef = doc(db, "groups", this.$route.params.id);
      const querySnapshot = await getDoc(docRef);
      this.group_name = querySnapshot.data().group_name;
      const memberIds = querySnapshot.data().members;
      for (const member of memberIds) {
        const userRef = collection(db, "users");
        const q = query(userRef, where("uid", "==", member));
        const snap = await getDocs(q);
        snap.forEach(doc => {
          if (doc.data().uid !== this.uid) {
            this.members.push(doc.data());
          }
        })
      }

    },
  },
};
</script>
<style scoped>
li {
  justify-content: center;
}

a {
  padding: 1rem;
  color: white;
}
</style>
