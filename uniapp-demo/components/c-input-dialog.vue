<template>
	<transition name="fade">
		<view class="confirm-mask" v-if="showConfirm" @tap="cancel">
			<view class="wrapper" @tap.stop="">
				<view class="title">{{ props.title }}</view>
				<slot></slot>
				<view @tap="confirm" class="btns">{{ props.confirmText }}</view>
			</view>
		</view>
	</transition>
</template>

<script setup>
	import {
		ref,
		watch
	} from "vue";
	const props = defineProps({
		isShow: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: "提示",
		},
		cancelText: {
			type: String,
			default: "取消",
		},
		confirmText: {
			type: String,
			default: "确定",
		}
	})
	const emit = defineEmits(['cancel', 'confirm'])

	let showConfirm = ref(false);

	function confirm() {
		emit('confirm');
	}

	function cancel() {
		emit('cancel');
	}

	watch(() => props.isShow, (val) => {
		showConfirm.value = val;
	}, {
		immediate: true,
	})
</script>

<style lang="less" scoped>
	.confirm-mask {
		position: fixed;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 998;

		.wrapper {
			position: absolute;
			width: 100%;
			bottom: 0;
			z-index: 999;
			background: #fff;
			overflow: hidden;

			.title {
				height: 120rpx;
				margin-left: 20rpx;
				font-size: 40rpx;
				text-align: left;
				line-height: 120rpx;
				color: #555;
			}

			.btns {
				margin-top: 20rpx;
				text-align: center;
				height: 100rpx;
				line-height: 100rpx;
				background-color: #ddd;
			}
		}
	}
</style>