<template>
	<view v-for="item in bloglist" :key="item">
		<c-artist-item :blogid="item" />
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue"
	import {
		request
	} from "@/network/request";
	import {
		onLoad,
		onReachBottom
	} from "@dcloudio/uni-app"
	let userid = ref(0);
	let type = ref('person');
	let page = ref(1);
	let bloglist = ref([]);

	function getBlogList() {
		let data = {
			page: page.value,
			num: 10
		}
		let path = "/blog/getLikeBlog";
		if (type.value == 'person') {
			data.userid = userid.value;
			path = "/blog/getUserBlog";
		}
		request(path, "GET", data).then(res => {
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
		type.value = option.type;
		uni.setNavigationBarTitle({
			title: option.type == 'person' ? '个人主页' : '我的点赞'
		})
		getBlogList()
	})
</script>

<style lang="less">
	page {
		background-color: #f5f5f5;
	}
</style>