import Vue from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCube, faVial, faCampground, faFireAlt, faWater } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faCube, faVial, faCampground, faFireAlt, faWater)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import VueNativeSock from "vue-native-websocket";
Vue.use(VueNativeSock, "ws://192.168.1.2:9000/", { 
	format: 'json',
	reconnection: true, // (Boolean) whether to reconnect automatically (false)
	reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
	reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000) 
});

import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
