import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getRacers = () => api.get('/racers');
export const createRacer = (data) => api.post('/racers', data);
export const updateRacer = (id, data) => api.put(`/racers/${id}`, data);
export const deleteRacer = (id) => api.delete(`/racers/${id}`);

export const getClasses = () => api.get('/classes');
export const createClass = (data) => api.post('/classes', data);
export const updateClass = (id, data) => api.put(`/classes/${id}`, data);
export const deleteClass = (id) => api.delete(`/classes/${id}`);

export const getCars = () => api.get('/cars');
export const createCar = (data) => api.post('/cars', data);
export const updateCar = (id, data) => api.put(`/cars/${id}`, data);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

export const getSeasons = () => api.get('/seasons');
export const createSeason = (data) => api.post('/seasons', data);
export const updateSeason = (id, data) => api.put(`/seasons/${id}`, data);
export const deleteSeason = (id) => api.delete(`/seasons/${id}`);

export const getRaces = (seasonId) => api.get(`/races/${seasonId}`);
export const createRace = (data) => api.post('/races', data);
export const updateRace = (id, data) => api.put(`/races/${id}`, data);
export const deleteRace = (id) => api.delete(`/races/${id}`);

export const getRaceResults = (raceId) => api.get(`/race-results/${raceId}`);
export const createRaceResult = (data) => api.post('/race-results', data);
export const updateRaceResult = (id, data) => api.put(`/race-results/${id}`, data);
export const deleteRaceResult = (id) => api.delete(`/race-results/${id}`);

export default api;