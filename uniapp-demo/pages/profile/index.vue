<template>
	<view v-if="userid!=0">
		<c-user-data :userid="userid" />
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
	import {
		onLoad,
		onPullDownRefresh
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue";
	import {
		request
	} from "@/network/request.js"
	import {
		useUserStore
	} from "@/store/user.js"
	const store = useUserStore();
	let userid = ref(0);
	let userFunc = [{
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

	function getUserInfo() {
		request("", "GET").then(res => {
			if (res.data) {
				userid.value = res.data.id;
				console.log(userid.value);
			}
		})
	}

	function openFunc(func) {
		switch (func) {
			case "person":
				uni.navigateTo({
					url: "/pages/profile/person_info"
				})
				break;
			case "home":
				console.log(store.getUserid())
				uni.navigateTo({
					url: `/pages/profile/blog?type=person&userid=${store.getUserid()}`,
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
		console.log("跳转", func);
	}
	onLoad(() => {
		if (uni.getStorageSync('token')) {
			getUserInfo();
		}
	})
	onPullDownRefresh(() => {
		uni.redirectTo({
			url: "/pages/profile/index"
		})
	})
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
