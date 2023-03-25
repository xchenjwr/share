<template>
	<view>
		<view class="title">注册</view>
		<view class="account">
			<label for="account">账号</label>
			<input type="text" id="account" v-model="account" placeholder="请输入账号" />
		</view>
		<view class="password">
			<label for="password">密码</label>
			<input type="safe-password" password id="password" v-model="password" placeholder="请输入密码" />
		</view>
		<view class="password">
			<label for="password">重复密码</label>
			<input type="safe-password" password id="password" v-model="repassword" placeholder="请再次输入密码" />
		</view>
		<button @tap="submit">注册</button>
	</view>
</template>

<script setup>
	import {
		request
	} from "../../network/request.js"
	import {
		ref
	} from "vue";
	let account = ref("");
	let password = ref("");
	let repassword = ref("");

	function submit() {
		if (account.value == "" || password.value == "" || repassword.value == "") {
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
			repassword: repassword.value,
		}
		request("/register", "POST", data).then((res) => {
			uni.showToast({
				title: res.msg,
				duration: 1000,
				icon: 'none',
			});
			if (res.data) {
				setTimeout(() => {
					uni.redirectTo({
						url: "/pages/login/login"
					})
				}, 1000)
			}
		});
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
