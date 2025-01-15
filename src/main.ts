import { createApp } from "vue"
import router from "./router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from "./App.vue"
// import "normalize.css"
import "./style.css"
let app = createApp(App)
app.use(ElementPlus)
app.use(router).mount("#app")
