<template>
	<el-card class="box-card signUp">
		<div slot="header" class="flex">
			<div class="flex">
				<el-button class="editSize" @click="dialogFormVisible=true" type="text" style="float: right;margin-right: 10px;">增加记录</el-button>
				<vue-xlsx-table style="float: right;" @on-select-file="handleSelectedFile">导入excel文件</vue-xlsx-table>
			</div>
			<el-button @click="delAll()">删除选中记录</el-button>
			<!-- <el-button @click="exportExcel">导出</el-button> -->
		</div>
		<!-- 		<el-table :data="tables" id="exportTab" style="display: none;">
			<el-table-column prop="ID" label="身份证" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Name" label="姓名" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Title" label="称谓" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Mail" label="邮箱" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Module" label="模块" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Mobile" label="手机号" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Nation" label="国家" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="City" label="城市" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Street" label="街道" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="PostCode" label="邮编" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Groups" label="分组" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Amounts" label="合同金额" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Status" label="报名状态" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="CreateDate" label="创建日期" :show-overflow-tooltip="true" sortable=""></el-table-column>
		</el-table> -->
		<el-table @selection-change="handleSelectionChange" :data="tables.slice((currentPage-1)*pagesize,currentPage*pagesize)">
			<el-table-column prop="ID" label="身份证" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Name" label="姓名" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Title" label="称谓" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Mail" label="邮箱" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Module" label="模块" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Mobile" label="手机号" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Nation" label="国家" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="City" label="城市" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Street" label="街道" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="PostCode" label="邮编" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Groups" label="分组" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Amounts" label="合同金额" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Status" label="报名状态" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="CreateDate" label="创建日期" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column align="right" width="200">
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="请输入搜索内容" />
				</template>
				<template slot-scope="scope">
					<el-button size="mini" type="primary" @click='editHandle(scope.$index, scope.row)' plain>
						<i class="el-icon-edit"></i>编辑</el-button>
					<el-button size="mini" type="danger" @click='delHandle(scope.$index, scope.row)' plain>
						<i class="el-icon-delete"></i>删除</el-button>
				</template>
			</el-table-column>
			<el-table-column type="selection" width="55"></el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tables.length">
			</el-pagination>
		</div>
		<!-- 编辑框 -->
		<el-dialog :modal-append-to-body='false' title="编辑记录" :visible.sync="editModalShow" :close-on-click-modal="false"
		 :destroy-on-close="true">
			<el-form :model="editForm" :rules="rules" ref="editForm" label-width="68px">
				<el-form-item label="身份证" prop="ID">
					<el-input v-model="editForm.ID" disabled=""></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="Name">
					<el-input v-model="editForm.Name" disabled=""></el-input>
				</el-form-item>
				<el-form-item label="称谓" prop="Title">
					<el-radio-group v-model="editForm.Title" disabled>
						<el-radio label="先生">先生</el-radio>
						<el-radio label="女士">女士</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="邮箱" prop="Mail">
					<el-input v-model="editForm.Mail" disabled=""></el-input>
				</el-form-item>
				<el-form-item label="模块" prop="Module">
					<el-select v-model="editForm.Module" disabled="">
						<el-option label="FI" value="FI"></el-option>
						<el-option label="CO" value="CO"></el-option>
						<el-option label="MM" value="MM"></el-option>
						<el-option label="PP" value="PP"></el-option>
						<el-option label="ABAP" value="ABAP"></el-option>
						<el-option label="SD" value="SD"></el-option>
						<el-option label="PM" value="PM"></el-option>
						<el-option label="PS" value="PS"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机号" prop="Mobile">
					<el-input v-model="editForm.Mobile"></el-input>
				</el-form-item>
				<el-form-item label="国家" prop="Nation">
					<el-select v-model="editForm.Nation" placeholder="请选择国家">
						<el-option v-for="option in arr" :value="option.name">
							{{ option.name }}
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="省份">
					<el-select v-model="editForm.City" placeholder="请选择省份">
						<el-option v-for="option in cityArr" :value="option.name">
							{{ option.name }}
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="街道" prop="Street">
					<el-input v-model="editForm.Street"></el-input>
				</el-form-item>
				<el-form-item label="邮编" prop="PostCode">
					<el-input v-model="editForm.PostCode"></el-input>
				</el-form-item>
				<el-form-item label="分组" prop="Groups">
					<el-input v-model="editForm.Groups"></el-input>
				</el-form-item>
				<el-form-item label="合同金额" prop="Amounts">
					<el-input v-model="editForm.Amounts"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="Status">
					<el-select v-model="editForm.Status">
						<el-option label="咨询" value="MM"></el-option>
						<el-option label="已付款" value="已付款"></el-option>
						<el-option label="已服务" value="已服务"></el-option>
						<el-option label="已考试" value="PP"></el-option>
						<el-option label="已通过" value="ABAP"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="创建日期" prop="CreateDate">
					<el-input v-model="editForm.CreateDate" disabled=""></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditModal()">取 消</el-button>
				<el-button type="primary" @click="edit()">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 添加框 -->
		<el-dialog :modal-append-to-body='false' title="添加记录" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
		 :destroy-on-close="true">
			<el-form :model="form" :rules="rules" ref="form" label-width="68px">
				<el-form-item label="身份证" prop="ID">
					<el-input v-model="form.ID"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="Name">
					<el-input v-model="form.Name"></el-input>
				</el-form-item>
				<el-form-item label="称谓" prop="Title">
					<el-radio-group v-model="form.Title">
						<el-radio label="先生">先生</el-radio>
						<el-radio label="女士">女士</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="邮箱" prop="Mail">
					<el-input v-model="form.Mail"></el-input>
				</el-form-item>
				<el-form-item label="模块" prop="Module">
					<el-select v-model="form.Module">
						<el-option v-for="item in Module" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="手机号" prop="Mobile">
					<el-input v-model="form.Mobile"></el-input>
				</el-form-item>
				<el-form-item label="国家" prop="Nation">
					<el-select v-model="country" placeholder="请选择国家">
						<el-option v-for="option in arr" :value="option.name">
							{{ option.name }}
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="省份">
					<el-select v-model="city" placeholder="请选择省份">
						<el-option v-for="option in cityArr" :value="option.name">
							{{ option.name }}
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="街道" prop="Street">
					<el-input v-model="form.Street"></el-input>
				</el-form-item>
				<el-form-item label="邮编" prop="PostCode">
					<el-input v-model="form.PostCode"></el-input>
				</el-form-item>
				<el-form-item label="分组" prop="Groups">
					<el-input v-model="form.Groups"></el-input>
				</el-form-item>
				<el-form-item label="合同金额" prop="Amounts">
					<el-input v-model="form.Amounts"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="Status">
					<el-select v-model="form.Status">
						<el-option label="咨询" value="MM"></el-option>
						<el-option label="已付款" value="已付款"></el-option>
						<el-option label="已服务" value="已服务"></el-option>
						<el-option label="已考试" value="PP"></el-option>
						<el-option label="已通过" value="ABAP"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel()">取 消</el-button>
				<el-button type="primary" @click="sureSubmit('form')">确 定</el-button>
			</div>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	// import FileSaver from 'file-saver'
	// import XLSX from 'xlsx'
	export default {
		data() {
			return {
				Module: this.Global.Module,
				arr: this.Global.arr,
				numList: [],
				multipleSelection: [],
				country: '请选择国家',
				city: '',
				// district: '',
				cityArr: [],
				// districtArr: [],
				editModalShow: false,
				dialogFormVisible: false,
				// 搜索
				search: '',
				// 分页
				currentPage: 1,
				pagesize: 10,
				tableData: [],
				editForm: {
					"ID": "",
					"Name": "",
					"Title": "",
					"Mail": "",
					"Module": "",
					"Mobile": "",
					"Nation": "",
					"City": "",
					"Street": "",
					"PostCode": "",
					"Groups": "",
					"Amounts": "",
					"Status": "",
					"CreateDate": ""
				},
				form: {
					"ID": "",
					"Name": "",
					"Title": "",
					"Mail": "",
					"Module": "",
					"Mobile": "",
					"Nation": "",
					"City": "",
					"Street": "",
					"PostCode": "",
					"Groups": "",
					"Amounts": "",
					"Status": "",
					"CreateDate": ""
				},
				rules: {
					Mobile: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/, message: '手机号格式不对', trigger: 'blur' }
					],
					ID: [
						{ required: true, message: '请填写证件号码', trigger: 'blur' },
						{
							pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/,
							message: '证件号码格式有误！',
							trigger: 'blur'
						}
					],
					Name: { required: true, message: '请填写姓名', trigger: 'blur' },
					Title: { required: true, message: '请选择称谓', trigger: 'blur' },
					Mail: [
						{ required: true, message: '请填写邮箱', trigger: 'blur' },
						{
							pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
							message: '邮箱格式有误！',
							trigger: 'blur'
						}
					],
					Module: { required: true, message: '请选择模块', trigger: 'blur' }
				}
			}
		},
		created() {
			this.loadList()
			// document.title = "报名记录"
		},
		watch: {
			country: function() {
				this.updateCity();
				// this.updateDistrict();
			},
			editForm: function() {
				this.updateCity1();
				// this.updateDistrict();
			},
			// city: function() {
			// 	this.updateDistrict();
			// },
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
			// exportExcel() {
			// 	/* generate workbook object from table */
			// 	var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
			// 	var wb = XLSX.utils.table_to_book(document.querySelector('#exportTab'), xlsxParam)

			// 	/* get binary string as output */
			// 	var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
			// 	try {
			// 		FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '审核情况表.xlsx')
			// 	} catch (e) {
			// 		if (typeof console !== 'undefined') {
			// 			alert(e, wbout)
			// 		}
			// 	}
			// 	return wbout
			// },
			// 多选
			delAll() {
				for (var i = 0; i < this.multipleSelection.length; i++) {
					this.numList.push(this.multipleSelection[i].ID)
				}
				this.$confirm('此操作将删除选中的所有记录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { Status, Values } = await Joggle.delPA({ 'ids': this.numList.toString() })
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
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			// 删除
			delHandle(index, row) {
				this.$confirm('此操作不可撤销, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { Status, Values } = await Joggle.delPA({ 'ids': row.ID })
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
			// 添加记录取消
			cancel() {
				this.$refs.form.resetFields()
				this.dialogFormVisible = false
			},
			// 添加记录确定
			sureSubmit(form) {
				var timestamp = new Date().getTime()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				this.form.CreateDate = time
				this.form.Nation = this.country
				this.form.City = this.city
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.addPA({ "data": [this.form] })
						if (Status) {
							this.$message.success(Values)
							this.dialogFormVisible = false
							this.$refs["form"].resetFields()
							this.loadList()
						} else {
							this.$message.warning(Values)
						}
					}
				})
			},
			// 载入
			async loadList() {
				let { Status, Values } = await Joggle.pAEnList()
				if (Status) {
					this.tableData = Values
				} else {
					this.$message.warning(Values)
				}
			},
			// 联动
			updateCity: function() {
				for (var i in this.arr) {
					var obj = this.arr[i];
					if (obj.name == this.country) {
						this.cityArr = obj.sub;
						break;
					}
				}
				this.city = this.cityArr[1].name;
			},
			updateCity1: function() {
				for (var i in this.arr) {
					var obj = this.arr[i];
					if (obj.name == this.editForm.Nation) {
						this.cityArr = obj.sub;
						break;
					}
				}
				this.city = this.cityArr[1].name;
			},
			// updateDistrict: function() {
			// 	for (var i in this.cityArr) {
			// 		var obj = this.cityArr[i];
			// 		if (obj.name == this.city) {
			// 			this.districtArr = obj.sub;
			// 			break;
			// 		}
			// 	}
			// 	if (this.districtArr && this.districtArr.length > 0 && this.districtArr[1].name) {
			// 		this.district = this.districtArr[1].name;
			// 	} else {
			// 		this.district = '';
			// 	}
			// },
			// 点击编辑
			editHandle(index, row) {
				this.editModalShow = true;
				this.editForm = Object.assign({}, row);
			},
			// 点击编辑模态框的取消
			closeEditModal(editForm) {
				this.editModalShow = false;
				this.$refs.editForm.resetFields()
			},
			// 点击编辑模态框的完成
			edit() {
				this.$refs.editForm.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.chgPA({ "data": [this.editForm] })
						if (Status) {
							this.$message.success(Values);
							this.editModalShow = false
							this.loadList()
						} else {
							this.$message.warning(Values);
						}
					}
				})
			},
			async handleSelectedFile(convertedData) {
				var timestamp = new Date().getTime()
				var now = new Date(),
					y = now.getFullYear(),
					m = now.getMonth() + 1,
					d = now.getDate()
				var time = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
				for (var i = 0; i < convertedData.body.length; i++) {
					convertedData.body[i].CreateDate = time
				}
				let { Status, Values } = await Joggle.addPA({ "data": convertedData.body })
				if (Status) {
					this.$message.success(Values);
					this.loadList()
				} else {
					this.$message.warning(Values);
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
	.signUp {
		.el-dialog {
			width: 600px;
		}

		.editSize {
			font-size: 16px;
		}
	}
</style>
