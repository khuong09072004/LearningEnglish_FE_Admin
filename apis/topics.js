import axios from "axios";

export function getListTopic() {
	const url = "/admin/topics";
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function getTopicById(id) {
	const url = `/admin/topics/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function createTopic(body) {
	const url = "/admin/topics";
	return new Promise((resolve, reject) => {
		axios
			.post(url, body)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function updateTopic(id, body) {
	const url = `/admin/topics/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.put(url, body)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function deleteTopic(id) {
	const url = `/admin/topics/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.delete(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}
