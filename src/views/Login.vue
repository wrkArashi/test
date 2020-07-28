<template>
	<div class="bg">
		<el-card class="login">
			<div slot="header">
				<span>欢迎登录</span>
			</div>
			<el-form :model="Form" status-icon :rules="rules" ref="Form" class="demo-ruleForm" label-position="left" label-width="65px">
				<el-form-item label="账 户 :" prop="user">
					<el-input v-model="Form.user" placeholder="请输入账号名" prefix-icon="el-icon-user"></el-input>
				</el-form-item>
				<el-form-item label="密 码 :" prop="pwd">
					<el-input v-model="Form.pwd" type="password" placeholder="请输入密码" prefix-icon="el-icon-key"></el-input>
				</el-form-item>
				<div class="row">
					<el-form-item label="验 证 :" prop="code">
						<el-input v-model="Form.code" placeholder="请输入验证码" @keyup.enter.native="loginHandle()"></el-input>
					</el-form-item>
					<div class="code" @click="refreshCode">
						<s-identify :identifyCode="identifyCode"></s-identify>
					</div>
				</div>
				<el-form-item>
					<el-button type="primary" @click="loginHandle()">登录</el-button>
				</el-form-item>
			</el-form>
			<div class="flex">
				<div></div>
				<router-link to="/EditPassword">修改密码</router-link>
			</div>
		</el-card>
	</div>
</template>
<script>
	import SIdentify from '@/utils/Identify';
	import { Joggle } from '@/api/index.js';
	export default {
		name: 'App',
		components: {
			SIdentify
		},
		data() {
			var checkCode = (rule, value, callback) => {
				if (value != this.identifyCode) {
					callback(new Error('验证码错误'));
				} else {
					callback();
				}
			};
			return {
				identifyCodes: "1234567890",
				identifyCode: "",
				Form: {
					user: '',
					pwd: '',
					code: '',
				},
				rules: {
					user: [{
						required: true,
						message: '请输入账号名',
						trigger: 'blur'
					}],
					pwd: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, ],
					code: [{
							required: true,
							message: '请输入验证码',
							trigger: 'blur'
						},
						{ validator: checkCode, trigger: 'blur' }
					]
				}
			};
		},
		created() {
			// document.title = "登陆"
		},
		mounted() {
			this.identifyCode = "";
			this.makeCode(this.identifyCodes, 4);
		},
		methods: {
			randomNum(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			},
			refreshCode() {
				this.identifyCode = "";
				this.makeCode(this.identifyCodes, 4);
			},
			makeCode(o, l) {
				for (let i = 0; i < l; i++) {
					this.identifyCode += this.identifyCodes[
						this.randomNum(0, this.identifyCodes.length)
					];
				}
			},
			loginHandle() {
				let formData = { ...this.Form };
				let data = {
					"user": formData.user,
					"pwd": formData.pwd
				}
				this.$refs.Form.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.login(data)
						if (Status) {
							sessionStorage.token = Values
							sessionStorage.id = data.user
							this.$message({
								message: '登陆成功',
								type: 'success',
								duration: 1000,
								onClose: () => {
									let { redirect } = this.$route.query
									if (redirect) {
										this.$router.push(redirect)
										return;
									}
									this.$router.push('/test/appointment')
								}
							})
						} else {
							this.$message.warning(Values);
						}
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	.login {
		.row {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.el-form-item {
				width: 74%;
			}

			.code {
				margin-left: 10px;
				margin-bottom: 18px;
			}
		}

		@media screen and (max-device-width: 480px) {
			.el-form-item {
				// margin-bottom: 40px;
			}
		}
	}
</style>
