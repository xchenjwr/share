<template>
	<view class="item" v-if="JSON.stringify(blog) != '{}'" @tap="openDetail">
		<view class="header">
			<image :src="blog.user.headimg" mode="" @tap.stop="toUserHome"></image>
			<view class="userinfo">
				<text class="username" @tap.stop="toUserHome">{{blog.user.username}}</text>
				<text class="time">{{$utils.formatDate(blog.time)}}</text>
			</view>
			<uni-icons v-if="flag" type="bottom" @tap.stop="userOpra" class="more" size="20"></uni-icons>
		</view>
		<view class="content">
			<text>{{blog.content}}</text>
			<view class="album" :class="{
				'album1': Object.keys(blog).length == 0 ? false : blog.filepath.length == 1,
				'album2': Object.keys(blog).length == 0 ? false : blog.filepath.length == 2,
				'album3': Object.keys(blog).length == 0 ? false : blog.filepath.length > 2,
			}" v-if="blog.filepath.length!=0">
				<view v-for="(item,index) in blog.filepath" :key="index" @click.stop="previewImage(blog.filepath,index)">
					<image :src="item" mode="aspectFill"></image>
				</view>
			</view>
		</view>
		<view class="footer">
			<view>
				<button open-type="share" :plain="true" send-message-title="趣分享" class="share" @tap.stop=""></button>
				<uni-icons type="redo" size="30" color="grey" class="shareIcon"></uni-icons>
			</view>
			<view>
				<uni-icons type="chat" size="30" @tap.stop="setComment" color="grey"></uni-icons><text
					v-if="blog.comments!=0">{{blog.comments}}</text>
			</view>
			<view>
				<uni-icons :type="blog.islike?'hand-up-filled':'hand-up'" :color="blog.islike?'#ee5738':'grey'" size="30"
					@tap.stop="togglelike">
				</uni-icons><text v-if="blog.likes!=0">{{blog.likes}}</text>
			</view>
		</view>
	</view>
	<c-input-dialog title="评论内容" :isShow="inputDialog" @cancel="closeDialog" @confirm="comment">
		<input type="text" class="commentcontent" v-model="content" placeholder="请输入评论内容(100字以内)">
	</c-input-dialog>
</template>

<script setup>
	import {
		request
	} from '@/network/request.js';
	import {
		onBeforeMount,
		ref
	} from 'vue';
	const props = defineProps({
		blogid: {
			type: Number
		},
	});

	// 获取文章
	let blog = ref({});
	async function getblogData() {
		request("/blog/getData", "GET", {
			blogid: Number(props.blogid)
		}).then(res => {
			blog.value = res.data;
			if (uni.getStorageSync('token')) {
				getIslike();
			}
		})
	}

	function getIslike() {
		request("/blog/islike", "GET", {
			blogid: Number(props.blogid)
		}).then(res => {
			blog.value.islike = res.data;
		})
	}

	function togglelike() {
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
			request("/blog/togglelike", "POST", {
				blogid: Number(props.blogid)
			}).then(res => {
				blog.value.islike = !blog.value.islike;
			})
		}
	}
	// 文章详情操作
	function previewImage(imagePath, index) {
		uni.previewImage({
			urls: imagePath,
			current: imagePath[index]
		})
	}

	function toUserHome() {
		let routes = getCurrentPages();
		let curRoute = routes[routes.length - 1].route;
		if (curRoute == 'pages/home/blogDetail') {
			uni.navigateTo({
				url: '/pages/profile/user_home?userid=' + blog.value.author,
			});
		} else {
			openDetail();
		}
	}

	function openDetail() {
		let routes = getCurrentPages();
		let curRoute = routes[routes.length - 1].route;
		if (curRoute != 'pages/home/blogDetail') {
			uni.navigateTo({
				url: '/pages/home/blogDetail?blogid=' + props.blogid,
			});
		}

	}
	// 评论操作
	let inputDialog = ref(false);
	let content = ref("");
	//openDialog
	function setComment() {
		if (!uni.getStorageSync('token')) {
			uni.showModal({
				title: '登录提示',
				content: "游客需要先登录才能评论，确定登录？",
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/login/index',
						});
					}
				}
			});
		} else {
			let routes = getCurrentPages();
			let curRoute = routes[routes.length - 1].route;
			if (curRoute == 'pages/home/blogDetail') {
				inputDialog.value = true;
			} else {
				openDetail();
			}
		}
	}

	function closeDialog() {
		inputDialog.value = false;
		content.value = "";
	}

	function comment() {
		if (content.value == "") {
			uni.showToast({
				title: "评论内容不能为空",
				duration: 1000,
				icon: 'none',
			});
			return;
		}
		let data = {
			blogid: props.blogid,
			content: content.value,
		}
		request("/comment/edit", "POST", data).then(res => {
			uni.showToast({
				title: res.msg,
				duration: 1000,
				icon: 'none',
			});
			inputDialog.value = false;
			content.value = "";
		})
	}

	//个人主页拥有更新删除功能
	let flag = ref(false);

	function userOpra() {
		let itemList = ['修改', '删除']
		uni.showActionSheet({
			itemList,
			success: function(res) {
				if (res.tapIndex == 1) {
					request('/blog/remove', "POST", {
						blogid: props.blogid,
					}).then(res => {
						uni.showToast({
							title: res.msg,
							duration: 1000,
							icon: 'none',
						});
						blog.value = {}
					})
				} else if (res.tapIndex == 0) {
					// 修改分享
				}
			},
		});
	}

	onBeforeMount(async () => {
		await getblogData();
		let routes = getCurrentPages();
		let curRoute = routes[routes.length - 1].route;
		let curParam = routes[routes.length - 1].options;
		if (curRoute == 'pages/profile/blog' && curParam.type == 'person') {
			flag.value = true;
		}
	})
</script>

<style lang='less' scoped>
	.item {
		background-color: #fff;
		padding: 2%;
		padding-bottom: 0;
		margin-bottom: 10rpx;
	}

	.header {
		display: flex;
		margin-bottom: 10rpx;
		height: 100rpx;

		image {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
		}

		.userinfo {
			width: 520rpx;
			display: flex;
			flex-direction: column;
			margin-left: 20rpx;

			.username {
				font-size: 40rpx;
			}

			.time {
				font-size: 30rpx;
				color: gray;
			}
		}

		.more {
			width: 100rpx;
			line-height: 60rpx;
			text-align: center;
		}
	}

	.content {
		.album {
			margin-top: 10rpx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: flex-start;
			align-content: flex-start;

			image {
				width: 233rpx;
				height: 233rpx;
				margin-right: 6rpx;
				margin-bottom: 6rpx;
				vertical-align: middle
			}

			view:nth-of-type(3n) image {
				margin-right: 0;
			}

			view:nth-of-type(6-n) image {
				margin-bottom: 0;
			}
		}

		.album3 {
			image {
				width: 233rpx;
				height: 233rpx;
				margin-right: 6rpx;
			}
		}

		.album2 {
			image {
				width: 354rpx;
				height: 354rpx;
				margin-right: 6rpx;
			}
		}

		.album1 {
			image {
				width: 450rpx;
				height: 450rpx;
			}
		}
	}

	.footer {
		display: flex;
		height: 80rpx;
		color: grey;

		view {
			position: relative;
			display: flex;
			flex: 1;
			align-items: center;
			justify-content: center;

			.share {
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
				border: 0;
				z-index: 999;
			}
		}

	}

	.commentcontent {
		margin: 0 20rpx;
		padding: 0 10rpx;
		height: 100rpx;
		border: 1rpx solid #ddd;
		border-radius: 5%;
	}
</style>