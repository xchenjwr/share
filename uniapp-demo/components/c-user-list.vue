<template>
	<view v-for="item in props.userList" @click="toUserHome(item.id)">
		<image :src="item.headimg" mode=""></image>
		<text>{{item.username}}</text>
	</view>
</template>

<script setup>
	const props = defineProps({
		userList: {
			type: Array,
			default: [],
		},
	})

	function toUserHome(userid) {
		uni.navigateTo({
			url: '/pages/profile/user_home?userid=' + userid,
		});
	}
</script>

<style lang="less" scoped>
	view {
		padding: 10rpx 30rpx;
		border-bottom: 1rpx solid #ddd;
		height: 100rpx;

		image {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			vertical-align: middle;
		}

		text {
			margin-left: 20rpx;
			font-size: 40rpx;
			line-height: 100rpx;
			vertical-align: middle;
		}
	}
</style>
