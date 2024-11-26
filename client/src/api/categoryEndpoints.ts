import axiosInstance from './axiosInstance';

const getCategories = async () => {
  const response = await axiosInstance.get('/api/category/get-categories');
  console.log(response.data);

  return response.data;
};

const addCategory = (data: object) => {
  return axiosInstance.post('/api/category/add-category', data);
};

const editCatogories = (data: object) => {
  return axiosInstance.patch('/api/category/edit-categories', data);
};

const archiveCategory = (subcategoryId: string) => {
  return axiosInstance.patch('/api/category/archive-category', {
    subcategoryId,
  });
};

const unarchiveCategory = (subcategoryId: string) => {
  return axiosInstance.patch('/api/category/unarchive-category', {
    subcategoryId,
  });
};

const getTopCategories = async () => {
  const response = await axiosInstance.get('/api/category/top-categories');
  console.log(response.data);
  return response.data;
};

export default {
  getCategories,
  addCategory,
  editCatogories,
  archiveCategory,
  unarchiveCategory,
  getTopCategories
};
