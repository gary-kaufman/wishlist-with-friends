<template>
  <main>
    <input type="text" placeholder="Group Name" v-model="group_name" />
    <input type="text" placeholder="Group Password" v-model="group_password" />
    <span v-if="errorMessage.isError" class="errorMessage">{{ errorMessage.message }}</span>
    <button @click.prevent="createGroup">Create Group</button>
  </main>
</template>

<script>
import { db, auth } from "../includes/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "CreateGroup",
  data() {
    return {
      group_name: "",
      group_password: "",
      uid: "",
      errorMessage: {
        isError: false,
        message: "",
      }
    };
  },
  mounted() {
    onAuthStateChanged(auth, (user) => {
      this.uid = user.uid;
    });
  },
  methods: {
    async createGroup() {
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
        const docRef = doc(db, "groups", this.group_name)
        const results = await getDoc(docRef);
        if (results.data().group_name) {
          this.errorMessage.isError = true;
          this.errorMessage.message = "Group Name already in use.";
          return;
        }
      } catch (e) { console.log(e) };
      try {
        await setDoc(doc(db, "groups", this.group_name), {
          group_name: this.group_name,
          group_password: this.group_password,
          members: [this.uid],
        });
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

.errorMessage {
  color: red;
}
</style>