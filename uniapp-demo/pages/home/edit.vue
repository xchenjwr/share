<template>
	<view>
		<view class="publish">
			<text @tap="reset">清空</text>
			<text @tap="publish">{{type=='edit'?"发布":"更新"}}</text>
		</view>
		<textarea class="content" placeholder="请输入分享的文字内容" v-model="content" cols="30" rows="10"></textarea>
		<view class="example-body">
			<uni-file-picker :value="fileList" file-mediatype="image" :auto-upload="false" ref="files" limit="9"
				mode="grid" title="最多选择9张图片">
			</uni-file-picker>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import {
		request
	} from "@/network/request.js"
	import {
		onLoad
	} from "@dcloudio/uni-app"
	let content = ref('');
	let files = ref(null);
	let type = ref("edit");
	let fileList = ref([{
		"name": "default.jpeg",
		"extname": "jpeg",
		"url": "http://127.0.0.1:3001/default.jpeg"

	}])

	function publish() {
		let filepath = [];
		let promises = [];
		files.value.files.forEach((item, index) => {
			let data = {
				type: "upload"
			}
			promises.push(request("/blog/edit", "POST", data, item.url)
				.then(res => {
					filepath[index] = res.data[0];
				}))
		})
		Promise.all(promises).then(() => {
			let data = {
				type: "submit",
				content: content.value,
				filepath,
			}
			request("/blog/edit", "POST", data).then(res => {
				uni.showToast({
					title: res.msg,
					duration: 1000,
					icon: 'none',
				});
				setTimeout(() => {
					uni.navigateBack({
						delta: 1
					});
				}, 1000)
			})
		})
	}

	function reset() {
		content.value = "";
		files.value.files = [];
	}

	onLoad((option) => {
		type.value = option.type;
		console.log(fileList.value);
	})
</script>

<style lang="less">
	.example-body {
		padding: 10px;
		padding-top: 0;
	}

	.publish {
		overflow: hidden;
		padding: 20rpx;
		border-bottom: 1rpx solid #e5e5e5;

		text {
			font-size: 35rpx;

			&:nth-of-type(1) {
				float: left;
			}

			&:nth-of-type(2) {
				float: right;
			}
		}
	}

	.content {
		padding: 20rpx;
		border-bottom: 1rpx solid #e5e5e5;
	}
</style>
