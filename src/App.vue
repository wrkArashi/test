<template>
	<div>
		<router-view></router-view>
	</div>
</template>
<script>

</script>
<style lang="scss">
	* {
		margin: 0;
		padding: 0;
	}

	/* 公共类 */
	body {
		font-family: arial;
		margin: 0;
		font-size: 16px;

		button {
			margin: 0;
			padding: 0;
			border: 1px solid transparent; //自定义边框
			outline: none; //消除默认点击蓝色边框效果
		}

		.el-dialog {
			display: flex;
			flex-direction: column;
			margin: 0 !important;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			max-height: calc(100% - 30px);
		}

		.el-dialog .el-dialog__body {
			flex: 1;
			overflow: auto;
		}

		.block {
			margin-top: 20px;
		}

		.flex {
			display: flex;
			align-items: center;
			justify-content: space-between;
			flex-wrap: wrap;
		}

		.bg {
			position: fixed;
			height: 100%;
			width: 100%;
			background: url(../src/assets/banner.jpg) no-repeat 7% 0 fixed;
			background-size: cover;
		}

		.login,
		.edit {
			font-size: 16px;
			opacity: 0.8;
			width: 550px;
			margin: 0 auto;
			top: 23%;
			position: relative;
			border-radius: 10px;

			a {
				text-decoration: none;
				color: gray;
				font-size: 14px;
			}
		}
	}
</style>
