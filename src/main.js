import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vant, { ConfigProvider } from 'vant';
import '@vant/touch-emulator';
import 'vant/lib/index.css';
import '@/styles/vant.theme.css';
import router from './router'
import store from './store'

const app = createApp(App)
app.use(vant)
app.use(ConfigProvider)
app.use(store)
app.use(router)
app.mount('#app')
