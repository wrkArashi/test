<template>
	<el-card class="appointment box-card">
		<div slot="header" class="flex">
			<el-button class="editSize" type="text" @click="addtHandle()">添加预约</el-button>
			<el-button @click="delAll()">删除选中考试</el-button>
		</div>
		<el-table @selection-change="handleSelectionChange" :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)">
			<el-table-column sortable prop="Brand" label="品牌" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Product" label="产品" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Module" label="模块" width="" :show-overflow-tooltip="true"></el-table-column>
			<!-- <el-table-column sortable prop="Total" label="总分" width="" :show-overflow-tooltip="true"></el-table-column> -->
			<el-table-column sortable prop="BeginTimes" label="开始时间" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="EndTimes" label="结束时间" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="CreateDate" label="创建时间" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column width="170px">
				<template slot="header" slot-scope="scope">
					<div>操作</div>
				</template>
				<template slot-scope="scope">
					<!-- <el-button size="mini" plain="" type="success" @click="begin(scope.$index, scope.row)">开始考试</el-button> -->
					<el-button size="mini" type="primary" @click='editHandle(scope.$index, scope.row)' plain :disabled="scope.row.Status== 'run'">
						<i class="el-icon-edit"></i>修改</el-button>
					<el-button size="mini" type="danger" @click='delHandle(scope.$index, scope.row)' plain :disabled="scope.row.Status== 'run'">
						<i class="el-icon-delete"></i>删除</el-button>
				</template>
			</el-table-column>
			<el-table-column width="90px" fixed="right">
				<template slot-scope="scope">
					<el-button size="mini" plain="" type="success" @click="begin(scope.$index, scope.row)">
						<span v-if="scope.row.Status== 'wait'">开始考试</span>
						<span v-if="scope.row.Status== 'run'">考试中</span>
					</el-button>
				</template>
			</el-table-column>
			<el-table-column align="center" type="selection" width="42" fixed="right"></el-table-column>
		</el-table>
		<div class="block">
			<el-pagination :page-sizes="[5, 10, 15, 20]" @size-change="handleSizeChange" :page-size="pagesize" @current-change="handleCurrentChange"
			 :current-page="currentPage" layout="total, sizes, prev, pager, next, jumper" :total="tableData.length">
			</el-pagination>
		</div>
		<!-- 预约考试框 -->
		<el-dialog :modal-append-to-body='false' title="预约考试" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
		 :destroy-on-close="true">
			<el-form :model="form" :rules="rules" ref="form">
				<!-- 		<el-form-item label="开始时间" prop="BeginTimes">
					<date-picker :open.sync="open" v-model="form.BeginTimes" :minute-step="30" :hour-options="hours" :second-step="60"
					 value-type="format" type="datetime" placeholder="选择日期时间" popup-class=zIndex @change="handleChange"></date-picker>
				</el-form-item> -->
				<el-form-item label="开始时间" prop="BeginTimes">
					<el-date-picker v-model="form.BeginTimes" type="datetime" placeholder="选择开始日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel()">取 消</el-button>
				<el-button type="primary" @click="sureSubmit('form')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 修改考试框 -->
		<el-dialog :modal-append-to-body='false' title="修改考试时间" :visible.sync="dialogEditFormVisible" :close-on-click-modal="false"
		 :destroy-on-close="true">
			<el-form :model="editForm" :rules="rules" ref="editForm">
				<el-form-item label="开始时间" prop="BeginTimes">
					<el-date-picker v-model="BeginTimes" type="datetime" placeholder="选择开始日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
					<!-- 					<date-picker :open.sync="open1" v-model="BeginTimes" :minute-step="30" :hour-options="hours" :second-step="60"
					 value-type="format" type="datetime" placeholder="选择日期时间" popup-class=zIndex @change="handleChange1"></date-picker> -->
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="sureEditCancel">取 消</el-button>
				<el-button type="primary" @click="sureEditSubmit('editForm')">确定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import DatePicker from 'vue2-datepicker';
	import 'vue2-datepicker/index.css';
	import { Joggle } from '@/api/index.js';
	export default {
		components: { DatePicker },
		data() {
			return {
				open1: false,
				open: false,
				hours: Array.from({ length: 24 }).map((_, i) => i),
				BeginTimes: "",
				Product: this.Global.Product,
				Module: this.Global.Module,
				form: {
					"ID": "",
					"UserID": '',
					"Brand": 'SAP',
					"Product": '',
					"Version": '',
					"Module": '',
					"Groups": '',
					"Roles": '',
					"Lng": '',
					"Total": 0,
					"Scores": 0,
					"Ratio": 0,
					"Status": 'wait',
					"BeginTimes": '',
					"EndTimes": '',
					"CreateDate": '',
				},
				editForm: {
					"ID": "",
					"UserID": '',
					"Brand": 'SAP',
					"Product": '',
					"Version": '',
					"Module": '',
					"Groups": '',
					"Roles": '',
					"Lng": '',
					"Total": 0,
					"Scores": 0,
					"Ratio": 0,
					"Status": 'wait',
					"BeginTimes": '',
					"EndTimes": '',
					"CreateDate": '',
				},
				numList: [],
				multipleSelection: [],
				dialogFormVisible: false,
				dialogEditFormVisible: false,
				// 分页
				currentPage: 1,
				pagesize: 10,
				tableData: [],
				rules: {
					Product: { required: true, message: '不能为空', trigger: 'blur' },
					Module: { required: true, message: '不能为空', trigger: 'blur' },
					BeginTimes: { required: true, message: '不能为空', trigger: 'blur' },
				}
			}
		},
		created() {
			this.loadList()
			// document.title = "预约考试";
		},
		methods: {
			handleChange(value, type) {
				if (type === 'minute') {
					this.open = false;
				}
			},
			handleChange1(value, type) {
				if (type === 'minute') {
					this.open1 = false;
				}
			},
			// 修改取消
			sureEditCancel() {
				this.dialogEditFormVisible = false
			},
			// 确定修改
			sureEditSubmit() {
				this.editForm.BeginTimes = this.BeginTimes
				this.editForm.EndTimes = this.editForm.BeginTimes
				this.$refs.editForm.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.chgOrder({ data: [this.editForm] })
						if (Status) {
							this.$message.success(Values)
							this.loadList()
							this.dialogEditFormVisible = false;
							this.BeginTimes = ""
						} else {
							this.$message.warning(Values)
						}
					}
				})
			},
			// 修改
			editHandle(index, row) {
				this.dialogEditFormVisible = true
				this.editForm = Object.assign({}, row);
			},
			// 删除
			delHandle(index, row) {
				this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { Status, Values } = await Joggle.delOrder({ 'ids': row.ID })
					if (Status) {
						this.$message.success(Values);
						this.loadList()
					} else {
						this.$message.warning(Values);
					}
				}).catch(() => {
					this.$message.info('已取消删除');
				})
			},
			// 删除多个
			delAll() {
				for (var i = 0; i < this.multipleSelection.length; i++) {
					this.numList.push(this.multipleSelection[i].ID)
				}
				this.$confirm('此操作将不可撤销, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { Status, Values } = await Joggle.delOrder({ 'ids': this.numList.toString() })
					if (Status) {
						this.$message.success(Values);
						this.loadList()
						this.numList = []
					} else {
						this.$message.warning(Values);
					}
				}).catch(() => {
					this.$message.info('已取消删除');
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			async begin(index, row) {
				if (sessionStorage.getItem('studentAnswer')) {
					if (row.ID != sessionStorage.testId) {
						this.$message.warning('您有进行中的考试，请前往')
					} else {
						this.$router.push('/test/start')
					}
				} else {
					let { Status, Values } = await Joggle.begin({ "examID": row.ID })
					if (Status) {
						this.$router.push('/test/start')
						// 后台传来的整张试卷是以QuestionID排序的，sortID方法将试卷以Num排序
						// function sortId(a, b) {
						// 	return a.Num - b.Num
						// }
						// Values = Values.sort(sortId) //排序好的试卷
						function shuffle(arr) {
							for (let i = arr.length - 1; i >= 0; i--) {
								let rIndex = Math.floor(Math.random() * (i + 1));
								let temp = arr[rIndex];
								arr[rIndex] = arr[i];
								arr[i] = temp;
							}
							return arr;
						}
						shuffle(Values)
						sessionStorage.testValue = JSON.stringify(Values)
						sessionStorage.testId = row.ID
						sessionStorage.testTime = row.EndTimes
						if (!sessionStorage.getItem('studentAnswer')) {
							sessionStorage.studentAnswer = JSON.stringify([])
						}
					} else {
						this.$message.warning(Values[0].Msg)
					}
				}
			},
			// 点击预约取消
			cancel() {
				this.dialogFormVisible = false
			},
			// 点击预约确定
			sureSubmit(form) {
				var timestamp = new Date().getTime()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.form.Groups = sessionStorage.Groups
				this.form.Roles = sessionStorage.Roles
				this.form.Lng = sessionStorage.Lng
				this.form.Version = sessionStorage.version
				this.form.CreateDate = time
				this.form.ID = timestamp
				this.form.UserID = sessionStorage.id
				this.form.EndTimes = this.form.BeginTimes
				this.form.Product = sessionStorage.Product
				this.form.Module = sessionStorage.Module
				var data = {
					data: [{ ...this.form }]
				}
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.order(data)
						if (Status) {
							this.$message.success(Values)
							this.loadList()
							this.dialogFormVisible = false;
							this.$refs["form"].resetFields()
						} else {
							this.$message.warning(Values)
						}
					}
				})
			},
			// 点击预约
			addtHandle() {
				this.dialogFormVisible = true
			},
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			// 获取考试列表
			async loadList() {
				let { Status, Values } = await Joggle.examList()
				if (Status) {
					this.tableData = Values
				} else {
					this.$message.warning(Values)
				}
			}
		}
	}
</script>

<style lang="scss">
	.zIndex {
		z-index: 3000;
	}

	.appointment {
		font-size: 16px;

		.el-select-dropdown__wrap el-scrollbar__wrap {
			margin: 0;
		}

		.editSize {
			font-size: 16px;
		}

		.el-dialog {
			width: 350px;
		}

		/* iphone适配 */
		@media screen and (max-device-width: 480px) {
			.el-dialog {
				width: 400px;
			}
		}
	}
</style>
