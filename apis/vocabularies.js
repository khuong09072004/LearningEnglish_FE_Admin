import axios from "axios";

function createVocabularyFormData(req, imageFile, vocabId) {
	const formData = new FormData();

	if (req !== undefined && req !== null) {
		if (req.word !== undefined) formData.append("word", req.word);
		if (req.meaning !== undefined) formData.append("meaning", req.meaning);
		// backend expects field name 'phonetic'
		if (req.pronunciation !== undefined) formData.append("phonetic", req.pronunciation);
		// map example -> description if backend expects description
		if (req.example !== undefined) formData.append("description", req.example);
		if (req.topicId !== undefined) formData.append("topicId", req.topicId);
	}

	if (vocabId !== undefined && vocabId !== null) {
		formData.append("vocabId", vocabId);
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
	// include vocabId also inside form data in case backend expects it as a field
	const formData = createVocabularyFormData(body?.req, body?.imageFile, vocabId);

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
