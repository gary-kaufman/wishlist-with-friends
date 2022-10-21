import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar, faSquareCheck } from '@fortawesome/free-regular-svg-icons'
library.add(faStar, farStar, faSquareCheck, faXmark)



const pinia = createPinia()
const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)

app.use(pinia)

app.mount('#app')
