// src/tests/currencyController.test.js
const currencyController = require('../controllers/currencyController');
const axios = require('axios');

jest.mock('axios');

describe('Currency Controller', () => {
  describe('getAvailableCurrencies', () => {
    it('should respond with currencies data', async () => {
      const req = {};
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockCurrencies = {
        USD: 'United States Dollar',
        EUR: 'Euro',
      };

      axios.get.mockResolvedValue({ data: mockCurrencies });

      await currencyController.getAvailableCurrencies(req, res, next);

      expect(axios.get).toHaveBeenCalledWith('https://api.frankfurter.app/currencies');
      expect(res.json).toHaveBeenCalledWith(mockCurrencies);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const req = {};
      const res = {};
      const next = jest.fn();

      axios.get.mockRejectedValue(new Error('API Failure'));

      await currencyController.getAvailableCurrencies(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('API Failure'));
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('getExchangeRate', () => {
    it('should respond with exchange rate data', async () => {
      const req = {
        query: {
          from: 'USD',
          to: 'INR',
          amount: 1,
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      const mockExchangeData = {
        amount: 1,
        base: 'USD',
        date: '2023-10-04',
        rates: {
          INR: 74.0,
        },
      };

      axios.get.mockResolvedValue({ data: mockExchangeData });

      await currencyController.getExchangeRate(req, res, next);

      expect(axios.get).toHaveBeenCalledWith('https://api.frankfurter.app/latest', {
        params: { from: 'USD', to: 'INR', amount: 1 },
      });
      expect(res.json).toHaveBeenCalledWith(mockExchangeData);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with error on failure', async () => {
      const req = {
        query: {
          from: 'USD',
          to: 'INR',
          amount: 1,
        },
      };
      const res = {};
      const next = jest.fn();

      axios.get.mockRejectedValue(new Error('API Failure'));

      await currencyController.getExchangeRate(req, res, next);

      expect(next).toHaveBeenCalledWith(new Error('API Failure'));
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
