// src/services/authService.js
import axios from 'axios';
import {LOGIN_URL} from '../utils/endpoints';

// const API_URL = 'http://localhost:8000'; // Assurez-vous de remplacer par votre URL d'API

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${LOGIN_URL}`, {
      "username":username,
      "password":password,
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
    throw error.response.data;
  }
};
