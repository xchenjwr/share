<template>
	<c-user-data :userid="userid" />
	<view class="title">全部分享</view>
	<view v-for="item in bloglist" :key="item">
		<c-artist-item :blogid="item" />
	</view>
</template>

<script setup>
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app"
	import {
		ref,
	} from "vue"
	import {
		request
	} from "@/network/request";
	let userid = ref(0);
	let bloglist = ref([]);
	let page = ref(1);

	function getBlogList() {
		let data = {
			userid: userid.value,
			page: page.value,
			num: 10
		}
		request("/blog/getUserBlog", "GET", data).then(res => {
			bloglist.value = [...bloglist.value, ...res.data];
		})
	}

	onReachBottom(() => {
		console.log("上拉加载更多");
		page.value += 1;
		getBlogList();
	})

	onLoad((option) => {
		userid.value = option.userid;
		getBlogList()
	})
</script>

<style lang="less">
	page {
		background-color: #f5f5f5;
	}

	.title {
		padding-left: 20rpx;
		height: 60rpx;
		line-height: 60rpx;
		background-color: #f5f5f5;
		letter-spacing: 0.05em;
	}
</style>
