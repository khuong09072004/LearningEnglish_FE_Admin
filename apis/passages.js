import axios from "axios";

export function getListPassage() {
	const url = "/admin/passages";
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function createPassage(body) {
	const url = "/admin/passages";
	return new Promise((resolve, reject) => {
		axios
			.post(url, body)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function updatePassage(id, body) {
	const url = `/admin/passages/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.put(url, body)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function deletePassage(id) {
	const url = `/admin/passages/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.delete(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}
export function getPassageById(id) {
  const url = `/passages/${id}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
