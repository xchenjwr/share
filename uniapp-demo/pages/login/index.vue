<template>
	<view>
		<uni-icons type="staff-filled" size="100"></uni-icons>
		<button @tap="toOther('login')">登录</button>
		<button @tap="toOther('register')">注册</button>
		<button @tap="wxlogin()">微信授权登录</button>
	</view>
</template>

<script setup>
	import {
		request
	} from '@/network/request.js';

	function toOther(str) {
		uni.navigateTo({
			url: '/pages/login/' + str,
		});
	}

	function wxlogin() {

	}
</script>

<style lang="less">
	view {
		display: flex;
		flex-direction: column;
		text-align: center;
		margin-top: 100rpx;

		button {
			width: 90%;
			border-radius: 5%;

			&:nth-of-type(1) {
				margin-top: 100rpx;
				background-color: #e5e5e5;
			}

			&:nth-of-type(2) {
				margin-top: 50rpx;
			}

			&:nth-of-type(3) {
				margin-top: 50rpx;
				background-color: #22d96e;
				color: #fff;
			}
		}
	}
</style>
