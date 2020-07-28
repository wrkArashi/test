<template>
	<div class="navBar">
		<div class="flex">
			<div class="title">在线考试评估系统</div>
			<div class="list">
				<div class="info">你好，{{userInfo.Name}}</div>
				<router-link to="/test/userInfo" class="item" style="color: white;">
					<div><i class="el-icon-user"></i></div>
					<div class="text">个人信息</div>
				</router-link>
				<router-link to="/test/userGroup" class="item" style="color: white;" v-if="userInfo.Groups=='Admin'">
					<div><i class="el-icon-suitcase-1"></i></div>
					<div class="text">用户分组</div>
				</router-link>
				<router-link to="/test/user" class="item" style="color: white;" v-if="userInfo.Groups=='Admin'">
					<div><i class="el-icon-setting"></i></div>
					<div class="text">用户管理</div>
				</router-link>
				<router-link to="/test/bank" class="item" style="color: white;" v-if="userInfo.Groups=='Admin'">
					<div><i class="el-icon-folder-opened"></i></div>
					<div class="text">题库管理</div>
				</router-link>
				<router-link to="/test/signUp" class="item" style="color: white;" v-if="userInfo.Groups=='Admin'">
					<div><i class="el-icon-tickets"></i></div>
					<div class="text">报名记录</div>
				</router-link>
				<router-link to="/test/appointment" class="item" style="color: white;">
					<div><i class="el-icon-document-checked"></i></div>
					<div class="text">预约考试</div>
				</router-link>
				<router-link to="/test/historyScore" class="item" style="color: white;">
					<div><i class="el-icon-document-copy"></i></div>
					<div class="text">历史成绩</div>
				</router-link>
				<div class="item" @click="clear">
					<!-- <router-link to="/" style="color: white;"> -->
					<div><i class="el-icon-switch-button"></i></div>
					<div class="text">退出系统</div>
					<!-- </router-link> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapMutations, mapState, mapActions } from 'vuex'
	import { Joggle } from '@/api/index.js'
	export default {
		data() {
			return {
				studentAnswer: []
			};
		},
		// 暂时留着
		created() {
			this.loadInfo()
		},
		computed: {
			...mapState(['userInfo']),
		},
		methods: {
			// 获取用户的数据显示到右上角			
			...mapActions(['loadInfo']),
			clear() {
				if (sessionStorage.getItem("testValue")) {
					this.$confirm('您有考试未交卷，确认退出系统？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$router.push('/')
						sessionStorage.clear()
					}).catch(() => {
						// this.$confirm('是否提交考试', '提示', {
						// 	confirmButtonText: '确定',
						// 	cancelButtonText: '取消',
						// 	type: 'warning'
						// }).then(() => {
						// 	this.handPaper1()
						// }).catch(() => {});
					});
					return;
				}
				this.$confirm('确认退出系统?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$router.push('/')
					sessionStorage.clear()
				}).catch(() => {

				});
			},
			// 被迫交卷
			// async handPaper1() {
			// 	this.studentAnswer = JSON.parse(sessionStorage.studentAnswer)
			// 	for (var i = 0; i < this.studentAnswer.length; i++) {
			// 		if (this.studentAnswer[i].Answer.length == 0) {
			// 			this.studentAnswer[i].Answer = ''
			// 		}
			// 	}
			// 	let { Status, Values } = await Joggle.end({ 'data': this.studentAnswer })
			// 	if (Status) {
			// 		this.$message({
			// 			message: '已交卷，您的得分率' + Values + '%',
			// 			type: 'success',
			// 			duration: 5000,
			// 		})
			// 		this.$router.push('/test/historyScore')
			// 		sessionStorage.removeItem('studentAnswer');
			// 		sessionStorage.removeItem('testId');
			// 		sessionStorage.removeItem('testValue');
			// 		sessionStorage.removeItem('testTime');
			// 	} else {
			// 		this.$message.warning(Values);
			// 	}
			// },
		}
	}
</script>

<style lang="scss">
	.navBar {
		a {
			text-decoration: none;
		}

		.info {
			margin-right: 10px;
		}

		color: white;

		.title {
			font-size: 32px;
			line-height: 80px;
		}

		.hello {
			line-height: 80px;
			margin-right: 10px;
		}

		.list {
			font-size: 16px;
			overflow: hidden;
			display: flex;
			align-items: center;

			.item {
				padding: 0px 20px;
				text-align: center;
				margin-right: 10px;
				-webkit-transition-duration: 0.3s;
				transition-duration: 0.3s;
				-webkit-transition-property: -webkit-transform;
				transition-property: transform;
				-webkit-transform: translateZ(0);
				-ms-transform: translateZ(0);
				transform: translateZ(0);
				box-shadow: 0 0 1px rgba(0, 0, 0, 0);
				overflow: auto;

				i {
					font-size: 30px;
					padding-top: 14px;
					margin-bottom: 1px;
				}

				.text {
					padding-bottom: 14px;
					margin-top: 1px;
				}
			}

			.item:hover {
				background-color: rgba(0, 0, 0, 0.1);
				-webkit-transform: scale(1.1);
				-ms-transform: scale(1.1);
				transform: scale(1.1);
			}
		}

		//iphone适配
		@media screen and (max-device-width: 480px) {
			.title {
				display: none;
			}

			.info {
				display: none;
			}

			.list {
				width: 100%;
				justify-content: space-between;
			}
		}
	}
</style>
