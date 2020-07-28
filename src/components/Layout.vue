<template>
	<div>
		<el-container>
			<el-header style="height: auto;">
				<NavBar></NavBar>
			</el-header>
			<el-main style="padding:0px 20px;">
				<router-view></router-view>
			</el-main>
			<el-footer style="height:auto;">
				<FooterBar></FooterBar>
			</el-footer>
		</el-container>
		<div class="footerBar">
			<NavBar></NavBar>
		</div>
	</div>
</template>

<script>
	import NavBar from "@/components/NavBar.vue";
	import FooterBar from "@/components/FooterBar.vue";
	export default {
		components: {
			NavBar,
			FooterBar
		},
		data() {
			return {

			}
		},
		mounted() {

		}
	}
</script>

<style>
	a:-webkit-any-link {
		text-decoration: none;
	}

	.el-header {
		background-color: rgb(68, 143, 185);
	}

	.el-footer {
		height: 45px;
		color: white;
		font-size: 14px;
		text-align: center;
		line-height: 45px;
		background-color: rgb(68, 143, 185);
	}

	.el-main {
		width: 100%;
		margin: 10px 0;
		min-height: calc(100vh - 146px);
		color: #333;
	}

	.footerBar {
		display: none;
	}

	/* iphone适配 */
	@media screen and (max-device-width: 480px) {
		.el-footer {
			display: none;
		}

		.el-header {
			display: none;
		}

		.footerBar {
			overflow: auto;
			display: block;
			position: fixed;
			bottom: 0;
			width: 100%;
			z-index: 2000;
			background-color: rgb(68, 143, 185);
		}

		.el-main {
			margin-bottom: 130px;
			margin-top: 20px;
		}

	}
</style>
