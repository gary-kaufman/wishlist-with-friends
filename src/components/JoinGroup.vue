<template>
  <main>
    <input type="text" placeholder="Group Name" v-model="group_name" />
    <input type="text" placeholder="Group Password" v-model="group_password" />
    <span v-if="errorMessage.isError" class="errorMessage">{{ errorMessage.message }}</span>
    <button @click.prevent="joinGroup">Join Group</button>
  </main>
</template>
<script>
import { db, auth } from "../includes/firebase";
import {collection, query, getDocs, where, doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
export default {
  name: "JoinGroup",
  data() {
    return {
      group_name: "",
      group_password: "",
      uid: "",
      errorMessage: {
        isError: false,
        message: "",
      }
    }
  },
    mounted() {
    onAuthStateChanged(auth, (user) => {
      this.uid = user.uid;
    });
  },
  methods: {
    async joinGroup() {
      if (this.group_name == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter valid Group Name.";
        return;
      } if (this.group_password == "") {
        this.errorMessage.isError = true;
        this.errorMessage.message = "Please enter valid password.";
        return;
      }
      try {
        // Initialize members holder
        let members = [];
        let real_password = "";
        // Get group by name
        const docRef = doc(db, "groups", this.group_name)
        const results = await getDoc(docRef);
        real_password = results.data().group_password;
        members = results.data().members;
        if (this.group_password === real_password) {
          members.push(this.uid);
          await setDoc(doc(db, "groups", this.group_name), {members: members}, {merge: true} )
          this.$router.push("/groups");  
        } else {
          this.errorMessage.isError = true;
          this.errorMessage.message = "Wrong Group Password";
          return;
        }      
      } catch (e) { 
          this.errorMessage.isError = true;
          this.errorMessage.message = "Group not found.";
          return;
       };
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
.errorMessage {
  color: red;
}
</style>