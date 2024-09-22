// src/components/CurrencySelector.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CurrencySelector from './CurrencySelector';
import '@testing-library/jest-dom/extend-expect';

const mockOptions = [
  { value: 'USD', label: 'USD - United States Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
];

describe('CurrencySelector Component', () => {
  test('renders placeholder text', () => {
    render(<CurrencySelector options={mockOptions} onChange={() => {}} placeholder="Select Currency" />);
    expect(screen.getByText('Select Currency')).toBeInTheDocument();
  });

  test('renders all options', async () => {
    render(<CurrencySelector options={mockOptions} onChange={() => {}} placeholder="Select Currency" />);
    
    // Open the dropdown
    const selector = screen.getByText('Select Currency');
    fireEvent.click(selector);

    // Check for options
    expect(await screen.findByText('USD - United States Dollar')).toBeInTheDocument();
    expect(await screen.findByText('EUR - Euro')).toBeInTheDocument();
  });

  test('calls onChange when an option is selected', async () => {
    const handleChange = jest.fn();
    render(<CurrencySelector options={mockOptions} onChange={handleChange} placeholder="Select Currency" />);

    // Open the dropdown
    const selector = screen.getByText('Select Currency');
    fireEvent.click(selector);

    // Select an option
    const option = await screen.findByText('USD - United States Dollar');
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith(mockOptions[0]);
  });
});
