import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CurrencyConverter.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [conversionRate, setConversionRate] = useState(null);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const currencyArray = Object.keys(response.data.rates);
        setCurrencies([response.data.base, ...currencyArray]);
      } catch (err) {
        setError("Error fetching currency list");
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        setConversionRate(response.data.rates[toCurrency]);
      } catch (err) {
        setError("Error fetching conversion rate");
      }
    };

    fetchConversionRate();
  }, [fromCurrency, toCurrency]);

  const handleAmountChange = (e) => setAmount(e.target.value);
  const handleFromCurrencyChange = (e) => setFromCurrency(e.target.value);
  const handleToCurrencyChange = (e) => setToCurrency(e.target.value);

  return (
    <div className="currency-converter">
      <h1>Currency Converter</h1>
      <div className="converter-inputs">
        <input type="number" value={amount} onChange={handleAmountChange} />
        <select value={fromCurrency} onChange={handleFromCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <select value={toCurrency} onChange={handleToCurrencyChange}>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
      <div className="conversion-result">
        {conversionRate ? (
          <p>
            {amount} {fromCurrency} = {(amount * conversionRate).toFixed(2)}{" "}
            {toCurrency}
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default CurrencyConverter;
