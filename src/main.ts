import App from './App.vue'
import { createSSRApp } from 'vue'
import { createRouter } from './router'
import '@/scss/style.scss'
import three from './three'

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
export function createApp() {
  three()
  const app = createSSRApp(App)
  const router = createRouter()
  app.use(router)
  return { app, router }
}
