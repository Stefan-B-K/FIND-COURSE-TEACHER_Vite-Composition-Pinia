import { createRouter, createWebHistory } from "vue-router";
import TeacherList from "./routes/teachers/TeacherList.vue";
import ContactTeacher from "./routes/applications/ContactTeacher.vue";
import TeacherDetail from "./routes/teachers/TeacherDetail.vue";
import PageNotFound from "./routes/PageNotFound.vue";
import UserLogin from "./routes/auth/UserLogin.vue";
import store from "./store.js";
import { useAuth } from "./stores/auth.js";

const TeacherRegistration = () => import("./routes/teachers/TeacherRegistration.vue");
const ApplicationsReceived = () => import("./routes/applications/ApplicationsReceived.vue");

const auth = useAuth(store);

const routes = [
  { path: "/", redirect: "/teachers" },
  { path: "/teachers", component: TeacherList },
  {
    path: "/teachers/:id",
    component: TeacherDetail,
    props: true,
    children: [
      { path: "contact", component: ContactTeacher }                                  //     /teachers/t1/contact
    ]
  },
  {
    path: "/register",
    component: TeacherRegistration,
    meta: { needsAuth: true }
  },
  {
    path: "/applications",
    component: ApplicationsReceived,
    meta: { needsAuth: true }
  },
  {
    path: "/auth",
    component: UserLogin,
    meta: { shouldBeLoggedOut: true }
  },
  { path: "/:catchAll(.*)", component: PageNotFound }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, _, next) => {
  if (to.meta.needsAuth && !auth.userIsLoggedIn) next('/auth')
  else if (to.meta.shouldBeLoggedOut && auth.userIsLoggedIn) next('/teachers')
  else next()
  next();
});

export default router;