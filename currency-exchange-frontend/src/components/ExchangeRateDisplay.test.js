// src/components/ExchangeRateDisplay.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import ExchangeRateDisplay from './ExchangeRateDisplay';
import '@testing-library/jest-dom/extend-expect';

const mockExchangeData = {
  amount: 1,
  base: 'USD',
  date: '2023-10-04',
  rates: {
    INR: 74.0,
  },
};

const mockCurrencySymbols = {
  USD: '$',
  INR: '₹',
};

describe('ExchangeRateDisplay Component', () => {
  test('renders exchange rate information', () => {
    render(<ExchangeRateDisplay data={mockExchangeData} currencySymbols={mockCurrencySymbols} />);
    
    expect(screen.getByText('💱 Exchange Rate')).toBeInTheDocument();
    expect(screen.getByText('1 USD')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
    expect(screen.getByText('₹ 74.00 INR')).toBeInTheDocument();
  });

  test('does not render when no data is provided', () => {
    const { container } = render(<ExchangeRateDisplay data={null} currencySymbols={mockCurrencySymbols} />);
    expect(container).toBeEmptyDOMElement();
  });
});
