import axios from "axios";

export function getListGrammar(levelId) {
  const url = "/admin/grammar";
  const config = levelId ? { params: { levelId } } : undefined;
  return new Promise((resolve, reject) => {
    axios
      .get(url, config)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function getGrammarById(id) {
  const url = `/admin/grammar/${id}`;
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function createGrammar(body) {
  const url = "/admin/grammar";
  return new Promise((resolve, reject) => {
    axios
      .post(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function updateGrammar(id, body) {
  const url = `/admin/grammar/${id}`;
  return new Promise((resolve, reject) => {
    axios
      .put(url, body)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}

export function deleteGrammar(id) {
  const url = `/admin/grammar/${id}`;
  return new Promise((resolve, reject) => {
    axios
      .delete(url)
      .then((response) => resolve(response.data))
      .catch((error) => reject(error));
  });
}
