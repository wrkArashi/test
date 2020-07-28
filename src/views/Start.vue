<template>
	<div class="start">
		<div class="top">
			<div class="title">考生信息</div>
			<div class="studentsInfo">
				<div class="info">姓名：{{name}}</div>
				<div class="info">考号：{{ID}}</div>
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
			</div>
			<div class="title">题号</div>
			<div class="titleNumber flex">
				<button :class="{'active':item.active,'sel':item.sel}" v-for="(item, index) in select" class="number" @click="titleHandle(index,item)">{{item.name}}</button>
			</div>
		</div>
		<div class="right">
			<div class="subject">
				<div class="title">做题要求</div>
				<div class="detail">
					<div class="Stem">第{{titleNumber}}题：{{ceshi.Stem}}</div>
					<div v-if="this.ceshi.Category == '多选'">
						注* 此题有{{this.frequency}}个正确答案
					</div>
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
			<div class="answer">
				<div class="title">答题区</div>
				<div class="option">
					<el-radio-group v-model="option" v-if="this.ceshi.Category=='单选'" @change="options()">
						<el-radio v-if="ceshi.OptionA!=''" label="A"></el-radio>
						<el-radio v-if="ceshi.OptionB!=''" label="B"></el-radio>
						<el-radio v-if="ceshi.OptionC!=''" label="C"></el-radio>
						<el-radio v-if="ceshi.OptionD!=''" label="D"></el-radio>
						<el-radio v-if="ceshi.OptionE!=''" label="E"></el-radio>
						<el-radio v-if="ceshi.OptionF!=''" label="F"></el-radio>
					</el-radio-group>
					<el-checkbox-group v-model="option" v-if="this.ceshi.Category=='多选'" class="list" @change="options()">
						<el-checkbox v-if="ceshi.OptionA!=''" label="A"></el-checkbox>
						<el-checkbox v-if="ceshi.OptionB!=''" label="B"></el-checkbox>
						<el-checkbox v-if="ceshi.OptionC!=''" label="C"></el-checkbox>
						<el-checkbox v-if="ceshi.OptionD!=''" label="D"></el-checkbox>
						<el-checkbox v-if="ceshi.OptionE!=''" label="E"></el-checkbox>
						<el-checkbox v-if="ceshi.OptionF!=''" label="F"></el-checkbox>
					</el-checkbox-group>
				</div>
			</div>
			<div class="operate flex">
				<div>
					<el-button @click="last">上一题</el-button>
					<el-button @click="next">下一题</el-button>
				</div>
				<div class="flex" v-if="timeShow">
					<span>剩余时间：</span>
					<zk-time-down @time-end="handPaper1" :endTime='this.endTime'></zk-time-down>
					<el-button @click="handPaper" style="margin-left: 10px;">交卷</el-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { Joggle } from '@/api/index.js';
	import zkTimeDown from '@/utils/HomeTimer';
	export default {
		components: {
			zkTimeDown
		},
		data() {
			return {
				timeShow: true,
				frequency: "",
				id: sessionStorage.testId,
				endTime: sessionStorage.testTime,
				studentAnswer: [], //考生答案
				all: [], //所有题
				ceshi: {}, //每一道题
				name: "", //右上角信息
				ID: "", //右上角信息
				answer: [], //答案
				select: [], //选择题号
				titleNumber: 1, //题号
				option: [],
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
			this.loadList()
			// document.title = "考试中"
		},
		watch: {
			titleNumber: function() {
				for (let i = 0; i < this.select.length; i++) {
					this.select[i].sel = false
				}
				this.select[this.titleNumber - 1].sel = true
			},
		},
		methods: {
			total() {
				var str = this.ceshi.Answer;
				var index = str.indexOf(','); // 字符出现的位置
				var num = 0; // 这个字符出现的次数
				while (index !== -1) {
					num++; // 每出现一次 次数加一
					index = str.indexOf(',', index + 1); // 从字符串出现的位置的下一位置开始继续查找
				}
				this.frequency = num + 1
			},
			// 被迫交卷
			async handPaper1() {
				for (var i = 0; i < this.studentAnswer.length; i++) {
					if (this.studentAnswer[i].Answer.length == 0) {
						this.studentAnswer[i].Answer = ''
					}
				}
				let { Status, Values } = await Joggle.end({ 'data': this.studentAnswer })
				if (Status) {
					this.timeShow = false
					this.$msgbox({
						title: '提示',
						message: '时间到，您的得分率为' + Values + '%',
						showClose: false,
						showCancelButton: false,
						confirmButtonText: '确定',
					}).then(action => {
						this.$router.push('/test/historyScore')
						sessionStorage.removeItem('studentAnswer');
						sessionStorage.removeItem('testId');
						sessionStorage.removeItem('testValue');
						sessionStorage.removeItem('testTime');
					})
				} else {
					this.$message.warning(Values);
				}
			},
			// 交卷
			async handPaper() {
				this.$confirm('确认交卷？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(async () => {
					for (var i = 0; i < this.studentAnswer.length; i++) {
						if (this.studentAnswer[i].Answer.length == 0) {
							this.studentAnswer[i].Answer = ''
						}
					}
					let { Status, Values } = await Joggle.end({ 'data': this.studentAnswer })
					if (Status) {
						this.timeShow = false
						this.$msgbox({
							title: '提示',
							message: '交卷成功，您的得分率为' + Values + '%',
							showClose: false,
							showCancelButton: false,
							confirmButtonText: '确定',
						}).then(action => {
							this.$router.push('/test/historyScore')
							sessionStorage.removeItem('studentAnswer');
							sessionStorage.removeItem('testId');
							sessionStorage.removeItem('testValue');
							sessionStorage.removeItem('testTime');
						});
					}
				}).catch(() => {})
			},
			// 进入
			async loadList() {
				this.name = sessionStorage.name
				this.ID = sessionStorage.id
				this.studentAnswer = JSON.parse(sessionStorage.studentAnswer)
				if (sessionStorage.studentAnswer == '[]') {
					for (var i = 1; i < 81; i++) {
						var item = {
							"ExamID": this.id,
							"QuestionID": "",
							"UserID": sessionStorage.id,
							"Num": "",
							"Answer": [],
							"Result": null,
							"Score": 0,
						}
						this.studentAnswer.push(item)
					}
				}
				for (let i = 0; i < this.studentAnswer.length; i++) {
					if (this.studentAnswer[i].Answer.length != 0) {
						this.select[i].active = true
					}
				}
				var Values = JSON.parse(sessionStorage.testValue)
				for (var i = 0; i < Values.length; i++) {
					this.studentAnswer[i].QuestionID = Values[i].QuestionID
					this.studentAnswer[i].Num = Values[i].Num
				}
				this.all = Values
				let data = {
					"examID": this.id,
					"questionID": Values[0].QuestionID
				}
				await Joggle.getQu(data).then(response => {
					this.ceshi = response.Values[0]
					this.total()
				})
			},
			// 点击选项
			options() {
				let nowTeam = this.studentAnswer[this.titleNumber - 1]
				if (this.ceshi.Category == '单选') {
					nowTeam.Answer = this.option
					this.select[this.titleNumber - 1].active = true
				}
				if (this.ceshi.Category == '多选') {
					if (this.option.length == 0) {
						this.select[this.titleNumber - 1].active = false
						this.option = []
						nowTeam.Answer = this.option
					} else {
						this.option.sort()
						nowTeam.Answer = this.option.join(',')
						this.select[this.titleNumber - 1].active = true
					}
				}
				sessionStorage.studentAnswer = JSON.stringify(this.studentAnswer)
			},
			// 点击题号
			async titleHandle(index, item) {
				this.option = ''
				this.titleNumber = item.name
				let data = {
					"examID": this.id,
					"questionID": this.all[this.titleNumber - 1].QuestionID
				}
				await Joggle.getQu(data).then(response => {
					this.ceshi = response.Values[0]
					this.total()
				})
				this.option = this.studentAnswer[this.titleNumber - 1].Answer
				if (this.ceshi.Category == '多选') {
					if (this.option.length != 0) {
						this.option = this.option.split(',')
					}
				}
			},
			// 上一题
			async last() {
				this.option = ''
				if (this.titleNumber > 1) {
					this.titleNumber--
					let data = {
						"examID": this.id,
						"questionID": this.all[this.titleNumber - 1].QuestionID
					}
					await Joggle.getQu(data).then(response => {
						this.ceshi = response.Values[0]
						this.total()
					})
				} else {
					this.$message.warning('已是第一道题')
				}
				this.option = this.studentAnswer[this.titleNumber - 1].Answer
				if (this.ceshi.Category == '多选') {
					if (this.option.length != 0) {
						this.option = this.option.split(',')
					}
				}
			},
			// 下一题
			async next() {
				this.option = ''
				if (this.titleNumber < 80) {
					this.titleNumber++
					let data = {
						"examID": this.id,
						"questionID": this.all[this.titleNumber - 1].QuestionID
					}
					await Joggle.getQu(data).then(response => {
						this.ceshi = response.Values[0]
						this.total()
					})
				} else {
					this.$message.warning('已是最后一道题')
				}
				this.option = this.studentAnswer[this.titleNumber - 1].Answer
				if (this.ceshi.Category == '多选') {
					if (this.option.length != 0) {
						this.option = this.option.split(',')
					}
				}
			},
		}
	}
