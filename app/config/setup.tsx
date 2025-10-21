// recheck and resetup routes and endpoints

// Replace 'http://localhost:3000' with your deployed backend URL
export const API_BASE_URL = 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  user: {
    signup: `${API_BASE_URL}/api/v1/user/signup`,
    signin: `${API_BASE_URL}/api/v1/user/signin`,
    usertransaction: `${API_BASE_URL}/api/v1/user/usertransaction`
  },
  admin: {
    signup: `${API_BASE_URL}/api/v1/admin/signup`,
    signin: `${API_BASE_URL}/api/v1/admin/signin`,
    transactions: `${API_BASE_URL}/api/v1/admin/transaction/bulk`,
    createtransaction: `${API_BASE_URL}/api/v1/admin/createtransaction`,
  },
  transaction: {
    preview: `${API_BASE_URL}/api/v1/course/preview`,
    purchase: `${API_BASE_URL}/api/v1/course/purchase`
  }
};
