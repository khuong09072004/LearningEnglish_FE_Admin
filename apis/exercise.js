import axios from "axios";

function createExerciseFormData(req, audioFile) {
	const formData = new FormData();

	if (req !== undefined && req !== null) {
		const reqBlob = new Blob([JSON.stringify(req)], {
			type: "application/json",
		});
		formData.append("req", reqBlob);
	}

	if (audioFile) {
		formData.append("audioFile", audioFile);
	}

	return formData;
}

export function getExercises(topicId) {
	const url = "/admin/exercises";
	const config = topicId ? { params: { topicId } } : undefined;

	return new Promise((resolve, reject) => {
		axios
			.get(url, config)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function getExerciseById(id) {
	const url = `/admin/exercises/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function createExercise(body) {
	const url = "/admin/exercises";
	const formData = createExerciseFormData(body?.req, body?.audioFile);

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function updateExercise(id, body) {
	const url = `/admin/exercises/${id}`;
	const formData = createExerciseFormData(body?.req, body?.audioFile);

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function deleteExercise(id) {
	const url = `/admin/exercises/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.delete(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function getExerciseItemById(id) {
	const url = `/exercise-items/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function updateExerciseItem(id, body) {
	const url = `/exercise-items/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.put(url, body)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function deleteExerciseItem(id) {
	const url = `/exercise-items/${id}`;
	return new Promise((resolve, reject) => {
		axios
			.delete(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function getExerciseItemsByExercise(exerciseId) {
	const url = `/exercise-items/exercise/${exerciseId}`;
	return new Promise((resolve, reject) => {
		axios
			.get(url)
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}