import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
import { useUserStore } from './stores/user';
Amplify.configure(config);

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)


// const userStore = useUserStore();
// userStore.initializeUser();

app.mount('#app')
