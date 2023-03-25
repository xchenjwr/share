<script setup>
	import {
		onLaunch,
		onShow,
		onHide
	} from "@dcloudio/uni-app"
	import {
		request
	} from "@/network/request.js"
	import {
		useUserStore
	} from "@/store/user.js"
	const store = useUserStore();
	onLaunch(() => {
		console.log('App Launch');
		if (uni.getStorageSync('token')) {
			request('', "GET").then(res => {
				store.setUserid(res.data.id);
			})
		} else {
			uni.login({
				provider: 'weixin', //使用微信登录
				success: function(loginRes) {
					console.log(loginRes.code);
					request("/login", "POST", {
						code: loginRes.code
					}).then(res => {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: 'none',
						});
						if (res.data) {
							uni.setStorageSync("token", res.data);
							request('', "GET").then(res => {
								store.setUserid(res.data.id);
							})
						}
					})
				}
			})
		}

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