</script>

<style lang="scss">
	.start {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 20px;
		font-size: 16px;

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

		.title {
			background-color: rgb(224, 224, 224);
			padding: 5px;
		}

		.left {
			width: 19%;
			border: 1px solid rgb(224, 224, 224);

			.flex {
				justify-content: flex-start;
			}

			.studentsInfo {
				padding: 5px;
				height: 54px;
				overflow: auto;

				.info {
					padding: 3px 0;
				}
			}

			.titleNumber {
				padding: 5px;
				height: 595px;
				overflow: auto;

				.number {
					text-align: center;
					width: 57px;
					margin: 4px 5px;
					padding: 5px 0px;
					background-color: rgb(242, 242, 242);
					border: 2px solid white;
				}

				.active {
					color: white;
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

				.detail {
					padding: 30px;
					height: 447px;
					overflow: auto;

					.Stem {
						padding-bottom: 7px;
						overflow-wrap: break-word
					}

					.item {
						padding: 7px 0;
						overflow-wrap: break-word
					}

					.imageItem {
						width: 400px;

						.image {
							max-width: 100%;
						}
					}
				}
			}

			.answer {
				border: 1px solid rgb(224, 224, 224);
				margin: 10px 0;

				.option {
					padding: 30px;
					height: 22px;
					overflow: hidden;
				}

				.list {
					margin-top: 5px;
				}

				.el-radio__inner,
				.el-checkbox__inner {
					width: 18px;
					height: 18px;
				}

				.el-radio__inner::after {
					width: 6px;
					height: 6px;
				}

				.el-checkbox__inner::after {
					border: 2px solid #fff;
					box-sizing: content-box;
					content: "";
					border-left: 0;
					border-top: 0;
					height: 8px;
					left: 5px;
					position: absolute;
					top: 1px;
					width: 4px;
				}

				.el-radio__label,
				.el-radio__input,
				.el-checkbox__label,
				.el-checkbox__input {
					font-size: 20px;
					margin-top: -5px;
				}
			}

			.operate {
				border: 1px solid rgb(224, 224, 224);
				padding: 7px 20px;
			}

		}

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

			.list {
				margin-top: 0px;
			}
		}
	}
</style>
