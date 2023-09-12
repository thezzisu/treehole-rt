import 'virtual:uno.css'
import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './plugins/router'

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')
