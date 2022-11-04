<template>
  <main>
    <input type="text" placeholder="Group Name" v-model="group_name" />
    <input type="text" placeholder="Group Password" v-model="group_password" />
    <button @click.prevent="createGroup">Create Group</button>
  </main>
</template>

<script>
import { db, auth } from "../includes/firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "CreateGroup",
  data() {
    return {
      group_name: "",
      group_password: "",
      uid: "",
    };
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      this.uid = user.uid;
    });
  },
  methods: {
    async createGroup() {
      try {
        await setDoc(doc(db, "groups", this.group_name), {
          group_name: this.group_name,
          group_password: this.group_password,
          members: [this.uid],
        });
        console.log("Group " + this.group_name + " created");
      } catch (e) {
        console.log("error: " + e);
      }
      
      this.$router.push("/groups");
    },
  },
};
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>