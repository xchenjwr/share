<template>
	<c-artist-item :blogid="blogid" />
	<uni-section title="文章评论" titleColor="#000" v-if="commentList.length != 0"></uni-section>
	<view v-for="(item,index) in commentList" class="comment">
		<view class="top">
			<image :src="item.user.headimg" @tap="toUserHome(item.user.id)" />
			<view class="center">
				<text @tap="toUserHome(item.user.id)">{{item.user.username}}</text>
				<text>{{$utils.formatDate(item.time)}}</text>
			</view>
			<view class="right">
				<text v-if="item.likes!=0">{{item.likes}}</text>
				<uni-icons :type="item.islike?'hand-up-filled':'hand-up'" :color="item.islike?'#ee5738':'grey'" size="25"
					@tap="toggleclike(item.id,index)">
				</uni-icons>
			</view>
		</view>
		<view class="bottom">
			<text>{{item.content}}</text>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		ref
	} from "vue"
	import {
		request
	} from "@/network/request.js"
	let blogid = ref(0);
	let page = ref(1);
	let commentList = ref([]);

	function getComment() {
		let data = {
			blogid: blogid.value,
			page: page.value,
			num: 10,
		}
		request("/comment/getData", "GET", data).then((res) => {
			commentList.value = [...commentList.value, ...res.data];
		})
	};

	function toUserHome(userid) {
		uni.navigateTo({
			url: '/pages/profile/user_home?userid=' + userid,
		});
	}

	function toggleclike(commentid, index) {
		if (!uni.getStorageSync('token')) {
			uni.showModal({
				title: '登录提示',
				content: "游客需要先登录才能点赞，确定登录？",
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/login/index',
						});
					}
				}
			});
		} else {
			request('/comment/toggleclike', "POST", {
				commentid
			}).then(res => {
				if (commentList.value[index].islike) {
					commentList.value[index].likes -= 1;
				} else {
					commentList.value[index].likes += 1;
				}
				commentList.value[index].islike = !commentList.value[index].islike;
			})
		}
	};

	onLoad((option) => {
		blogid.value = option.blogid;
		getComment();
	})
	onReachBottom(() => {
		console.log("下拉更新一次评论列表");
		page.value += 1;
		getComment();
	})
</script>

<style lang="less">
	page {
		background-color: #f5f5f5;
	}

	.comment {
		background-color: #fff;
		border-bottom: 1rpx solid #f0f0f0;
		padding: 20rpx;

		.top {
			display: flex;

			image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 10rpx;
				margin-bottom: 10rpx;
			}

			.center {
				display: flex;
				flex-direction: column;
				width: 70%;

				text {
					&:nth-of-type(2) {
						margin-top: 5rpx;
						font-size: 25rpx;
						color: gray;
					}
				}
			}

			.right {
				width: 150rpx;
				display: flex;
				font-size: 30rpx;
				justify-content: flex-end;
				margin: auto;
				color: grey;

				text {
					line-height: 50rpx;
				}
			}
		}

		.bottom {
			margin-left: 80rpx;
		}
	}
</style>