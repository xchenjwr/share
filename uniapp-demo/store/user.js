import {
	ref
} from "vue";
import {
	defineStore
} from "pinia"
import {
	request
} from "@/network/request.js"
export const useUserStore = defineStore('user', () => {

	const userInfo = ref({});

	function setUserInfo() {
		if (uni.getStorageSync('token')) {
			request('', "GET").then(res => {
				userInfo.value = res.data;
			})
		} else {
			uni.login({
				provider: 'weixin', //使用微信登录
				success: (loginRes) => {
					request("/login", "POST", {
						code: loginRes.code
					}).then(res => {
						uni.showToast({
							title: res.msg,
							duration: 2000,
							icon: 'none',
						});
						if (res.data) {
							uni.setStorageSync("token", res.data);
							if (uni.getStorageSync('token')) {
								request('', "GET").then(res => {
									userInfo.value = res.data;
								})
							}
						}
					})
				}
			})
		}
	}

	function getUserInfo() {
		return userInfo.value;
	}

	return {
		userInfo,
		setUserInfo,
		getUserInfo
	}
})