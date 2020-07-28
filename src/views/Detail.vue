<template>
	<div class="paperDetail">
		<div class="top">
			<div class="title">考生信息</div>
			<div class="studentsInfo">
				<div class="info">姓名：{{name}}</div>
				<div class="info">考号：{{ID}}</div>
				<div class="info">得分：{{scores}}</div>
			</div>
			<div class="title">答题卡</div>
			<div class="titleNumber flex">
				<button :class="{'active':item.active,'sel':item.sel}" v-for="(item, index) in select" class="number" @click="titleHandle(index,item)">{{item.name}}</button>
			</div>
		</div>
		<div class="left">
			<div class="title">考生信息</div>
			<div class="studentsInfo">
				<div class="info">姓名：{{name}}</div>
				<div class="info">考号：{{ID}}</div>
				<div class="info">得分：{{scores}}</div>
			</div>
			<div class="title">题号</div>
			<div class="titleNumber flex">
				<button :class="{'active':item.active,'sel':item.sel}" v-for="(item, index) in select" class="number" @click="titleHandle(index,item)">{{item.name}}</button>
			</div>
		</div>
		<div class="right">
			<div :class="{'subject1':!showAnswer||!showExplain,'subject2':!showAnswer&&!showExplain}" class="subject">
				<div class="title">题目</div>
				<div class="detail">
					<div class="Stem">第{{titleNumber}}题：{{ceshi.Stem}}</div>
					<div class="imageItem">
						<img :src="ceshi.Attached" class="image" v-if="ceshi.Attached!=null">
					</div>
					<div class="item" v-if="ceshi.OptionA!=''">A、{{ceshi.OptionA}}</div>
					<div class="item" v-if="ceshi.OptionB!=''">B、{{ceshi.OptionB}}</div>
					<div class="item" v-if="ceshi.OptionC!=''">C、{{ceshi.OptionC}}</div>
					<div class="item" v-if="ceshi.OptionD!=''">D、{{ceshi.OptionD}}</div>
					<div class="item" v-if="ceshi.OptionE!=''">E、{{ceshi.OptionE}}</div>
					<div class="item" v-if="ceshi.OptionF!=''">F、{{ceshi.OptionF}}</div>
				</div>
			</div>
			<div :class="{'answer1':!showAnswer||!showExplain}" class="answer">
				<div class="option">考生答案：{{student.Answer}}</div>
				<div class="option" v-if="showAnswer">参考答案：{{ceshi.Answer}}</div>
				<div class="option" v-if="showExplain">解析：{{ceshi.Explain}}</div>
			</div>
			<div class="operate flex">
				<div>
					<el-button @click="last">上一题</el-button>
					<el-button @click="next">下一题</el-button>
				</div>
				<div>
					<el-button @click="handPaper">返回</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	export default {
		props: ['id'],
		data() {
			return {
				showAnswer: false,
				showExplain: false,
				ceshi: {}, //原题
				student: {}, //考生答案
				all: [], //所有题
				name: "", //右上角信息
				ID: "", //右上角信息
				scores: '', //右上角分数
				select: [], //选择题号
				titleNumber: 1, //题号
			}
		},
		created() {
			for (var i = 1; i < 81; i++) {
				var item = {
					'active': false,
					'name': i,
					'sel': false
				}
				this.select.push(item)
			}
			this.select[0].sel = true
			this.loadInfo() //载入
			// document.title = "考试详情"
		},
		watch: {
			titleNumber: function() {
				for (let i = 0; i < this.select.length; i++) {
					this.select[i].sel = false
				}
				this.select[this.titleNumber - 1].sel = true
			}
		},
		methods: {
			// 载入试卷详情
			async loadInfo() {
				this.name = sessionStorage.name
				this.ID = sessionStorage.id
				let { Status, Values } = await Joggle.postInfoItems({ "examID": this.id })
				if (Status) {
					if (Values.Table1 == '') {
						this.$alert('您未参与本场考试', '提示', {
							confirmButtonText: '确定',
							callback: action => {
								this.$router.push('/test/historyScore')
							}
						});
						return;
					}
					if (Values.Table2.length == 0) {
						this.$alert('您未作答本场考试', '提示', {
							confirmButtonText: '确定',
							callback: action => {
								this.$router.push('/test/historyScore')
							}
						});
						return;
					}
					// 如果没有答案权限
					if (Values.Table1.every(item => !('Answer' in item))) {
						this.showAnswer = false
					} else {
						this.showAnswer = true
					}
					// 如果没有解析权限
					if (Values.Table1.every(item => !('Explain' in item))) {
						this.showExplain = false
					} else {
						this.showExplain = true
					}
					this.scores = Values.Table[0].Scores //左上角得分
					// 后台传来的整张试卷是以QuestionID排序的，sortID方法将试卷以Num排序
					function sortId(a, b) {
						return a.Num - b.Num
					}
					this.all = Values.Table2.sort(sortId) //排序好的试卷
					this.student = Values.Table2.sort(sortId)[0] //考生[第一题]答案
					// 答对的题号加class
					for (var i = 0; i < 80; i++) {
						if (Values.Table2.sort(sortId)[i].Result == 'R') {
							this.select[i].active = true
						}
					}
					// 获取第一道题
					this.drawQuestions()
				} else {
					this.$message.warning(Values)
				}
			},
			// 点击题号
			titleHandle(index, item) {
				this.titleNumber = item.name
				this.drawQuestions()
			},
			// 点击上一题
			last() {
				if (this.titleNumber > 1) {
					this.titleNumber--
					this.drawQuestions()
				} else {
					this.$message.warning('已是第一道题')
				}
			},
			// 点击下一题
			next() {
				if (this.titleNumber < 80) {
					this.titleNumber++
					this.drawQuestions()
				} else {
					this.$message.warning('已是最后一道题')
				}
			},
			// 抽题（点击题号，点击上一题，点击下一题，获取第一题）
			async drawQuestions() {
				let data = {
					"examID": this.id,
					"questionID": this.all[this.titleNumber - 1].QuestionID
				}
				await Joggle.getQu(data).then(response => {
					this.ceshi = response.Values[0]
					this.student = this.all[this.titleNumber - 1] //考生答案
				})
			},
			// 点击返回
			handPaper() {
				this.$router.push('/test/historyScore')
			}
		}
	}
