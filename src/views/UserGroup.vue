<template>
	<el-card class="userGroup">
		<div slot="header" class="header">
			<div class="header">
				<div>选择权限组： </div>
				<el-select v-model="selGroup" @change="currentGroup" style="margin-right: 10px;">
					<el-option v-for="item in groupList" :label="item.Groups" :value="item.Groups"></el-option>
				</el-select>
				<el-button @click="editRole">查看/编辑</el-button>
				<el-button @click="delRole">删除该组</el-button>
				<el-button @click="addRole">添加角色</el-button>
			</div>
			<el-button @click="dialogAddGroup=true">添加新组</el-button>
		</div>
		<el-table :data="roleData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
			<el-table-column prop="Groups" label="组名称" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Roles" label="角色名" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="IsEx" label="是否解析" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="IsAn" label="是否带答案" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="WeightAS" label="A库单选权重" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="WeightAM" label="A库多选权重" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="WeightBS" label="B库单选权重" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="WeightBM" label="B库多选权重" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Describe" label="描述" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="CreateDate" label="创建日期" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column align="left" width="180px">
				<template slot="header" slot-scope="scope">
					<div>操作</div>
				</template>
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click='editHandle(scope.$index, scope.row)' plain>
						<i class="el-icon-edit"></i>编辑</el-button>
					<el-button size="mini" type="danger" @click='delHandle(scope.$index, scope.row)' plain>
						<i class="el-icon-delete"></i>删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="roleData.length">
			</el-pagination>
		</div>
		<el-dialog :modal-append-to-body='false' title="添加角色" :visible.sync="dialogAddRole" :close-on-click-modal="false"
		 :destroy-on-close="true">
			<el-form :model="AddRoleForm" :rules="rules" ref="AddRoleForm" label-width="113px">
				<el-form-item label="角色名称" prop="Roles">
					<el-input v-model="AddRoleForm.Roles"></el-input>
				</el-form-item>
				<el-form-item label="是否解析" prop="IsEx">
					<el-radio-group v-model="AddRoleForm.IsEx">
						<el-radio label='1'>是</el-radio>
						<el-radio label='0'>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否带答案" prop="IsAn">
					<el-radio-group v-model="AddRoleForm.IsAn">
						<el-radio label='1'>是</el-radio>
						<el-radio label='0'>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="A库单选权重" prop="WeightAS">
					<el-input v-model.number="AddRoleForm.WeightAS" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="A库多选权重" prop="WeightAM">
					<el-input v-model.number="AddRoleForm.WeightAM" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="B库单选权重" prop="WeightBS">
					<el-input v-model.number="AddRoleForm.WeightBS" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="B库多选权重 " prop="WeightBM">
					<el-input v-model.number="AddRoleForm.WeightBM" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="Describe">
					<el-input v-model="AddRoleForm.Describe"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAddRole=false">取 消</el-button>
				<el-button type="primary" @click="AddRoleSure('AddRoleForm')">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog :modal-append-to-body='false' title="添加分组" :visible.sync="dialogAddGroup" :close-on-click-modal="false"
		 :destroy-on-close="true">
			<el-form :model="AddGroupForm" :rules="rules" ref="AddGroupForm" label-width="113px">
				<el-form-item label="组名称" prop="Groups">
					<el-input v-model="AddGroupForm.Groups" placeholder="组名不可重复"></el-input>
				</el-form-item>
				<el-form-item label="是否解析" prop="IsEx">
					<el-radio-group v-model="AddGroupForm.IsEx">
						<el-radio label='1'>是</el-radio>
						<el-radio label='0'>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否带答案" prop="IsAn">
					<el-radio-group v-model="AddGroupForm.IsAn">
						<el-radio label='1'>是</el-radio>
						<el-radio label='0'>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="A库单选权重" prop="WeightAS">
					<el-input v-model.number="AddGroupForm.WeightAS" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="A库多选权重" prop="WeightAM">
					<el-input v-model.number="AddGroupForm.WeightAM" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="B库单选权重" prop="WeightBS">
					<el-input v-model.number="AddGroupForm.WeightBS" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="B库多选权重 " prop="WeightBM">
					<el-input v-model.number="AddGroupForm.WeightBM" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="Describe">
					<el-input v-model="AddGroupForm.Describe"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogAddGroup=false">取 消</el-button>
				<el-button type="primary" @click="AddGroupSure('AddGroupForm')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑弹窗 -->
		<el-dialog :modal-append-to-body='false' title="编辑角色" :visible.sync="editModalShow" :show-close='false'>
			<el-form :model="editForm" :rules="rules" ref="editForm" label-width="113px">
				<el-form-item label="是否解析" prop="IsEx">
					<el-radio-group v-model="editForm.IsEx">
						<el-radio label='是'>是</el-radio>
						<el-radio label='否'>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否带答案" prop="IsAn">
					<el-radio-group v-model="editForm.IsAn">
						<el-radio label='是'>是</el-radio>
						<el-radio label='否'>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="A库单选权重" prop="WeightAS">
					<el-input v-model.number="editForm.WeightAS" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="A库多选权重" prop="WeightAM">
					<el-input v-model.number="editForm.WeightAM" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="B库单选权重" prop="WeightBS">
					<el-input v-model.number="editForm.WeightBS" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="B库多选权重 " prop="WeightBM">
					<el-input v-model.number="editForm.WeightBM" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="Describe">
					<el-input v-model="editForm.Describe"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditModal">取 消</el-button>
				<el-button type="primary" @click="edit('editForm')">完 成</el-button>
			</div>
		</el-dialog>
		<!-- 查看编辑 -->
		<el-dialog :modal-append-to-body='false' title="编辑组" :visible.sync="dialogEditGroup" :show-close='false'
		 :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form :model="editForm" :rules="rules" ref="editForm" label-width="113px">
				<el-form-item label="是否解析" prop="IsEx">
					<el-radio-group v-model="editForm.IsEx">
						<el-radio label='是'>是</el-radio>
						<el-radio label='否'>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="是否带答案" prop="IsAn">
					<el-radio-group v-model="editForm.IsAn">
						<el-radio label='是'>是</el-radio>
						<el-radio label='否'>否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="A库单选权重" prop="WeightAS">
					<el-input v-model.number="editForm.WeightAS" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="A库多选权重" prop="WeightAM">
					<el-input v-model.number="editForm.WeightAM" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="B库单选权重" prop="WeightBS">
					<el-input v-model.number="editForm.WeightBS" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="B库多选权重 " prop="WeightBM">
					<el-input v-model.number="editForm.WeightBM" placeholder="请输入数字0~80"></el-input>
				</el-form-item>
				<el-form-item label="描述" prop="Describe">
					<el-input v-model="editForm.Describe"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogEditGroup=false">取 消</el-button>
				<el-button type="primary" @click="editGroup('editForm')">完 成</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				// 分页
				currentPage: 1,
				pagesize: 10,
				roleData: [], //角色表格
				AddRoleForm: {
					"Groups": "",
					"Roles": "",
					"IsEx": "",
					"IsAn": "",
					"WeightAS": "",
					"WeightAM": "",
					"WeightBS": "",
					"WeightBM": "",
					"Describe": "",
					"CreateDate": ""
				},
				AddGroupForm: {
					"Groups": "",
					"Roles": "",
					"IsEx": "",
					"IsAn": "",
					"WeightAS": "",
					"WeightAM": "",
					"WeightBS": "",
					"WeightBM": "",
					"Describe": "",
					"CreateDate": ""
				},
				editForm: {
					"Groups": "",
					"Roles": "",
					"IsEx": "",
					"IsAn": "",
					"WeightAS": "",
					"WeightAM": "",
					"WeightBS": "",
					"WeightBM": "",
					"Describe": "",
					"CreateDate": ""
				},
				groupDetail: '', //组详情
				selGroup: "", //当前选择的组
				groupList: [], //所有组
				dialogAddGroup: false,
				dialogAddRole: false,
				editModalShow: false,
				dialogEditGroup: false,
				rules: {
					Roles: { required: true, message: '请填入角色名', trigger: 'blur' },
					Groups: { required: true, message: '请填入组名称', trigger: 'blur' },
					IsEx: { required: true, message: '不能为空', trigger: 'blue' },
					IsAn: [{ required: true, message: '不能为空', trigger: 'blur' }],
					WeightAS: [
						{ required: true, type: 'number', message: '请填入数字', trigger: 'blur' },
						{
							pattern: /^60$|^(\d|[1-9]\d)$/,
							message: '数值范围为大于等于0小于等于80',
							trigger: 'blur'
						}
					],
					WeightAM: [
						{ required: true, type: 'number', message: '请填入数字', trigger: 'blur' },
						{
							pattern: /^20$|^(\d|[1-9]\d)$/,
							message: '数值范围为大于等于0小于等于80',
							trigger: 'blur'
						}
					],
					WeightBS: [
						{ required: true, type: 'number', message: '请填入数字', trigger: 'blur' },
						{
							pattern: /^60$|^(\d|[1-9]\d)$/,
							message: '数值范围为大于等于0小于等于80',
							trigger: 'blur'
						}
					],
					WeightBM: [
						{ required: true, type: 'number', message: '请填入数字', trigger: 'blur' },
						{
							pattern: /^20$|^(\d|[1-9]\d)$/,
							message: '数值范围为大于等于0小于等于80',
							trigger: 'blur'
						}
					]
				}
			}
		},
		created() {
			this.loadList()
			// document.title = "用户分组"
		},
		methods: {
			// 删除组
			delRole() {
				if (this.roleData.length > 0) {
					this.$message.warning("删除失败，请先清空组下所有角色");
				} else {
					this.$confirm('此操作不可撤销, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(async () => {
						let { Status, Values } = await Joggle.delGroup({ 'groups': this.selGroup, 'roles': "Standard" })
						if (Status) {
							this.$message.success(Values);
							this.loadList()
						} else {
							this.$message.warning(Values);
						}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					})
				}
			},
			// 删除角色
			delHandle(index, row) {
				this.$confirm('此操作不可撤销, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { Status, Values } = await Joggle.delGroup({ 'groups': row.Groups, 'roles': row.Roles })
					if (Status) {
						this.$message.success(Values);
						this.loadList()
					} else {
						this.$message.warning(Values);
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				})
			},
			// 完成修改组
			editGroup() {
				this.editForm.Roles = ""
				this.$refs.editForm.validate(async (valid) => {
					if (valid) {
						if (this.editForm.IsAn == "是") {
							this.editForm.IsAn = 1
						}
						if (this.editForm.IsAn == "否") {
							this.editForm.IsAn = 0
						}
						if (this.editForm.IsEx == "是") {
							this.editForm.IsEx = 1
						}
						if (this.editForm.IsEx == "否") {
							this.editForm.IsEx = 0
						}
						let { Status, Values } = await Joggle.chgGroup({ data: [this.editForm] })
						if (Status) {
							this.$message.success(Values);
							this.dialogEditGroup = false
						} else {
							this.$message.warning(Values);
						}
					}
				})
			},
			// 点击查看组详情
			editRole() {
				if (this.selGroup != "") {
					this.dialogEditGroup = true
					this.editForm = this.groupDetail
					if (this.editForm.IsAn == 1) {
						this.editForm.IsAn = "是"
					}
					if (this.editForm.IsAn == 0) {
						this.editForm.IsAn = "否"
					}
					if (this.editForm.IsEx == 1) {
						this.editForm.IsEx = "是"
					}
					if (this.editForm.IsEx == 0) {
						this.editForm.IsEx = "否"
					}
				} else {
					this.$message.warning('请先选择权限组');
				}
			},
			// 点击编辑
			editHandle(index, row) {
				this.editModalShow = true;
				this.editForm = Object.assign({}, row);
			},
			// 点击编辑模态框的取消
			closeEditModal() {
				this.editModalShow = false;
			},
			// 点击编辑模态框的完成
			edit(editForm) {
				this.$refs.editForm.validate(async (valid) => {
					if (valid) {
						if (this.editForm.IsAn == "是") {
							this.editForm.IsAn = 1
						}
						if (this.editForm.IsAn == "否") {
							this.editForm.IsAn = 0
						}
						if (this.editForm.IsEx == "是") {
							this.editForm.IsEx = 1
						}
						if (this.editForm.IsEx == "否") {
							this.editForm.IsEx = 0
						}
						let { Status, Values } = await Joggle.chgGroup({ data: [this.editForm] })
						if (Status) {
							this.$message.success(Values);
							this.editModalShow = false
							this.currentGroup()
						} else {
							this.$message.warning(Values);
						}
					}
				})
			},
			// 当组改变，获取角色
			async currentGroup() {
				let { Status, Values } = await Joggle.roleList({ groups: this.selGroup })
				if (Status) {
					for (let i = 0; i < Values.length; i++) {
						if (Values[i].IsAn == true) {
							Values[i].IsAn = "是"
						}
						if (Values[i].IsAn == false) {
							Values[i].IsAn = "否"
						}
						if (Values[i].IsEx == true) {
							Values[i].IsEx = "是"
						}
						if (Values[i].IsEx == false) {
							Values[i].IsEx = "否"
						}
					}
					for (let i = 0; i < Values.length; i++) {
						if (Values[i].Roles == "Standard") {
							this.groupDetail = Values[i]
							Values.splice([i], 1)
						}
					}
					this.roleData = Values
				} else {
					this.$message.warning(Values);
				}
			},
			addRole() {
				if (this.selGroup != "") {
					this.dialogAddRole = true
				} else {
					this.$message.warning('请先选择权限组');
				}
			},
			// 添加角色
			async AddRoleSure(AddRoleForm) {
				this.$refs.AddRoleForm.validate(async (valid) => {
					if (valid) {
						var now = new Date(),
							y = now.getFullYear(),
							m = now.getMonth() + 1,
							d = now.getDate()
						var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
						this.AddRoleForm.CreateDate = time
						this.AddRoleForm.IsEx = parseInt(this.AddRoleForm.IsEx)
						this.AddRoleForm.IsAn = parseInt(this.AddRoleForm.IsAn)
						this.AddRoleForm.Groups = this.selGroup
						let { Status, Values } = await Joggle.addGroup({ data: [this.AddRoleForm] })
						if (Status) {
							this.$message.success(Values);
							this.dialogAddRole = false
							this.$refs["AddRoleForm"].resetFields()
							this.currentGroup()
						} else {
							this.$message.warning(Values);
						}
					}
				})
			},
			// 添加组
			AddGroupSure(AddGroupForm) {
				this.$refs.AddGroupForm.validate(async (valid) => {
					if (valid) {
						var now = new Date(),
							y = now.getFullYear(),
							m = now.getMonth() + 1,
							d = now.getDate()
						var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
						this.AddGroupForm.CreateDate = time
						this.AddGroupForm.IsEx = parseInt(this.AddGroupForm.IsEx)
						this.AddGroupForm.IsAn = parseInt(this.AddGroupForm.IsAn)
						let { Status, Values } = await Joggle.addGroup({ data: [this.AddGroupForm] })
						if (Status) {
							this.$message.success(Values);
							this.dialogAddGroup = false
							this.$refs["AddGroupForm"].resetFields()
							this.loadList()
						} else {
							this.$message.warning(Values);
						}
					}
				})
			},
			// 载入组
			async loadList() {
				let { Status, Values } = await Joggle.groupList()
				if (Status) {
					this.groupList = Values
					this.selGroup = this.groupList[0].Groups
					this.currentGroup()
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
	.userGroup {
		font-size: 16px;

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.seeGroup {
			padding: 10px 0;
			padding-left: 40px;
		}

		.el-dialog {
			width: 600px;
		}
	}
</style>
