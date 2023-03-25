<template>
	<view :class="{'bgcolorWhite':isSearching && (!searched||sType == 'user')}">
		<view class="top">
			<view class="nav" v-if="!isSearching">
				<uni-icons type="plus" size="35" @tap="edit"></uni-icons>
				<uni-data-select class="select" v-model="type" :localdata="range" @change="changeType" :clear="false">
				</uni-data-select>
				<uni-icons type="search" size="30" @tap="isSearching = true;" class="searchIcon">
				</uni-icons>
			</view>
			<view class="search" v-else>
				<view class="up">
					<uni-icons type="arrow-left" size="35" @tap="isSearching = false;">
					</uni-icons>
					<input type="text" v-model="searchValue" placeholder="分享或用户" confirm-type="search"
						@confirm="searchContent" @input="searched=false">
					<uni-icons type="clear" size="20" color="#d5d5d5" v-show="searchValue!=''" @tap="searchValue = '';
				searched = false;">
					</uni-icons>
				</view>
				<view class="low" v-if="searchValue!=''&&searched">
					<view v-for="item in sRange" @tap="changesType(item)" :class="{'item-active':item.value == sType}">
						<text>{{ item.text }}</text>
					</view>
				</view>
			</view>
		</view>
		<view v-for="item in bloglist" :key="item" v-if="!(isSearching && (!searched || sType == 'user'))">
			<c-artist-item :blogid="item" />
		</view>
		<view v-else v-show="searched">
			<c-user-list :userList="userList" />
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReachBottom,
		onPullDownRefresh
	} from "@dcloudio/uni-app"
	import {
		ref,
		watch
	} from "vue"
	import {
		request
	} from "@/network/request";
	let bloglist = ref([]);
	let page = ref(1);
	let type = ref("hot");
	let range = ref([{
			value: "hot",
			text: "热门"
		},
		{
			value: "time",
			text: "实时"
		}
	])
	let sRange = ref([{
			value: "hot",
			text: "热门"
		},
		{
			value: "time",
			text: "实时"
		},
		{
			value: "user",
			text: "用户"
		},
	])
	let searchValue = ref("");
	let isSearching = ref(false);
	let searched = ref(false);
	let sType = ref("hot");
	let sPage = ref(1);
	let userList = ref([]);
	//网络函数
	function searchContent() {
		bloglist.value = [];
		userList.value = []
		searched.value = true;
		getBlogList();
	}

	function changeType(e) {
		if (type.value != e) {
			bloglist.value = [];
			type.value = e;
			page.value = 1;
			getBlogList();
		}
	}

	function changesType(item) {
		if (sType.value != item.value) {
			bloglist.value = [];
			userList.value = [];
			sType.value = item.value;
			sPage.value = 1;
			getBlogList();
		}
	}

	function getBlogList() {
		let data = {}
		if (!isSearching.value) {
			data.keyword = "";
			data.type = type.value;
			data.page = page.value;
		} else if (isSearching.value) {
			data.keyword = searchValue.value;
			data.page = sPage.value;
			if (sType.value != 'user') {
				data.type = sType.value;
			}
		}
		data.num = 10;
		request(isSearching.value && sType.value == 'user' ? '/user/search' :
			"/blog/search", "GET", data).then(res => {
			if (isSearching.value && sType.value == 'user') {
				userList.value = [...userList.value, ...res.data];
			} else {
				bloglist.value = [...bloglist.value, ...res.data];
			}
		})
	}

	//功能函数
	function edit() {
		if (!uni.getStorageSync('token')) {
			uni.showModal({
				title: '登录提示',
				content: "游客需要先登录才能进行分享，确定登录？",
				success: function(res) {
					if (res.confirm) {
						uni.navigateTo({
							url: '/pages/login/index',
						});
					}
				},
			});
		} else {
			uni.navigateTo({
				url: '/pages/home/edit?type=edit',
			});
		}
	}
	watch(isSearching, (newval, oldval) => {
		console.log(newval, oldval);
		bloglist.value = [];
		searchValue.value = '';
		if (oldval == true && newval == false) {
			page.value = 1;
			getBlogList();
		}
	})
	onLoad(() => {
		getBlogList();
	})
	onReachBottom(() => {
		console.log("上拉加载更多");
		if (isSearching.value) {
			sPage.value += 1;
		} else {
			page.value += 1;
		}
		getBlogList();
	})
	onPullDownRefresh(() => {
		uni.redirectTo({
			url: "/pages/home/index"
		})
	})
</script>

<style lang="less">
	page {
		background-color: #f5f5f5;
	}

	.bgcolorWhite {
		height: 100vh;
		background-color: #fff;
	}

	.item-active {
		box-sizing: border-box;
		color: red !important;
		border-bottom: 2rpx solid red;
	}

	.top {
		margin-top: 0;
		background-color: #fff;
		position: sticky;
		top: 0;
		left: 0;

		.nav {
			display: flex;
			padding-left: 20rpx;
			height: 100rpx;
			line-height: 100rpx;
			margin-bottom: 12rpx;
			box-shadow: 0 4rpx 8rpx 2rpx #e5e5e5;

			.select {
				width: 140rpx;

				&:active {
					background-color: #ddd;
				}
			}

			.uni-select {
				height: 100rpx;
				border: 0;
				font-size: 40rpx;
				letter-spacing: 0.1em;
			}

			.select--uni-select__selector-item {
				font-size: 32rpx;

				text {
					margin: auto
				}
			}

			.searchIcon {
				width: 100%;
				padding-right: 20rpx;
				text-align: right;
			}
		}

		.search {
			.up {
				display: flex;
				height: 100rpx;
				line-height: 100rpx;
				margin-left: 20rpx;

				input {
					margin-left: 20rpx;
					width: 70%;
					height: 60rpx;
					padding: 20rpx;
				}
			}

			.low {
				display: flex;
				height: 100rpx;
				line-height: 100rpx;
				font-size: 35rpx;
				margin-bottom: 12rpx;
				box-shadow: 0 4rpx 8rpx 2rpx #e5e5e5;

				view {
					width: 20%;
					text-align: center;
					color: grey;
				}
			}
		}
	}
</style>
