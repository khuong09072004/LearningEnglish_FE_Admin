import axios from "axios";

export function getAllContacts() {
	const url = "/admin/contacts";
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function getContactById(id) {
	const url = `/admin/contacts/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function deleteContact(id) {
	const url = `/admin/contacts/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.delete(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

