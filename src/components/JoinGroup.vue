<template>
  <main>
    <input type="text" placeholder="Group Name" v-model="group_name" />
    <input type="text" placeholder="Group Password" v-model="group_password" />
    <button @click.prevent="joinGroup">Join Group</button>
  </main>
</template>
<script>
import { db, auth } from "../includes/firebase";
import {collection, query, getDocs, where, doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
export default {
  name: "JoinGroup",
  data() {
    return {
      group_name: "",
      group_password: "",
      uid: "",
    }
  },
    mounted() {
    onAuthStateChanged(auth, (user) => {
      this.uid = user.uid;
    });
  },
  methods: {
    async joinGroup() {
      try {
        // Initialize members holder
        let members = [];
        let real_password = "";
        // Get group by name
        const groupRef = collection(db, "groups");
        const q = query(groupRef, where("group_name", "==", this.group_name));
        const groupSnap = await getDocs(q);
        groupSnap.forEach(doc =>{
        real_password = doc.data().group_password;
        members = doc.data().members;
        })
        // Check if password matches
        if (this.group_password === real_password) {
          members.push(this.uid);
        // setDoc with updated members list
          await setDoc(doc(db, "groups", this.group_name), {members: members}, {merge: true} )    
        }
        console.log("Joined group!")
      } catch (e) { console.log(e) };
      this.$router.push("/groups");
    },
  }
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>