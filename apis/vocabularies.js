import axios from "axios";

function createVocabularyFormData(req, imageFile) {
	const formData = new FormData();

	if (req !== undefined && req !== null) {
		const reqBlob = new Blob([JSON.stringify(req)], {
			type: "application/json",
		});
		formData.append("req", reqBlob);
	}

	if (imageFile) {
		formData.append("imageFile", imageFile);
	}

	return formData;
}

export function getListVocabulary(topicId) {
	const url = "/admin/vocabularies";
	const config = topicId ? { params: { topicId } } : undefined;

	return new Promise((resolve, reject) => {
		axios
			.get(url, config)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function getVocabularyById(id) {
	const url = `/admin/vocabularies/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function createVocabulary(body) {
	const url = "/admin/vocabularies";
	const formData = createVocabularyFormData(body?.req, body?.imageFile);

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function updateVocabulary(vocabId, body) {
	const url = `/admin/vocabularies/${vocabId}`;
	const formData = createVocabularyFormData(body?.req, body?.imageFile);

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function deleteVocabulary(vocabId) {
	const url = `/admin/vocabularies/${vocabId}`;
	return new Promise((resolve, reject) => {
		axios
			.delete(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}
