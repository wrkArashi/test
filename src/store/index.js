import Vue from 'vue'
import Vuex from 'vuex'
// 1,引入api
import { Joggle } from '@/api/index.js';
Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		// 存储管理员信息
		userInfo: {}
	},
	mutations: {
		//因为action不能直接操作state,所以需要借助他来存储
		savaUserInfo(state, payload) {
			state.userInfo = payload;
		}
	},
	actions: {
		async loadInfo({ commit }) {
			let { Status, Values } = await Joggle.userInfo({ "user": sessionStorage.id })
			if (Status) {
				sessionStorage.version = Values[0].Version
				sessionStorage.Groups = Values[0].Groups
				sessionStorage.Roles = Values[0].Roles
				sessionStorage.Lng = Values[0].Lng
				sessionStorage.name = Values[0].Name
				sessionStorage.Product = Values[0].Product
				sessionStorage.Module = Values[0].Module
				commit('savaUserInfo', Values[0])
			} else {
				this.$message.info(Values)
			}
		}
	},
	modules: {}
})
