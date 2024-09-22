// src/App.js
import React, { useEffect, useState } from "react";
import CurrencySelector from "./components/CurrencySelector";
import ExchangeRateDisplay from "./components/ExchangeRateDisplay";
import { fetchCurrencies, fetchExchangeRate } from "./services/api";
import getSymbolFromCurrency from "currency-symbol-map";
import { ClipLoader } from "react-spinners";

import "./App.css";

function App() {
  const [currencies, setCurrencies] = useState({});
  const [fromCurrency, setFromCurrency] = useState(null);
  const [toCurrency, setToCurrency] = useState(null);
  const [amount, setAmount] = useState(1);
  const [exchangeData, setExchangeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const data = await fetchCurrencies();
        setCurrencies(data);
      } catch (err) {
        setError("Failed to fetch currencies.");
      }
    };
    getCurrencies();
  }, []);

  const handleExchange = async () => {
    if (!fromCurrency || !toCurrency) {
      setError("Please select both currencies.");
      return;
    }
    if (fromCurrency.value === toCurrency.value) {
      setError("Please select different currencies.");
      return;
    }
    if (amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExchangeRate(
        fromCurrency.value,
        toCurrency.value,
        amount
      );
      console.log("Exchange Rate Data:", data); // Debug log
      setExchangeData(data);
    } catch (err) {
      console.error("Error fetching exchange rate:", err); // Debug log
      setError("Failed to fetch exchange rate.");
    }
    setLoading(false);
  };

  // Prepare options for react-select
  const currencyOptions = Object.entries(currencies).map(([code, name]) => ({
    value: code,
    label: `${code} - ${name}`,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          💱 Currency Exchange
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <CurrencySelector
              options={currencyOptions}
              onChange={setFromCurrency}
              placeholder="From"
            />
            <CurrencySelector
              options={currencyOptions}
              onChange={setToCurrency}
              placeholder="To"
            />
          </div>
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Amount"
            />
          </div>
          <button
            onClick={handleExchange}
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold flex items-center justify-center ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            } transition duration-200`}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : "Exchange"}
          </button>
        </div>
        <ExchangeRateDisplay
          data={exchangeData}
          currencySymbols={getSymbolFromCurrency}
        />
      </div>
    </div>
  );
}

export default App;
