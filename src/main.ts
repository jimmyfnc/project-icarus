import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import node registry to initialize
import '@/runtime/nodes'

// Routes
import EditorView from './views/EditorView.vue'
import PlayView from './views/PlayView.vue'
import HomeView from './views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/editor', name: 'editor', component: EditorView },
    { path: '/play/:slug', name: 'play', component: PlayView }
  ]
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
