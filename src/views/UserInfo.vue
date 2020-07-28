<template>
	<el-card class="userInfo">
		<div slot="header">
			<span>个人信息</span>
		</div>
		<div class="item">编号：{{userInfo.ID}}</div>
		<div class="item">姓名：{{userInfo.Name}}</div>
		<div class="item">手机号：{{userInfo.Mobile}}</div>
		<div class="item">品牌：{{userInfo.Brand}}</div>
		<div class="item">产品：{{userInfo.Product}}</div>
		<div class="item">模块：{{userInfo.Module}}</div>
		<div class="item">分组：{{userInfo.Groups}}</div>
		<div class="item">角色：{{userInfo.Roles}}</div>
		<div class="item">语言：{{userInfo.Lng}}</div>
		<div class="item">可用次数：{{userInfo.Num}}</div>
		<div class="item">创建日期：{{userInfo.CreateDate}}</div>
		<div class="item">失效日期：{{userInfo.InvalidDate}}</div>
	</el-card>
</template>

<script>
	import { mapMutations, mapState, mapActions } from 'vuex'
	export default {
		data() {
			return {
				info: {}
			};
		},
		// 暂时留着
		created() {
			this.loadInfo()
			// document.title = "个人信息"
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			// 获取用户的数据显示到右上角			
			...mapActions(['loadInfo']),
		}
	}
</script>

<style lang="scss">
	.userInfo {
		width: 550px;
		margin: 0 auto;
		font-size: 16px;

		.item {
			padding: 16px 0;
		}
	}
</style>
