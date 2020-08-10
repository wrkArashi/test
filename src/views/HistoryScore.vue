<template>
	<el-card class="historyScore box-card">
		<div slot="header" class="flex">
			<div>历史考试列表</div>
			<el-input style="float: right; width: 220px;" v-model="search" placeholder="请输入搜索内容" />
		</div>
		<el-table :data="tables.slice((currentPage-1)*pagesize,currentPage*pagesize)">
			<el-table-column sortable prop="Brand" label="品牌" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Product" label="产品" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Module" label="模块" width="" :show-overflow-tooltip="true"></el-table-column>
			<!-- 			<el-table-column sortable prop="Total" label="总分" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="Scores" label="得分" width="" :show-overflow-tooltip="true"></el-table-column> -->
			<el-table-column sortable prop="Ratio" label="得分率" width="" :show-overflow-tooltip="true"></el-table-column> -->
			<el-table-column sortable prop="BeginTimes" label="开始时间" width="" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column sortable prop="EndTimes" label="结束时间" width="" :show-overflow-tooltip="true"></el-table-column>
			<!-- <el-table-column sortable prop="CreateDate" label="创建时间" width="" :show-overflow-tooltip="true"></el-table-column> -->
			<el-table-column align="center" width="70px" fixed="right">
				<template slot="header" slot-scope="scope">
					<div>操作</div>
				</template>
				<template slot-scope="scope">
					<router-link :to="{ name : 'TestDetail' , params : { id : scope.row.ID } }" tag="div">
						<el-button size="mini" type="primary" plain>详情</el-button>
					</router-link>
				</template>
			</el-table-column>
		</el-table>
		<div class="block">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
			 :page-sizes="[5, 10, 15, 20]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="tables.length">
			</el-pagination>
		</div>
	</el-card>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		data() {
			return {
				search: '',
				dialogFormVisible: false,
				// 分页
				currentPage: 1,
				pagesize: 10,
				tableData: [],
			}
		},
		created() {
			this.loadList()
			// document.title = "历史成绩"
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
		mounted() {
			// if (window.history && window.history.pushState) {
			// 	history.pushState(null, null, document.URL);
			// 	window.addEventListener('popstate', this.goBack, false);
			// }
		},
		// destroyed() {
		// 	window.removeEventListener('popstate', this.goBack, false);
		// },
		methods: {
			// goBack() {
			// 	console.log('点了后退')
			// 	// this.$router.push('/test/historyScore')
			// 	this.$router.replace({ path: '/test/historyScore' });
			// },
			// 分页
			handleSizeChange: function(size) {
				this.pagesize = size;
			},
			handleCurrentChange: function(currentPage) {
				this.currentPage = currentPage;
			},
			// 获取历史考试列表
			async loadList() {
				let { Status, Values } = await Joggle.postInfoList()
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
	.historyScore {
		font-size: 16px;
	}
</style>
