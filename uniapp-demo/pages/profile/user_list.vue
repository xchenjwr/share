<template>
	<c-user-list :userList="userList" />
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
	let userList = ref([]);
	let userid = ref(0);
	let page = ref(1);
	let type = ref('fan');

	function getUserList() {
		let data = {
			type: type.value,
			userid: userid.value,
			page: page.value,
			num: 10
		}
		request("/user/getList", "GET", data).then(res => {
			userList.value = [...userList.value, ...res.data];
		})
	}
	onReachBottom(() => {
		console.log("上拉加载更多");
		page.value += 1;
		getUserList();
	})

	onLoad((option) => {
		userid.value = option.userid;
		type.value = option.type;
		getUserList();
	})
</script>

<style lang="less">

</style>
