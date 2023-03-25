import {
	createSSRApp
} from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia';
import utils from "@/static/js/utils.js"
console.log(utils);
export function createApp() {
	const app = createSSRApp(App);
	app.use(Pinia.createPinia());
	app.config.globalProperties.$utils = utils;
	return {
		app,
		Pinia,
	}
}
