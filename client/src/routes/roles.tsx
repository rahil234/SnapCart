export const roles = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const permissions = {
  [roles.USER]: ['/'],
  [roles.ADMIN]: ['/admin', '/admin/dashboard', '/admin/products', '/admin/categories', '/admin/user-management'],
};