import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import axios from 'axios'
import 'vue3-dxui/dxui/dxui.css'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.provide('$axios',axios)
app.mount('#app')
