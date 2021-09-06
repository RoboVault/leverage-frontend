import { createApp } from "vue";
import App from "./App.vue";
import VueToast from "vue-toast-notification";
import "tailwindcss/tailwind.css";
//import 'vue-toast-notification/dist/theme-default.css';
import "vue-toast-notification/dist/theme-sugar.css";

createApp(App).use(VueToast).mount("#app");
