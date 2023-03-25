<template>
	<view>
		<view class="title">登录</view>
		<view class="account">
			<label for="account">账号</label>
			<input type="text" id="account" v-model="account" placeholder="请输入账号" />
		</view>
		<view class="password">
			<label for="password">密码</label>
			<input type="safe-password" password id="password" v-model="password" placeholder="请输入密码" />
		</view>
		<button @tap="submit">登录</button>
	</view>
</template>

<script setup>
	import {
		request
	} from "@/network/request.js"
	import {
		ref
	} from "vue";
	import {
		useUserStore
	} from "@/store/user.js"
	const store = useUserStore();
	let account = ref("");
	let password = ref("");

	function submit() {
		if (account.value == "" || password.value == "") {
			uni.showToast({
				title: '账号或密码不为空',
				duration: 2000,
				icon: 'none',
			});
			return;
		}
		let data = {
			account: account.value,
			password: password.value,
		}
		request("/login", "POST", data).then(async (res) => {
			uni.showToast({
				title: res.msg,
				duration: 1000,
				icon: 'none',
			});
			if (res.data) {
				uni.setStorageSync("token", res.data);
				request('', "GET").then(res => {
					store.setUserid(res.data.id);
					setTimeout(() => {
						if (getCurrentPages().length == 2) {
							uni.switchTab({
								url: "/pages/profile/index"
							})
						} else {
							uni.navigateBack({
								delta: 2
							});
						}
					}, 1000)
				})
			}
		})
	}
</script>

<style lang="less">
	.title {
		margin-top: 100rpx;
		font-size: 80rpx;
		text-align: center;
		letter-spacing: 0.5em;
	}

	.account,
	.password {
		margin-top: 50rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;

		label {
			margin: auto;
		}

		input {
			box-sizing: border-box;
			height: 100%;
			width: 75%;
			padding: 20rpx;
			border: 2rpx solid #e5e5e5;
			border-radius: 5%;
			margin-right: 30rpx;
		}
	}

	button {
		margin-top: 5%;
		border-radius: 5%;
	}
</style>
