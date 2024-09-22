// src/components/ExchangeRateDisplay.js
import React from 'react';
import CountryFlag from 'react-country-flag';
import currencyCountries from "country-to-currency";

const ExchangeRateDisplay = ({ data, currencySymbols }) => {
  if (!data || !data.rates) return null;

  const targetCurrency = Object.keys(data.rates)[0];
  const exchangeResult = data.rates[targetCurrency];

  if (!exchangeResult) return null;

  return (
    <div className="mt-6 p-4 bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-white mb-2">📈 Exchange Rate</h2>
      <div className="flex items-center space-x-2">
        {currencyCountries[data.base] && (
          <CountryFlag
            countryCode={currencyCountries[data.base]}
            svg
            style={{ width: '2em', height: '2em' }}
            title={data.base}
          />
        )}
        <span className="text-lg text-white">
          {currencySymbols[data.base] || data.base} {data.amount}
        </span>
        <span className="text-lg text-white">=</span>
        {currencyCountries[targetCurrency] && (
          <CountryFlag
            countryCode={currencyCountries[targetCurrency]}
            svg
            style={{ width: '2em', height: '2em' }}
            title={targetCurrency}
          />
        )}
        <span className="text-lg text-white">
          {currencySymbols[targetCurrency] || targetCurrency} {exchangeResult.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default ExchangeRateDisplay;
