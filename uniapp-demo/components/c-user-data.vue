<template>
	<view class="page">
		<view class="userInfo">
			<image :src="userInfo.headimg" mode="" @click="imgPreview"></image>
			<view class="text">
				<text v-if="userInfo.age!=null">年：{{userInfo.age}}</text>
				<view>{{userInfo.username}}
					<image v-if="userInfo.sex!=null" class="sex"
						:src="userInfo.sex=='女'?'../static/image/sexMale.png':'../static/image/sexFemale.png'" mode="">
					</image>
				</view>
			</view>
		</view>
		<view class="follow" @tap="togglefollow" v-if="myInfo&&myInfo.id != props.userid">
			<uni-icons :type="isfan?'auth':'personadd'" size="25"></uni-icons>
			<text>{{isfan?'已关注':'关注'}}</text>
		</view>
		<view class="userData">
			<view>
				<text>获赞</text>
				<text>{{userInfo.count?userInfo.count:0}}</text>
			</view>
			<view @click="openList('fan')">
				<text>粉丝</text>
				<text>{{userInfo.fan}}</text>
			</view>
			<view @click="openList('follow')">
				<text>关注</text>
				<text>{{userInfo.follow}}</text>
			</view>
		</view>
	</view>

</template>

<script setup>
	import {
		ref,
		onBeforeMount
	} from "vue";
	import {
		request
	} from "@/network/request.js"
	import {
		useUserStore
	} from "@/store/user.js"
	import {
		storeToRefs
	} from 'pinia'
	let {
		userInfo: myInfo
	} = storeToRefs(useUserStore());

	const props = defineProps({
		userid: {
			type: Number,
		},
	});

	let userInfo = ref({});
	let isfan = ref(false);

	async function getUserInfo() {
		await request("/user/getData", "GET", {
			userid: props.userid,
		}).then(res => {
			userInfo.value = res.data;
		})
		await request("/user/isfan", "GET", {
			useredid: props.userid,
		}).then(res => {
			isfan.value = res.data;
		})
	}

	function openList(type) {
		uni.navigateTo({
			url: `/pages/profile/user_list?type=${type}&userid=${props.userid}`
		});
	}

	function imgPreview() {
		uni.previewImage({
			current: 0,
			urls: [userInfo.value.headimg],
		})
	}

	function togglefollow() {
		request("/user/togglefollow", "POST", {
			useredid: props.userid,
		}).then(res => {
			uni.showToast({
				title: res.msg,
				duration: 1000,
				icon: 'none',
			});
			isfan.value = !isfan.value;
		})
	}
	onBeforeMount(async () => {
		await getUserInfo();
	})
</script>

<style lang="less" scoped>
	.page {
		background-color: #fff;
	}

	.userInfo {
		display: flex;
		flex-direction: column;
		margin-top: 10rpx;
		margin-bottom: 20rpx;

		image {
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
			margin: auto;
			margin-bottom: 20rpx;
		}

		.text {
			position: relative;
			text-align: center;
			font-size: 40rpx;
			height: 60rpx;

			text {
				position: absolute;
				font-size: 35rpx;
				left: 30rpx;
				top: 50%;
				transform: translateY(-50%);
				color: #222;
			}

			view {
				display: inline-block;

				.sex {
					float: right;
					width: 40rpx;
					height: 40rpx;
					margin-bottom: 0;
					margin-right: -40rpx;
				}
			}
		}
	}

	.userData {
		display: flex;
		flex-direction: row;
		text-align: center;
		border: 1rpx solid #e5e5e5;

		view {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 40rpx;
		}
	}

	.follow {
		position: absolute;
		top: 5%;
		right: 10%;
		padding: 5rpx 10rpx;
		height: 60rpx;
		border-radius: 15%;
		font-size: 35rpx;
		color: #555;
		border: 2rpx solid #555;

		&:active {
			color: #888;
			border: 2rpx solid #888;
		}
	}
</style>