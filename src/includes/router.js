import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import LogoutView from "../views/LogoutView.vue";
import GroupsView from "../views/GroupsView.vue";
import CreateGroup from "../components/CreateGroup.vue";
import JoinGroup from "../components/JoinGroup.vue";
import GroupById from "../components/GroupById.vue";
import WishlistById from "../components/WishlistById.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/login", component: LoginView },
    { path: "/logout", component: LogoutView },
    { path: "/groups", component: GroupsView },
    { path: "/create_group", component: CreateGroup },
    { path: "/join_group", component: JoinGroup },
    { name: "groupById", path: "/groups/:id", component: GroupById },
    { name: "wishlistById", path: "/wishlist/:id", component: WishlistById },
  ],
});

// Unimplemented guarding...
/* 
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

router.beforeEach((to, from, next) => {
  onAuthStateChanged(auth, (user) => {
    if (to.path === "/logout" && !user) {
      next();
      return;
    } else if (to.path !== "/login" && !user) {
      next({ path: "/login" });
      return;
    } else {
      next();
      return;
    }
  });
}); */

export default router;
