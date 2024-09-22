// src/tests/currencyRoutes.test.js
const request = require('supertest');
const express = require('express');
const currencyRoutes = require('../routes/currencyRoutes');
const errorHandler = require('../middleware/errorHandler');
const axios = require('axios');

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/api', currencyRoutes);
app.use(errorHandler);

describe('Currency Routes', () => {
  describe('GET /api/currencies', () => {
    it('should return a list of currencies', async () => {
      const mockCurrencies = {
        USD: 'United States Dollar',
        EUR: 'Euro',
      };

      axios.get.mockResolvedValue({ data: mockCurrencies });

      const res = await request(app).get('/api/currencies');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockCurrencies);
      expect(axios.get).toHaveBeenCalledWith('https://api.frankfurter.app/currencies');
    });

    it('should handle errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      const res = await request(app).get('/api/currencies');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Server Error');
      expect(res.body).toHaveProperty('error', 'Network Error');
    });
  });

  describe('GET /api/exchange-rate', () => {
    it('should return exchange rate data', async () => {
      const mockExchangeData = {
        amount: 1,
        base: 'USD',
        date: '2023-10-04',
        rates: {
          INR: 74.0,
        },
      };

      axios.get.mockResolvedValue({ data: mockExchangeData });

      const res = await request(app).get('/api/exchange-rate').query({
        from: 'USD',
        to: 'INR',
        amount: 1,
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockExchangeData);
      expect(axios.get).toHaveBeenCalledWith('https://api.frankfurter.app/latest', {
        params: { from: 'USD', to: 'INR', amount: 1 },
      });
    });

    it('should handle missing query parameters', async () => {
      const res = await request(app).get('/api/exchange-rate').query({
        from: 'USD',
        // 'to' and 'amount' are missing
      });

      expect(res.statusCode).toEqual(500); // Depending on your error handling
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Server Error');
    });

    it('should handle errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('External API Error'));

      const res = await request(app).get('/api/exchange-rate').query({
        from: 'USD',
        to: 'INR',
        amount: 1,
      });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Server Error');
      expect(res.body).toHaveProperty('error', 'External API Error');
    });
  });
});
