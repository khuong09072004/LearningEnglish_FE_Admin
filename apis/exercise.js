import axios from "axios";

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

	// Các field đi vào query params
	const params = {
		topicId: body?.topicId,
		title: body?.title,
		type: body?.type,
		duration: body?.duration,
		category: body?.category,
	};

	// audioFile đi vào multipart/form-data
	const formData = new FormData();
	if (body?.audioFile) {
		formData.append("audioFile", body.audioFile);
	}

	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, {
				params,
				headers: { "Content-Type": "multipart/form-data" },
			})
			.then((response) => resolve(response.data))
			.catch((error) => reject(error));
	});
}

export function updateExercise(id, body) {
	const url = `/admin/exercises/${id}`;

	const params = {
		topicId: body?.topicId,
		title: body?.title,
		type: body?.type,
		duration: body?.duration,
		category: body?.category,
	};

	const formData = new FormData();
	if (body?.audioFile) {
		formData.append("audioFile", body.audioFile);
	}

	return new Promise((resolve, reject) => {
		axios
			.put(url, formData, {
				params,
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