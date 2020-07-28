import Vue from 'vue'
import axios from 'axios'

import { Loading, Message } from 'element-ui';
// 引入路由实例
import router from '@/router/index.js'

let loading;
// 设置baseURL，自动将api地址前面拼接，${baseURL}/api/path
axios.defaults.baseURL = 'http://27.223.90.126:9860';
// axios.defaults.baseURL = 'http://10.10.11.163:9860';

// 请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	loading = Loading.service({ background: 'rgba(0,0,0,0.7)' });
	// 排除登录、注册两个api,忽略token校验
	if (config.url == '/api/OEP/Login' || config.url == '/api/OEP/ChgPwd') {
		return config;
	}
	if (!sessionStorage.token) {
		Message.error({
			message: 'token失效，请重新登录系统！',
			onClose: () => {
				router.replace('/login');
				loading.close();
			}
		});
	}
	config.headers['token'] = sessionStorage.token;
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(({
	status,
	data,
	response
}) => {
	//在这里你可以判断后台返回数据携带的请求码
	loading.close();
	if (status === 200) {
		return data;
	} else {
		// 非200请求抱错
		Message.error('服务异常');
		// throw Error(data.msg || '服务异常');
	}
}, function(error) {
	// console.log(error)
	// 对响应错误做点什么
	return Promise.reject(error);
});



// // 小菊的
// // 添加响应拦截器
// axios.interceptors.response.use(function({ status, data, response }) {
// 	//在这里你可以判断后台返回数据携带的请求码
// 	loading.close();
// 	switch (status) {
// 		case 200:
// 			return data;
// 			break;
// 		default:
// 			Message.error(response.statusText);
// 			break;
// 	}
// }, function(error) {
// 	// 拦截401状态码
// 	if (error.response.status == 401) {
// 		let expiredTime = new Date(error.response.data.inner.expiredAt).toLocaleString();
// 		Message.error({
// 			message: `Token已过期,有效期至${expiredTime}，请重新登录！`,
// 			onClose: () => {
// 				router.replace('/login');
// 				loading.close();
// 			}
// 		});
// 	}
// 	// 对响应错误做点什么
// 	return Promise.reject(error);
// });
