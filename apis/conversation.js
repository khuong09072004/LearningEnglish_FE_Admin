import axios from "axios";

export function getLessonById(lessonId) {
  const url = `/admin/conversations/lessons/${lessonId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function updateLesson(lessonId, body) {
  const url = `/admin/conversations/lessons/${lessonId}`;
  return new Promise((resolve, reject) => {
    axios
      .put(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function deleteLesson(lessonId) {
  const url = `/admin/conversations/lessons/${lessonId}`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getLessons() {
  const url = `/admin/conversations/lessons`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function createLesson(body) {
  const url = `/admin/conversations/lessons`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getStepById(lessonId, stepId) {
  const url = `/admin/conversations/lessons/${lessonId}/steps/${stepId}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function updateStep(lessonId, stepId, body) {
  const url = `/admin/conversations/lessons/${lessonId}/steps/${stepId}`;
  return new Promise((resolve, reject) => {
    axios
      .put(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function deleteStep(lessonId, stepId) {
  const url = `/admin/conversations/lessons/${lessonId}/steps/${stepId}`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function createStep(lessonId, body) {
  const url = `/admin/conversations/lessons/${lessonId}/steps`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function suggestSteps(lessonId, count) {
  let url = `/admin/conversations/lessons/${lessonId}/steps/suggest`;
  if (typeof count !== 'undefined' && count !== null) {
    const q = `?count=${encodeURIComponent(count)}`;
    url += q;
  }
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function createStepsBulk(lessonId, stepsArray) {
  const url = `/admin/conversations/lessons/${lessonId}/steps/bulk`;
  return new Promise((resolve, reject) => {
    axios
      .post(url, stepsArray)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
