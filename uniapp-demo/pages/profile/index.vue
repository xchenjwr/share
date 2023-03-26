<template>
	<view>
		<c-user-data :userid="userInfo.id" />
		<view class="userFunc">
			<view class="func-item" v-for="item in userFunc" :key="item.icon" @click="openFunc(item.icon)">
				<view class="icon">
					<uni-icons :type="item.icon" size="30"></uni-icons>
				</view>
				<view class="title"><text>{{item.name}}</text></view>
				<view class="link">
					<uni-icons type="right" size="20"></uni-icons>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	const userFunc = [{
			name: "个人信息",
			icon: "person",
		},
		{
			name: "个人主页",
			icon: "home",
		},
		{
			name: "我的点赞",
			icon: "hand-up"
		},
		{
			name: "账号设置",
			icon: "gear"
		},
	]
	import {
		onPullDownRefresh
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue";
	import {
		useUserStore
	} from "@/store/user.js"
	import {
		storeToRefs
	} from 'pinia'
	const {
		userInfo
	} = storeToRefs(useUserStore());

	function openFunc(func) {
		switch (func) {
			case "person":
				uni.navigateTo({
					url: "/pages/profile/person_info"
				})
				break;
			case "home":
				uni.navigateTo({
					url: `/pages/profile/blog?type=person&userid=${userInfo.value.id}`,
				})
				break;
			case "hand-up":
				uni.navigateTo({
					url: `/pages/profile/blog?type=like`,
				})
				break;
			case "gear":
				// uni.removeStorageSync('token');
				break;
		}
	}
</script>

<style lang="less">
	.userFunc {
		.func-item {
			height: 60rpx;
			padding: 15rpx;
			border-bottom: 1rpx solid #e5e5e5;

			.icon {
				float: left;
				margin-right: 20rpx;
			}

			.title {
				float: left;
				font-size: 40rpx;
				line-height: 60rpx;
			}

			.link {
				float: right;
				margin-right: 20rpx;
				margin-top: 20rpx;
			}
		}
	}
</style>