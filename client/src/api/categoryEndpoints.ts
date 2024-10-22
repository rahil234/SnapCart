import axiosInstance from './axiosInstance';

const getCategories = () => {
  return axiosInstance.get('/api/category/get-categories');
};

const addCategory = (data: object) => {
  return axiosInstance.post('/api/category/add-category', data);
};

const editCatogories = (data: object) => {
  return axiosInstance.patch('/api/category/edit-categories', data);
};

const archiveCategory = (subcategoryId: string) => {
  return axiosInstance.patch('/api/category/archive-category', { subcategoryId });
};

const unarchiveCategory = ( subcategoryId: string) => {
  return axiosInstance.patch('/api/category/unarchive-category', { subcategoryId });
};

export default {
  getCategories,
  addCategory,
  editCatogories,
  archiveCategory,
  unarchiveCategory,
};
