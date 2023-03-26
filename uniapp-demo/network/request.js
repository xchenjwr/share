export function request(path, method, data = null, filePath = "") {
	return new Promise((resolve, reject) => {
		let options = {
			url: "http://192.168.124.5:3001/api" + path,
			header: {
				"Authorization": "Bearer " + uni.getStorageSync("token"),
			},
			timeout: 10000,
			success: (res) => {
				if (Object.prototype.toString.call(res.data) == '[object String]') {
					res.data = JSON.parse(res.data);
				}
				if (res.data.code == 200) {
					resolve(res.data);
				} else {
					console.log(res);
					reject(res.data);
				}
			},
			fail: (err) => {
				uni.showToast({
					title: '网络异常',
					duration: 2000,
					icon: 'none',
				});
				console.log(err);
				reject(err);
			},
		}
		if (filePath != "") {
			uni.uploadFile({
				...options,
				filePath,
				name: 'file',
				formData: data
			})
		} else {
			uni.request({
				...options,
				method,
				data,
			})
		}
	})
}