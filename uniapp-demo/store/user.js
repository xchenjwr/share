import {
	ref
} from "vue";
import {
	defineStore
} from "pinia"
export const useUserStore = defineStore('user', () => {
	const userid = ref(0);

	function setUserid(val) {
		userid.value = val;
	}

	function getUserid() {
		return userid.value;
	}

	return {
		userid,
		setUserid,
		getUserid
	}
})
