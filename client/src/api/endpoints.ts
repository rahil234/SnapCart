import axiosInstance from './axiosInstance';

export const fetchItems = () => {
  return axiosInstance.get('/api/user');
}; 

export const createItem = (data : object) => {
  return axiosInstance.post('/items', data);
};