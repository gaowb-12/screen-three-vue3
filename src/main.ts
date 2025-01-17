import { createApp } from "vue"
import router from "./router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from "./App.vue"
// import "normalize.css"
import "./style.css"
import { registerEcharts } from "@/components/echart/init"


let app = createApp(App)
registerEcharts(app)
app.use(ElementPlus)
app.use(router).mount("#app")

