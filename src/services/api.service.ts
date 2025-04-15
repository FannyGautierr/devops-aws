import { AuthService } from './auth.service';
import axios from 'axios';

export const ApiService = {
  async callApi(apiName, path, method, body) {
    try {
      const options = {
        headers: {
          'Content-Type': 'application/json'
        },
        body: body
      };
      
      return await API[method.toLowerCase()](apiName, path, options);
    } catch (error) {
      console.error('API call error:', error);
      throw error;
    }
  },

  // Using Axios for more flexibility
  async request(config) {
    try {
      // Get the JWT token
      const token = await AuthService.getJwtToken();
      
      // Create default headers with auth token
      const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
        ...config.headers
      };

      const response = await axios({
        ...config,
        headers
      });

      return response.data;
    } catch (error) {
      console.error('Request error:', error);
      throw error;
    }
  }
};