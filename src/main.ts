import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar, faXmark, faPlus, faShareNodes, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { faStar as farStar, faSquareCheck, faSquare, faShareFromSquare } from '@fortawesome/free-regular-svg-icons'
library.add(faStar, farStar, faSquareCheck, faXmark, faPlus, faSquare, faShareFromSquare, faShareNodes, faArrowUpRightFromSquare)
import router from "./includes/router";
import "nprogress/nprogress.css";

const pinia = createPinia()
const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(router)
app.mount('#app')
