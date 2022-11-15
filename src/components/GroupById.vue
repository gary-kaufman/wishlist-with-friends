<template>
  <div>
  <h1>{{ group_name }}</h1>
  <li><a>{{ display_name }} (Me)</a></li>
  <p v-if="isEmpty">Invite some friends to join with the Group Name and Password!</p>
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
import NProgress from "nprogress";

export default {
  name: "GroupById",
  data() {
    return {
      group_name: "",
      members: [],
      uid: "",
      isEmpty: false,
      display_name: "",
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
      NProgress.start();
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
          } else {
            this.display_name = doc.data().username;
          }
        })
      }
      if (this.members == 0) {
        this.isEmpty = true;
      } else {
        this.isEmpty = false;
      }
      NProgress.done();
    },
  },
};
</script>
<style scoped>
h1 {
  color: rgb(34, 64, 108);
}

li {
  justify-content: center;
}

a {
  padding: 1rem;
  color: white;
}
</style>
