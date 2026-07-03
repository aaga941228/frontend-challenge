import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
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

app.mount('#app')
