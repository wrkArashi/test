<template>
	<el-card class="box-card bank">
		<div slot="header" class="header">
			<div class="header">
				<div>请选择题库：</div>
				<el-select v-model="bank" @change="currentSel">
					<el-option v-for="item in bankOptions" :label="item.label" :value="item.value"></el-option>
				</el-select>
				<el-button @click="dialogFormVisible=true" plain style="margin-left: 10px;margin-right:10px;">新建试题</el-button>
				<vue-xlsx-table @on-select-file="handleSelectedFile">导入excel文件</vue-xlsx-table>
			</div>
			<el-button @click="delAll()">删除选中试题</el-button>
		</div>
		<el-table @selection-change="handleSelectionChange" :data="tables.slice((currentPage-1)*pagesize,currentPage*pagesize)">
			<el-table-column prop="Stem" label="题目" width="430px" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Category" label="题型" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Score" label="分值" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Brand" label="品牌" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Product" label="产品" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Version" label="版本" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column prop="Module" label="模块" :show-overflow-tooltip="true" sortable=""></el-table-column>
			<el-table-column align="right" width="250">
				<template slot="header" slot-scope="scope">
					<el-input v-model="search" size="mini" placeholder="请输入搜索内容" />
				</template>
				<template slot-scope="scope">
					<el-button size="mini" type="success" @click='handleDetails(scope.$index, scope.row)' plain>
						<i class="el-icon-view"></i>查看</el-button>
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
			 :page-sizes="[10, 20, 30, 40, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tables.length">
			</el-pagination>
		</div>
		<!-- 添加试题框 -->
		<el-dialog :modal-append-to-body='false' title="添加试题" :visible.sync="dialogFormVisible" :close-on-click-modal="false"
		 :destroy-on-close="true">
			<el-form :model="form" :rules="rules" ref="form" label-width="78px">
				<el-form-item label="题型" prop="Category">
					<el-select v-model="form.Category" placeholder="请选择" @change="opSel">
						<el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
					</el-select>
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
				<el-form-item label="语言" prop="Lng">
					<el-input v-model="form.Lng"></el-input>
				</el-form-item>
				<el-form-item label="版本" prop="Version">
					<el-input v-model="form.Version"></el-input>
				</el-form-item>
				<el-form-item label="题干" prop="Stem">
					<el-input type="textarea" v-model="form.Stem"></el-input>
				</el-form-item>
				<el-form-item label="附件（图片）" label-width="100px" prop="Attached">
					<input @change='photo' type="file">
					<img :src="form.Attached" class="img" ref="img" />
				</el-form-item>
				<el-form-item label="选项A" prop="OptionA">
					<el-input v-model="form.OptionA"></el-input>
				</el-form-item>
				<el-form-item label="选项B" prop="OptionB">
					<el-input v-model="form.OptionB"></el-input>
				</el-form-item>
				<el-form-item label="选项C" prop="OptionC">
					<el-input v-model="form.OptionC"></el-input>
				</el-form-item>
				<el-form-item label="选项D" prop="OptionD">
					<el-input v-model="form.OptionD"></el-input>
				</el-form-item>
				<el-form-item label="选项E" prop="OptionE">
					<el-input v-model="form.OptionE"></el-input>
				</el-form-item>
				<el-form-item label="选项F" prop="OptionF">
					<el-input v-model="form.OptionF"></el-input>
				</el-form-item>
				<el-form-item label="参考答案" v-if="this.type==0" prop="Answer">
					<el-radio-group v-model="form.Answer">
						<el-radio label="A">A</el-radio>
						<el-radio label="B">B</el-radio>
						<el-radio label="C">C</el-radio>
						<el-radio label="D">D</el-radio>
						<el-radio label="E">E</el-radio>
						<el-radio label="F">F</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="参考答案" v-if="this.type==1" prop="Answer">
					<el-checkbox-group v-model="form.Answer">
						<el-checkbox label="A">A</el-checkbox>
						<el-checkbox label="B">B</el-checkbox>
						<el-checkbox label="C">C</el-checkbox>
						<el-checkbox label="D">D</el-checkbox>
						<el-checkbox label="E">E</el-checkbox>
						<el-checkbox label="F">F</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="解析" prop="Explain">
					<el-input type="textarea" v-model="form.Explain"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel()">取 消</el-button>
				<el-button type="primary" @click="sureSubmit('form')">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 编辑试题框 -->
		<el-dialog :modal-append-to-body='false' title="编辑试题" :visible.sync="editModalShow" :close-on-click-modal="false"
		 :destroy-on-close="true">
			<el-form :model="editForm" :rules="rules" ref="editForm" label-width="78px">
				<el-form-item label="题型" prop="Category">
					<el-select v-model="editForm.Category" placeholder="请选择" disabled="">
						<el-option v-for="item in options" :label="item.label" :value="item.value"></el-option>
					</el-select>
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
				<el-form-item label="语言" prop="Lng">
					<el-input v-model="editForm.Lng"></el-input>
				</el-form-item>
				<el-form-item label="版本" prop="Version">
					<el-input v-model="editForm.Version"></el-input>
				</el-form-item>
				<el-form-item label="题干" prop="Stem">
					<el-input type="textarea" v-model="editForm.Stem"></el-input>
				</el-form-item>
				<el-form-item label="附件（图片）" label-width="100px">
					<input @change='photo' type="file">
					<img :src="editForm.Attached" class="img" ref="img" />
				</el-form-item>
				<el-form-item label="选项A">
					<el-input v-model="editForm.OptionA"></el-input>
				</el-form-item>
				<el-form-item label="选项B">
					<el-input v-model="editForm.OptionB"></el-input>
				</el-form-item>
				<el-form-item label="选项C">
					<el-input v-model="editForm.OptionC"></el-input>
				</el-form-item>
				<el-form-item label="选项D">
					<el-input v-model="editForm.OptionD"></el-input>
				</el-form-item>
				<el-form-item label="选项E">
					<el-input v-model="editForm.OptionE"></el-input>
				</el-form-item>
				<el-form-item label="选项F">
					<el-input v-model="editForm.OptionF"></el-input>
				</el-form-item>
				<el-form-item label="参考答案" v-if="this.typeEdit==0" prop="Answer">
					<el-radio-group v-model="editForm.Answer">
						<el-radio label="A">A</el-radio>
						<el-radio label="B">B</el-radio>
						<el-radio label="C">C</el-radio>
						<el-radio label="D">D</el-radio>
						<el-radio label="E">E</el-radio>
						<el-radio label="F">F</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="参考答案" v-if="this.typeEdit==1" prop="Answer">
					<el-checkbox-group v-model="editForm.Answer">
						<el-checkbox label="A">A</el-checkbox>
						<el-checkbox label="B">B</el-checkbox>
						<el-checkbox label="C">C</el-checkbox>
						<el-checkbox label="D">D</el-checkbox>
						<el-checkbox label="E">E</el-checkbox>
						<el-checkbox label="F">F</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="解析" prop="Explain">
					<el-input type="textarea" v-model="editForm.Explain"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="closeEditModal()">取 消</el-button>
				<el-button type="primary" @click="edit()">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 详情弹框 -->
		<el-dialog :modal-append-to-body='false' class="details" title="试题详情" :visible.sync="detaileDialogVisible" center>
			<img :src="detaileForm.Attached" class="image" v-if="detaileForm.Attached!=null">
			<div class="title">{{detaileForm.Stem}}</div>
			<div class="item1" v-if="detaileForm.OptionA!=''">A: {{detaileForm.OptionA}}</div>
			<div class="item1" v-if="detaileForm.OptionB!=''">B: {{detaileForm.OptionB}}</div>
			<div class="item1" v-if="detaileForm.OptionC!=''">C: {{detaileForm.OptionC}}</div>
			<div class="item1" v-if="detaileForm.OptionD!=''">D: {{detaileForm.OptionD}}</div>
			<div class="item1" v-if="detaileForm.OptionE!=''">E: {{detaileForm.OptionE}}</div>
			<div class="item1" v-if="detaileForm.OptionF!=''">F: {{detaileForm.OptionF}}</div>
			<div class="detailBG">
				<div class="item"><span class="name green">参考答案： </span> {{detaileForm.Answer}}</div>
				<div class="item"><span class="name">解析： </span> {{detaileForm.Explain}}</div>
				<div class="item"><span class="name">分值： </span> {{detaileForm.Score}}</div>
				<div class="item"><span class="name">品牌： </span> {{detaileForm.Brand}}</div>
				<div class="item"><span class="name">产品： </span> {{detaileForm.Product}}</div>
				<div class="item"><span class="name">版本： </span> {{detaileForm.Version}}</div>
				<div class="item"><span class="name">模块： </span> {{detaileForm.Module}}</div>
				<div class="item"><span class="name">题型： </span> {{detaileForm.Category}}</div>
				<div class="item"><span class="name">语言： </span> {{detaileForm.Lng}}</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="detaileDialogVisible = false">关闭</el-button>
			</span>
		</el-dialog>
		<!-- 批导失败 -->
		<el-dialog title="失败! 请修改以下错误后重试" :visible.sync="dialogVisible" width="30%" :show-close="false" :close-on-click-modal="false"
		 :close-on-press-escape="false">
			<div class="nullClass" v-for="(item,index) in alert" :key="index">{{item}}</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="checkHandle">确 定</el-button>
			</span>
		</el-dialog>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				bankOptions: this.Global.bankOptions,
				Product: this.Global.Product,
				Module: this.Global.Module,
				numList: [],
				multipleSelection: [],
				typeEdit: null,
				type: null,
				bank: 'SAP_A',
				// 搜索
				search: '',
				// 分页
				currentPage: 1,
				pagesize: 10,
				tableData: [],
				detaileForm: [], // 详情表单
				detaileDialogVisible: false,
				dialogFormVisible: false,
				editModalShow: false,
				options: [{
					value: '单选',
					label: '单选'
				}, {
					value: '多选',
					label: '多选'
				}],
				form: {
					"ID": "",
					"Brand": "",
					"Product": "",
					"Version": "",
					"Module": "",
					"Lng": '',
					"Stem": "",
					"Attached": "",
					"Category": "",
					"OptionA": '',
					"OptionB": '',
					"OptionC": '',
					"OptionD": '',
					"OptionE": '',
					"OptionF": '',
					"Answer": [],
					'Explain': '',
					"Score": ""
				},
				editForm: {
					"ID": "",
					"Brand": "",
					"Product": "",
					"Version": "",
					"Module": "",
					"Lng": '',
					"Stem": "",
					"Attached": "",
					"Category": "",
					"OptionA": '',
					"OptionB": '',
					"OptionC": '',
					"OptionD": '',
					"OptionE": '',
					"OptionF": '',
					"Answer": [],
					'Explain': '',
					"Score": ""
				},
				dialogVisible: false,
				alert: [],
				rules: {
					Stem: { required: true, message: '题目不能为空', trigger: 'blur' },
					Category: { required: true, message: '题型不能为空', trigger: 'blur' },
					// Brand: { required: true, message: '品牌不能为空', trigger: 'blur' },//自动添加SAP
					Product: { required: true, message: '产品不能为空', trigger: 'blur' },
					Version: { required: true, message: '版本不能为空', trigger: 'blur' },
					Module: { required: true, message: '模块不能为空', trigger: 'blur' },
					Lng: { required: true, message: '语言不能为空', trigger: 'blur' },
					Answer: { required: true, message: '答案不能为空', trigger: 'blur' },
				}
			}
		},
		created() {
			this.loadList()
			// document.title = "题库管理"
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
			checkHandle() {
				this.dialogVisible = false
				this.alert = []
			},
			// 删除多个
			delAll() {
				for (var i = 0; i < this.multipleSelection.length; i++) {
					this.numList.push(this.multipleSelection[i].ID)
				}
				this.$confirm('此操作将删除选中的所有试题, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { Status, Values } = await Joggle.delQus({
						'repository': this.bank,
						'questionIDs': this.numList.toString()
					})
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
			// 删除一个
			delHandle(index, row) {
				this.$confirm('此操作不可撤销, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					let { Status, Values } = await Joggle.delQus({
						'repository': this.bank,
						'questionIDs': row.ID
					})
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
			// 点击详情
			handleDetails(index, row) {
				this.detaileDialogVisible = true
				this.detaileForm = row
			},
			// 点击编辑
			editHandle(index, row) {
				this.editModalShow = true;
				this.editForm = Object.assign({}, row);
				if (row.Category == '单选') {
					this.typeEdit = 0
				}
				if (row.Category == '多选') {
					this.typeEdit = 1
					this.editForm.Answer = row.Answer.split(',')
				}
			},
			// 点击编辑模态框的取消
			closeEditModal(editForm) {
				this.editModalShow = false;
				this.$refs.editForm.resetFields()
			},
			// 点击编辑模态框的完成
			edit() {
				if (this.editForm.Category == "多选") {
					this.editForm.Answer = this.editForm.Answer.join(',')
				}
				this.$refs.editForm.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.chgQus({
							repository: this.bank,
							data: [{ ...this.editForm }]
						})
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
			// 题型改变
			opSel(val) {
				if (val == '单选') {
					this.type = 0
				}
				if (val == '多选') {
					this.type = 1
				}
			},
			// 题库改变
			async currentSel(selVal) {
				this.bank = selVal
				let { Status, Values } = await Joggle.getQuList({ "repository": selVal })
				if (Status) {
					this.tableData = Values
				} else {
					this.$message.warning(Values);
				}
			},
			// 添加试题取消
			cancel() {
				this.$refs.form.resetFields()
				this.dialogFormVisible = false
			},
			// 添加试题确定
			sureSubmit(form) {
				var timestamp = new Date().getTime()
				this.form.ID = timestamp
				if (this.form.Category == "单选") {
					this.form.Score = 1
				}
				if (this.form.Category == "多选") {
					this.form.Score = 2
					this.form.Answer = this.form.Answer.join(',')
				}
				this.form.Brand = 'SAP'
				var data = {
					repository: this.bank,
					data: [{ ...this.form }]
				}
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						let { Status, Values } = await Joggle.addQus(data)
						if (Status) {
							this.$message.success(Values);
							this.dialogFormVisible = false
							this.loadList()
							this.$refs["form"].resetFields()
						} else {
							this.$message.warning(Values);
						}
					}
				})
			},
			// 批量添加试题
			async handleSelectedFile(convertedData) {
				var timestamp = new Date().getTime()
				for (var i = 0; i < convertedData.body.length; i++) {
					for (var objKey in convertedData.body[i]) {
						if (!convertedData.body[i][objKey]) {
							var num = i + 2
							this.alert.push("第" + num + "行 " + objKey + " 为空值")
						}
					}
					convertedData.body[i].ID = timestamp + i
					convertedData.body[i].Attached = ''
					if (convertedData.body[i].Category == "单选") {
						if (convertedData.body[i].Answer.indexOf(",") > 0) {
							num = i + 1
							this.alert.push("第" + num + "行是单选题 Answer 只能唯一")
						}
						convertedData.body[i].Score = 1
					}
					if (convertedData.body[i].Category == "多选") {
						convertedData.body[i].Score = 2
					}
					if (convertedData.body[i].OptionA == "无") {
						convertedData.body[i].OptionA = ''
					}
					if (convertedData.body[i].OptionB == "无") {
						convertedData.body[i].OptionB = ''
					}
					if (convertedData.body[i].OptionC == "无") {
						convertedData.body[i].OptionC = ''
					}
					if (convertedData.body[i].OptionD == "无") {
						convertedData.body[i].OptionD = ''
					}
					if (convertedData.body[i].OptionE == "无") {
						convertedData.body[i].OptionE = ''
					}
					if (convertedData.body[i].OptionF == "无") {
						convertedData.body[i].OptionF = ''
					}
				}
				if (this.alert.length == 0) {
					let { Status, Values } = await Joggle.addQus({
						repository: this.bank,
						data: convertedData.body
					})
					if (Status) {
						this.$message.success(Values);
						this.loadList()
					} else {
						this.$message.warning(Values);
					}
				} else {
					this.dialogVisible = true
				}
			},
			// 图片
			photo(event) {
				var reader = new FileReader(); //创建读取文件的方法
				var img1 = event.target.files[0];
				reader.readAsDataURL(img1); //将文件已url的形式读入页面
				var that = this;
				reader.onload = function(e) {
					that.form.Attached = reader.result;
					that.editForm.Attached = reader.result;
				}
			},
			async loadList() {
				let { Status, Values } = await Joggle.getQuList({ "repository": this.bank })
				if (Status) {
					this.tableData = Values
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
	.bank {
		.nullClass {
			padding: 5px 0;
			text-align: center;
		}

		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.el-dialog {
			width: 600px;
		}

		font-size: 16px;

		.img {
			max-width: 400px;
		}

		// 详情对话框
		.details {
			.detailBG {
				border: 1px dashed #7cccfb;
				background: rgb(236, 245, 255);
				padding: 10px;
				margin: 10px 0;
			}

			.title {
				padding: 10px;
			}

			.image {
				max-width: 100%;
			}

			.item1 {
				padding: 5PX 10PX;
			}

			.item {
				padding: 5px 0;

				.green {
					color: #008000;
				}

				.name {
					font-weight: bold;
				}
			}
		}
	}
</style>
