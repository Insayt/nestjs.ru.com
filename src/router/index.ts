import { createWebHistory, createRouter } from "vue-router";
import Auth from "../views/Auth.vue";
// import About from "@/views/About.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Auth,
  },
  // {
  //   path: "/about",
  //   name: "About",
  //   component: About,
  // },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
