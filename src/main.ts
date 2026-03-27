import { createApp, type Component } from 'vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import App from './App.vue';
import './assets/main.css';

// Routes
const routes: readonly RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: (): Promise<Component> => import('./views/DashboardView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
});

const app = createApp(App);
app.use(router);
app.mount('#app');
