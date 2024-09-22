// src/components/CurrencySelector.js
import React from 'react';
import Select from 'react-select';
import CountryFlag from 'react-country-flag';
import countryToCurrency from "country-to-currency";

const CurrencySelector = ({ options, onChange, placeholder }) => {
  const formatOptionLabel = ({ value, label }) => {
    const currencyCode = value;
    const countryCode = countryToCurrency[currencyCode];
    return (
      <div className="flex items-center">
        {countryCode ? (
          <CountryFlag countryCode={countryCode} svg style={{ width: '1.5em', height: '1.5em', marginRight: '0.5em' }} />
        ) : (
          <div className="w-6 h-6 mr-2"></div> // Placeholder for missing flags
        )}
        <span>{label}</span>
      </div>
    );
  };

  return (
    <Select
      options={options}
      onChange={onChange}
      placeholder={placeholder}
      isSearchable
      formatOptionLabel={formatOptionLabel}
      className="w-full"
      classNamePrefix="react-select"
    />
  );
};

export default CurrencySelector;
