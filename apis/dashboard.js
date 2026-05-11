import axios from "axios";

export function getDashboardData() {
	const url = "/admin/dashboard";
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}
