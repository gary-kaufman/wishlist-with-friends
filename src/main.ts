import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar, faSquareCheck, faSquare } from '@fortawesome/free-regular-svg-icons'
library.add(faStar, farStar, faSquareCheck, faXmark, faPlus, faSquare)
import router from "./includes/router";


const pinia = createPinia()
const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(router)
app.mount('#app')
