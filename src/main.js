import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/axios'
import './plugins/element.js'
import './utils/rem'
Vue.config.productionTip = false
import vueXlsxTable from 'vue-xlsx-table';
Vue.use(vueXlsxTable, { rABS: false });
import global from './api/global.js'
Vue.prototype.Global = global
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