</script>

<style lang="scss">
	.paperDetail {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 20px;
		font-size: 16px;

		.title {
			background-color: rgb(224, 224, 224);
			padding: 5px;
		}

		// 移动端显示
		.top {
			display: none;
			border: 1px solid rgb(224, 224, 224);

			.flex {
				justify-content: flex-start;
			}

			.studentsInfo {
				padding: 5px;
				display: flex;
				justify-content: space-between;

				.info {
					padding: 3px 0;
				}
			}

			.titleNumber {
				padding: 3px 0;
				height: 225px;
				overflow: auto;

				.number {
					color: white;
					text-align: center;
					width: 69px;
					margin: 4px 2px;
					padding: 5px 0px;
					background-color: #F56C6C;
					border: 2px solid white;

				}

				.active {
					background-color: #67C23A;
					border: 2px solid white;
				}

				.sel {
					border: 2px solid rgb(68, 143, 185);
				}
			}
		}

		.left {
			width: 19%;
			border: 1px solid rgb(224, 224, 224);

			.flex {
				justify-content: flex-start;
			}

			.studentsInfo {
				padding: 5px;
				height: 81px;
				overflow: auto;

				.info {
					padding: 3px 0;
				}
			}

			.titleNumber {
				padding: 5px;
				height: 550px;
				overflow: auto;

				.number {
					color: white;
					text-align: center;
					width: 53px;
					// width: 56px;
					margin: 4px 5px;
					padding: 5px 0px;
					background-color: #F56C6C;
					border: 2px solid white;

				}

				.active {
					background-color: #67C23A;
					border: 2px solid white;
				}

				.sel {
					border: 2px solid rgb(68, 143, 185);
				}
			}
		}

		.right {
			width: 80%;

			.subject {
				border: 1px solid rgb(224, 224, 224);
				margin-bottom: 10px;

				.detail {
					padding: 30px;
					// height: 420px;
					height: 385px;
					overflow: auto;

					.Stem {
						padding-bottom: 7px;
					}

					.item {
						padding: 7px 0;
					}

					.imageItem {
						width: 400px;

						.image {
							max-width: 100%;
						}
					}
				}
			}

			.subject1 {
				height: 558px;
			}

			.subject2 {
				height: 590px;
			}

			.answer {
				border: 1px solid rgb(224, 224, 224);
				margin-bottom: 12px;
				height: 150px;
				overflow: auto;

				.option {
					padding: 7px 30px;
				}
			}

			.answer1 {
				height: auto;
			}

			.operate {
				border: 1px solid rgb(224, 224, 224);
				padding: 10px 20px;
			}

		}

		// iphone适配
		@media screen and (max-device-width: 480px) {
			.left {
				display: none;
			}

			.right {
				width: 100%;
			}

			.top {
				display: block;
			}

		}
	}
</style>
