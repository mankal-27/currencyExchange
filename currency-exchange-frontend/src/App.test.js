// src/App.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom/extend-expect';

// Mock data
const mockCurrencies = {
  USD: 'United States Dollar',
  EUR: 'Euro',
  INR: 'Indian Rupee',
};

const mockExchangeData = {
  amount: 1,
  base: 'USD',
  date: '2023-10-04',
  rates: {
    INR: 74.0,
  },
};

// Set up Mock Service Worker
const server = setupServer(
  rest.get('https://api.frankfurter.app/currencies', (req, res, ctx) => {
    return res(ctx.json(mockCurrencies));
  }),
  rest.get('https://api.frankfurter.app/latest', (req, res, ctx) => {
    const from = req.url.searchParams.get('from');
    const to = req.url.searchParams.get('to');
    const amount = req.url.searchParams.get('amount');
    
    if (from === 'USD' && to === 'INR' && amount === '1') {
      return res(ctx.json(mockExchangeData));
    }
    
    return res(ctx.status(400), ctx.json({ message: 'Invalid parameters' }));
  })
);

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that are declared as a part of our tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

describe('App Component', () => {
  test('renders Currency Exchange title', async () => {
    render(<App />);
    expect(screen.getByText('💱 Currency Exchange')).toBeInTheDocument();
  });

  test('fetches and displays currencies in selectors', async () => {
    render(<App />);

    // Wait for currencies to be fetched and rendered
    await waitFor(() => {
      expect(screen.getAllByText(/USD - United States Dollar/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/EUR - Euro/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/INR - Indian Rupee/i)[0]).toBeInTheDocument();
    });
  });

  test('performs currency exchange and displays result', async () => {
    render(<App />);

    // Select "USD - United States Dollar" in "From" selector
    const fromSelector = screen.getAllByText('USD - United States Dollar')[0];
    fireEvent.click(fromSelector);

    // Select "INR - Indian Rupee" in "To" selector
    const toSelector = screen.getAllByText('INR - Indian Rupee')[0];
    fireEvent.click(toSelector);

    // Enter amount
    const amountInput = screen.getByPlaceholderText('Amount');
    fireEvent.change(amountInput, { target: { value: '1' } });

    // Click Exchange button
    const exchangeButton = screen.getByText('Exchange');
    fireEvent.click(exchangeButton);

    // Wait for exchange result to be displayed
    await waitFor(() => {
      expect(screen.getByText('💱 Exchange Rate')).toBeInTheDocument();
      expect(screen.getByText('1 USD')).toBeInTheDocument();
      expect(screen.getByText('=').closest('p')).toHaveTextContent('= ₹ 74.00 INR');
    });
  });

  test('handles API failure gracefully', async () => {
    // Override the /latest endpoint to return an error
    server.use(
      rest.get('https://api.frankfurter.app/latest', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<App />);

    // Select "USD - United States Dollar" in "From" selector
    const fromSelector = screen.getAllByText('USD - United States Dollar')[0];
    fireEvent.click(fromSelector);

    // Select "INR - Indian Rupee" in "To" selector
    const toSelector = screen.getAllByText('INR - Indian Rupee')[0];
    fireEvent.click(toSelector);

    // Enter amount
    const amountInput = screen.getByPlaceholderText('Amount');
    fireEvent.change(amountInput, { target: { value: '1' } });

    // Click Exchange button
    const exchangeButton = screen.getByText('Exchange');
    fireEvent.click(exchangeButton);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch exchange rate.')).toBeInTheDocument();
    });
  });
});
