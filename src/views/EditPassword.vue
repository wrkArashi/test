<template>
	<div class="bg">
		<el-card class="edit">
			<div slot="header">
				<span>修改密码</span>
			</div>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
				<el-form-item label="账 户 :" prop="ID">
					<el-input v-model="ruleForm.ID" placeholder="请输入账号名"></el-input>
				</el-form-item>
				<el-form-item label="旧密码 :" prop="pwd">
					<el-input type="password" v-model="ruleForm.pwd" placeholder="请输入旧密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码 :" prop="pass">
					<el-input type="password" v-model="ruleForm.pass" placeholder="请输入新密码"></el-input>
				</el-form-item>
				<el-form-item label="确认密码 :" prop="checkPass">
					<el-input type="password" v-model="ruleForm.checkPass" placeholder="请再次输入新密码"  @keyup.enter.native="submitForm('ruleForm')"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
			<div class="flex">
				<div></div>
				<router-link to="/login">返回登陆</router-link>
			</div>
		</el-card>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (this.ruleForm.checkPass !== '') {
						this.$refs.ruleForm.validateField('checkPass');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ruleForm: {
					pwd: '',
					ID: '',
					pass: '',
					checkPass: '',
				},
				rules: {
					pwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
					ID: [{ required: true, message: '请输入账号名', trigger: 'blur' }, ],
					pass: [
						{ required: true, validator: validatePass, trigger: 'blur' },
						{ min: 3, max: 16, message: '密码长度为3-16位', trigger: 'blur' }
					],
					checkPass: [
						{ required: true, validator: validatePass2, trigger: 'blur' },
						{ min: 3, max: 16, message: '密码长度为3-16位', trigger: 'blur' }
					],
				}
			}
		},
		created() {
			// document.title = "修改密码"
		},
		methods: {
			submitForm(ruleForm) {
				var content = {
					"user": this.ruleForm.ID,
					"oldpwd": this.ruleForm.pwd,
					"newpwd": this.ruleForm.checkPass
				}
				this.$refs[ruleForm].validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.chgPwd(content)
						if (Status) {
							this.$message({
								message: '修改成功，正在返回登录页',
								type: 'success',
								duration: 2000,
								onClose: () => {
									let { redirect } = this.$route.query
									if (redirect) {
										this.$router.push(redirect)
										return;
									}
									this.$router.push('/login')
								}
							})
						} else {
							this.$message.warning(Values);
						}
					}
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
		}
	}
</script>

<style lang="scss">
	.edit {
		@media screen and (max-device-width: 480px) {
			.el-form-item {
				// margin-bottom: 40px;
			}
		}
	}
</style>
