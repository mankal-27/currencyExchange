// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const fetchCurrencies = async () => {
  const response = await axios.get(`${API_BASE_URL}/currencies`);
  return response.data;
};

export const fetchExchangeRate = async (from, to, amount) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/exchange-rate`, {
      params: { from, to, amount },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
