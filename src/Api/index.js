import axios from 'axios';

const API_URL = 'http://localhost:5228/api';

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/Auth/login`, { email, password });
    console.log("LOGIN SUCCESS", response.data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Export both ways
export { login };
export default { login };

