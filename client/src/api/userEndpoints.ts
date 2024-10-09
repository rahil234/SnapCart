import axiosInstance from './axiosInstance';

export const userLogin = (data: object) => {
  return axiosInstance.post('/api/user/login', data);
};

interface User {
  access_token: string;
}

export const userGoogleLogin = (user: User) => {
  return axiosInstance
  .get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
        Accept: 'application/json',
      },
    }
  )
}

export const userSignUp = (data: object) => {
  return axiosInstance.post('/api/user/signup', data);
};

export const fetchProducts = () => {
  return axiosInstance.get('/api/user/products');
};

export const fetchProductById = (productId: string) => {
  return axiosInstance.get(`/api/user/products/${productId}`);
};

