<script setup>
	import {
		onLaunch,
		onShow,
		onHide
	} from "@dcloudio/uni-app"
	import {
		useUserStore
	} from "@/store/user.js"
	const {
		setUserInfo,
	} = useUserStore();
	onLaunch(() => {
		console.log('App Launch');
		setUserInfo();
	})
	onShow(() => {
		console.log('App Show')
	})
	onHide(() => {
		console.log('App Hide')
	})
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/css/customicons.css';
	// 设置整个项目的背景色

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
</style>