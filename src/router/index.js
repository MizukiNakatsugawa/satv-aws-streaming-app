import Vue from 'vue';
import VueRouter from 'vue-router';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
// import CheckLoginStatus from '../plugins/checkLoginStatus';
import store from '../store/index';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'top',
    component: () => import(/* webpackChunkName: "about" */ '../views/Signin.vue'),
    // meta: { requiresAuth: true },
  },
  {
    path: '/video',
    name: 'video',
    component: () => import(/* webpackChunkName: "about" */ '../views/VideoPlayer.vue'),
    meta: { requiresAuth: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// ログインしていない場合ログイン画面にリダイレクト
// router.beforeEach(async (to, from, next) => {
// const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
// if (requiresAuth && !(await CheckLoginStatus.checkStatus())) {
//   next({ path: '/', query: { redirect: to.fullPath } });
// } else {
//   next();
// }
//   const status = await CheckLoginStatus.checkStatus();
//   console.log(status);
//   next();
// });

onAuthUIStateChange((nextAuthState, authData) => {
  if (nextAuthState === AuthState.SignedIn) {
    store.commit('setUser', authData);
    // router.push({ path: '/' });
  }
  if (!authData) {
    // router.push({ path: '/' });
    store.commit('setUser', null);
  }
});

router.beforeResolve(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const useruser = store.state.user;
    if (!useruser) {
      return next({
        path: '/',
      });
    }
    return next();
  }
  return next();
});

export default router;
