import axiosInstance from './axiosInstance';

const adminLogin = (data: object) => {
  return axiosInstance.post('/api/admin/login', data);
};

const getCategories = () => {
  return axiosInstance.get('/api/admin/get-categories');
};

const addCategory = (data: object) => {
  return axiosInstance.post('/api/admin/add-category', data);
};

const editCatogories = (data: object) => {
  return axiosInstance.patch('/api/admin/edit-categories', data);
};

const getProducts = () => {
  return axiosInstance.get('/api/admin/get-products');
};

const addProduct = (data: FormData) => {
  return axiosInstance.post('/api/admin/add-product', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const editProduct = (data: FormData) => {
  return axiosInstance.patch('/api/admin/edit-product', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getUsers = () => {
  return axiosInstance.get('/api/admin/get-users');
};

const getSellers = () => {
  return axiosInstance.get('/api/admin/get-sellers');
};

const getBanners = async () => {
  return axiosInstance.get('/api/admin/get-banners');
};

const uploadBannerImage = async (data: FormData) => {
  return axiosInstance.patch('/api/admin/upload-banner-image', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateBannerOrder = async (updatedBanners: { id: number, order: number }[]) => {
  return axiosInstance.patch('/api/admin/update-banner-order', { banners: updatedBanners });
};

const saveBanners = async (banners: { _id: number, image: string, order: number }[]) => {
  return axiosInstance.post('/api/admin/save-banners', { banners });
};

const deleteBanner = async (bannerId: string) => {
  return axiosInstance.delete(`/api/admin/delete-banner/${bannerId}`);
};

export default {
  adminLogin,
  getCategories,
  addCategory,
  editCatogories,
  getProducts,
  addProduct,
  editProduct,
  getUsers,
  getSellers,
  getBanners,
  saveBanners,
  updateBannerOrder,
  uploadBannerImage,
  deleteBanner,
};
