import axios from "axios";

export function getListUser() {
	const url = "/admin/users";
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function getUserById(id) {
	const url = `/admin/users/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function updateUserStatus(id, body) {
	const status = (body?.status || "").toString().toUpperCase();
	if (!["ACTIVE", "LOCKED"].includes(status)) {
		return Promise.reject(new Error("status must be ACTIVE or LOCKED"));
	}

	const url = `/admin/users/${id}/status`;
	return new Promise((resolve, reject) => {
		axios
			.put(url, { status })
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}
