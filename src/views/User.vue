<template>
	<el-card class="box-card user">
		<div slot="header">
			<el-button class="editSize" type="text" @click="addtHandle()">添加用户</el-button>
			<el-input style="float: right; width: 220px;" v-model="search" placeholder="请输入搜索内容" />
		</div>
		<el-table :data="tables.slice((currentPage-1)*pagesize,currentPage*pagesize)">
			<el-table-column sortable prop="ID" label="编号" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Name" label="姓名" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Mobile" label="手机号" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Brand" label="品牌" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Product" label="产品" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Version" label="版本" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Module" label="模块" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Groups" label="分组" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Roles" label="角色" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Lng" label="语言" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Num" label="可用次数" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Pwd" label="密码" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="CreateDate" label="创建日期" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="InvalidDate" label="失效日期" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column align="center" width="90px">
				<template slot="header" slot-scope="scope">
					<div>操作</div>
				</template>
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click='editHandle(scope.$index, scope.row)' plain>
						<i class="el-icon-edit"></i>编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tables.length">
			</el-pagination>
		</div>
		<!-- 编辑弹窗 -->
		<el-dialog :modal-append-to-body='false' title="编辑用户" :visible.sync="editModalShow" :show-close='false'
		 :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form :model="editForm" :rules="rules" ref="editForm" label-width="90px">
				<el-form-item label="编号" prop="ID">
					<el-input v-model="editForm.ID" disabled></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="Name">
					<el-input v-model="editForm.Name"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="Pwd">
					<el-input v-model="editForm.Pwd"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="Mobile">
					<el-input v-model="editForm.Mobile"></el-input>
				</el-form-item>
				<el-form-item label="可用次数" prop="Num">
					<el-input v-model.number="editForm.Num" type="number" placeholder="请输入数字"></el-input>
				</el-form-item>
				<el-form-item label="产品" prop="Product">
					<el-select v-model="editForm.Product">
						<el-option v-for="item in Product" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模块" prop="Module">
					<el-select v-model="editForm.Module">
						<el-option v-for="item in Module" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分组" prop="Groups">
					<el-select v-model="editForm.Groups" @change="currentGroup">
						<el-option v-for="item in Groups" :label="item.Groups" :value="item.Groups"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色" prop="Roles">
					<el-select v-model="editForm.Roles" :disabled="this.rolesDis">
						<el-option v-for="item in Roles" :label="item.Roles" :value="item.Roles"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="语言" prop="Lng">
					<el-input v-model="editForm.Lng"></el-input>
				</el-form-item>
				<el-form-item label="失效日期" prop="InvalidDate">
					<el-date-picker v-model="editForm.InvalidDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日"
					 value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="版本" prop="Version">
					<el-input v-model.number="editForm.Version" placeholder="默认请填:1809"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditModal">取 消</el-button>
				<el-button type="primary" @click="edit">完 成</el-button>
			</div>
		</el-dialog>
		<!-- 点击添加用户 -->
		<el-dialog :modal-append-to-body='false' title="添加用户" :visible.sync="dialogFormVisible" :show-close='false'
		 :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form :model="form" :rules="rules" ref="form" label-width="90px">
				<el-form-item label="编号" prop="ID">
					<el-input v-model="form.ID"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="Name">
					<el-input v-model="form.Name"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="Pwd">
					<el-input v-model="form.Pwd"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="Mobile">
					<el-input v-model="form.Mobile"></el-input>
				</el-form-item>
				<el-form-item label="可用次数" prop="Num">
					<el-input v-model.number="form.Num" type="number" placeholder="请输入数字"></el-input>
				</el-form-item>
				<el-form-item label="产品" prop="Product">
					<el-select v-model="form.Product">
						<el-option v-for="item in Product" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="模块" prop="Module">
					<el-select v-model="form.Module">
						<el-option v-for="item in Module" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分组" prop="Groups">
					<el-select v-model="form.Groups" @change="currentGroup">
						<el-option v-for="item in Groups" :label="item.Groups" :value="item.Groups"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="角色" prop="Roles">
					<el-select v-model="form.Roles">
						<el-option v-for="item in Roles" :label="item.Roles" :value="item.Roles"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="语言" prop="Lng">
					<el-input v-model="form.Lng"></el-input>
				</el-form-item>
				<el-form-item label="失效日期" prop="InvalidDate">
					<el-date-picker v-model="form.InvalidDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="版本" prop="Version">
					<el-input v-model.number="form.Version" type="number" placeholder="默认请填:1809"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="close">取 消</el-button>
				<el-button type="primary" @click="sure('form')">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				rolesDis: true,
				Roles: [],
				Groups: [],
				Product: this.Global.Product,
				Module: this.Global.Module,
				// 搜索
				search: '',
				// 分页
				currentPage: 1,
				pagesize: 10,
				tableData: [],
				// 添加框
				dialogFormVisible: false,
				// 添加表单
				form: {
					"ID": "",
					"Name": "",
					"Mobile": '',
					"Brand": '',
					"Product": '',
					"Version": '',
					"Module": '',
					"Groups": "",
					"Roles": "",
					"Lng": '',
					"Num": '',
					"Pwd": '',
					"CreateDate": '',
					"InvalidDate": ''
				},
				// 编辑框
				editModalShow: false,
				// 编辑表单
				editForm: {
					"ID": "",
					"Name": "",
					"Mobile": '',
					"Brand": '',
					"Product": '',
					"Version": '',
					"Module": '',
					"Groups": "",
					"Roles": "",
					"Lng": '',
					"Num": '',
					"Pwd": '',
					"CreateDate": '',
					"InvalidDate": ''
				},
				selGroup: "",
				rules: {
					ID: { required: true, message: '不能为空', trigger: 'blur' },
					Pwd: { required: true, min: 3, max: 16, message: '密码长度为3-16位', trigger: 'blur' },
					Name: { required: true, message: '不能为空', trigger: 'blur' },
					InvalidDate: { required: true, message: '不能为空', trigger: 'blur' },
					Num: { required: true, message: '不能为空', trigger: 'blur' },
					Groups: { required: true, message: '不能为空', trigger: 'blur' },
					Roles: { required: true, message: '不能为空', trigger: 'blur' },
					Product: { required: true, message: '不能为空', trigger: 'blur' },
					Module: { required: true, message: '不能为空', trigger: 'blur' },
					Lng: { required: true, message: '不能为空', trigger: 'blur' },
					Version: { required: true, message: '不能为空', trigger: 'blur' },
				}
			}
		},
		created() {
			this.loadList();
			this.getGroup();
			// document.title = "用户管理"
		},
		computed: {
			tables: function() {
				var search = this.search;
				if (search) {
					return this.tableData.filter(function(dataNews) {
						return Object.keys(dataNews).some(function(key) {
							return String(dataNews[key]).toLowerCase().indexOf(search) > -1
						})
					})
				}
				return this.tableData
			}
		},
		methods: {
			// 获取角色
			async currentGroup(selval) {
				let { Status, Values } = await Joggle.roleList({ groups: selval })
				if (Status) {
					this.Roles = Values
					this.rolesDis = false
				} else {
					this.$message.warning(Values);
				}
			},
			// 获取分组
			async getGroup() {
				let { Status, Values } = await Joggle.groupList()
				if (Status) {
					this.Groups = Values
				}
			},
			// 点击编辑
			editHandle(index, row) {
				this.editModalShow = true;
				this.editForm = Object.assign({}, row);
			},
			// 点击编辑模态框的取消
			closeEditModal(editForm) {
				this.editModalShow = false;
				this.rolesDis = true
			},
			// 点击编辑模态框的完成
			edit() {
				var data = {
					data: [{ ...this.editForm }]
				}
				this.$refs.editForm.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.chgUser(data)
						if (Status) {
							this.$message.success(Values)
							this.loadList()
							this.editModalShow = false;
							this.rolesDis = true
						} else {
							this.$message.warning(Values)
						}
					}
				})
			},
			// 点击添加
			addtHandle() {
				this.dialogFormVisible = true
			},
			//点击添加模态框的取消
			close() {
				this.dialogFormVisible = false
				this.$refs["form"].resetFields()
				this.rolesDis = true
			},
			// 点击添加弹框的确定
			sure(form) {
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.form.CreateDate = time
				this.form.Brand = 'SAP'
				var data = {
					data: [{ ...this.form }]
				}
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.addUser(data)
						if (Status) {
							this.$message.success(Values)
							this.loadList()
							this.dialogFormVisible = false;
							this.$refs["form"].resetFields()
							this.rolesDis = true
						} else {
							this.$message.warning(Values)
						}
					}
				})
			},
			// 载入
			async loadList() {
				let { Status, Values } = await Joggle.userList()
				if (Status) {
					this.tableData = Values
				} else {
					this.$message.warning(Values)
				}
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
		}
	}
</script>

<style lang="scss">
	.user {
		.editSize {
			font-size: 16px;
		}

		.el-dialog {
			width: 600px;
		}
	}
</style>
