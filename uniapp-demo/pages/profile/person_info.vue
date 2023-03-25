<template>
	<view class="img">
		<image :src="userInfo.headimg" @click="changeheadimg"></image>
		<uni-icons class="icon" type="camera-filled" color="#fff" size="18"></uni-icons>
	</view>
	<view class="form">
		<view>
			<label for="username">用户名</label>
			<input type="text" id="username" v-model="userInfo.username" disabled="true"
				@click="openDialog('username')" />
		</view>
		<view>
			<label for="sex">性别</label>
			<input type="text" id="sex" v-model="userInfo.sex" disabled="true" @click="openDialog('sexDialog')" />
		</view>
		<view>
			<label for="age">年龄</label>
			<input type="text" id="age" v-model="userInfo.age" disabled="true" @click="openDialog('age')" />
		</view>
	</view>
	<c-input-dialog :title="msg[type][0]" :isShow="inputDialog" @cancel="closeDialog" @confirm="changeMsg">
		<input type="text" class="newinput" v-model="newValue" :placeholder="msg[type][1]">
	</c-input-dialog>
</template>

<script setup>
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import {
		request
	} from "@/network/request.js"
	import {
		ref
	} from "vue";
	let userInfo = ref({});
	let inputDialog = ref(false);
	let type = ref('username');
	let newValue = ref("");
	const msg = ref({
		username: ["修改用户名", "请输入新的用户名(12字符以内)"],
		age: ["修改年龄", "请输入数字(0-200)或者不输入"],
	})

	function openDialog(dialog) {
		switch (dialog) {
			case 'username':
				type.value = 'username';
				newValue.value = userInfo.value.username;
				inputDialog.value = true;
				break;
			case 'sexDialog':
				let itemList = ['男', '女', '保密']
				uni.showActionSheet({
					itemList,
					success: function(res) {
						let data = {
							key: "sex",
							value: res.tapIndex == 2 ? "" : itemList[res.tapIndex]
						}
						updatamsg(data);
					},
				});
				break;
			case 'age':
				type.value = 'age';
				inputDialog.value = true;
				newValue.value = userInfo.value.age;
				break;
		}
	}

	function changeheadimg() {
		uni.chooseMedia({
			count: 1,
			mediaType: ['image'],
			sourceType: ['album', 'camera'],
			camera: 'front',
			success(res) {
				let data = {
					key: "headimg",
					value: "",
				}
				console.log(res.tempFiles[0].tempFilePath);
				updatamsg(data, res.tempFiles[0].tempFilePath);
			}
		})
	}

	function closeDialog() {
		inputDialog.value = false;
		newValue.value = "";
	}

	function changeMsg() {
		inputDialog.value = false;
		let data = {
			key: type.value,
			value: newValue.value
		}
		updatamsg(data);
		newValue.value = "";
	}

	function updatamsg(data, filepath = "") {
		request("/user/updata", "POST", data, filepath).then((res) => {
			uni.showToast({
				title: res.msg,
				duration: 1000,
				icon: 'none',
			});
			getData();
		})
	}

	function getData() {
		request("", "GET").then(res => {
			console.log(res.data);
			if (res.data) {
				userInfo.value = res.data;
			}
		})
	}
	onLoad(() => {
		getData();
	})
</script>

<style lang="less">
	page {
		background-color: #f5f5f5;
	}

	.img {
		width: 150rpx;
		height: 150rpx;
		margin: 40rpx auto;
		position: relative;

		image {
			position: absolute;
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
		}

		.icon {
			position: absolute;
			bottom: 0;
			right: 0;
			width: 50rpx;
			height: 50rpx;
			line-height: 50rpx;
			text-align: center;
			background-color: rgba(0, 170, 0, 0.7);
			border-radius: 50%;
		}
	}

	.form {
		padding: 0 5%;
		background-color: #fff;
		border-top: 2rpx solid #e5e5e5;
		border-bottom: 2rpx solid #e5e5e5;

		view {
			display: flex;
			padding: 10rpx 0;
			height: 80rpx;
			line-height: 80rpx;
			border-bottom: 2rpx solid #eee;

			label {
				width: 20%;
				text-align: left;
				color: gray;
			}

			input {
				width: 80%;
				height: 80%;
				margin: auto;
			}
		}
	}

	.newinput {
		margin: 0 20rpx;
		padding: 0 10rpx;
		height: 100rpx;
		border: 1rpx solid #ddd;
		border-radius: 5%;
	}
</style>
