import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n/i18n.ts'
import { z } from 'zod'
import { errorMap } from './components/calculation/form/errorMap.ts'

const app = createApp(App)
app.use(i18n)

z.config({
  customError: errorMap,
})

app.mount('#app')
