import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from '@router/index'

const app = createApp(App)
const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(Quasar, {
  plugins: {
    Notify,
  },
  config: {
    notify: {
      position: 'top-right',
      timeout: 3000,
    },
  },
})
app.use(router)

app.mount('#app')
