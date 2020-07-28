import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../components/Layout.vue'
import {
	Message
} from 'element-ui'

Vue.use(Router)
let router = new Router({
	routes: [{
		path: '/Login',
		alias: '/',
		name: 'Login',
		component: () => import('../views/Login.vue')
	}, {
		path: '/editPassword',
		alias: '/',
		name: 'EditPassword',
		component: () => import('../views/EditPassword.vue')
	}, {
		path: '/test/',
		name: 'LayoutTest',
		component: Layout,
		children: [{
				path: 'appointment',
				name: 'TestAppointment',
				component: () => import('../views/Appointment.vue'),
				meta: {
					requiredAuth: true
				},
			}, {
				path: 'start',
				name: 'TestStart',
				component: () => import('../views/Start.vue'),
				meta: {
					requiredAuth: true
				},
			},
			{
				path: 'historyScore',
				name: 'TestHistoryScore',
				component: () => import('../views/HistoryScore.vue'),
				meta: {
					requiredAuth: true
				},
			}, {
				path: 'user',
				name: 'TestUser',
				component: () => import('../views/User.vue'),
				meta: {
					requiredAuth: true
				},
			}, {
				path: 'bank',
				name: 'TestBank',
				component: () => import('../views/Bank.vue'),
				meta: {
					requiredAuth: true
				},
			}, {
				path: 'detail/:id',
				name: 'TestDetail',
				props: true,
				component: () => import('../views/Detail.vue'),
				meta: {
					requiredAuth: true
				},
			}, {
				path: 'userInfo',
				name: 'TestUserInfo',
				component: () => import('../views/UserInfo.vue'),
				meta: {
					requiredAuth: true
				},
			}, {
				path: 'userGroup',
				name: 'TestUserGroup',
				component: () => import('../views/UserGroup.vue'),
				meta: {
					requiredAuth: true
				},
			}, {
				path: 'signUp',
				name: 'TestSignUp',
				component: () => import('../views/SignUp.vue'),
				meta: {
					requiredAuth: true
				},
			}
		]
	}, ]
})
router.beforeEach(async (to, from, next) => {
	if (to.matched.some(record => record.meta.requiredAuth)) {
		// 无token,未登录
		if (!sessionStorage.token) {
			next({
				path: '/login',
				query: {
					redirect: to.fullPath
				}
			});
			return;
		}
		next();
	} else {
		next();
	}
});

export default router
