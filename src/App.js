import React, { useEffect, useState } from 'react'
import './App.css';
import CurrencyRow from './CurrencyRow';

var myHeaders = new Headers();
myHeaders.append("apikey", "xxx");

/*
  This won't work unless you have a api key
  I have taken out the api key as pushing to a public git repository 
  will put back in api key when demoing
*/

var requestOptions = {
  method: 'GET',
  redirect: 'follow',
  headers: myHeaders
};

function App() {

  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  
  let toAmount, fromAmount 
  if(amountInFromCurrency){
    fromAmount = amount
    toAmount = amount*exchangeRate
  }
  else {
    toAmount = amount
    fromAmount = amount / exchangeRate
  }
  
  useEffect(() => {
    fetch("https://api.apilayer.com/exchangerates_data/latest?symbols=gbp%2Ccad%2Cusd%2Ctry&base=eur", requestOptions)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      const firstCurrency = Object.keys(data.rates)[0];
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
    })
    .catch(error => console.log('error', error));
  }, []);

  useEffect(() => {
    if(fromCurrency != null && toCurrency != null){
    fetch(`https://api.apilayer.com/exchangerates_data/latest?symbols=${toCurrency}&base=${fromCurrency}`, requestOptions)
    .then(res => res.json())
    .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }


  return (
    <>
      <h1>converter</h1>
      <CurrencyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency = {fromCurrency}
        onChangeCurrency = {e => setFromCurrency(e.target.value)}
        onChangeAmount = {handleFromAmountChange}
        amount={fromAmount}
      />
      <div className='equals'>=</div>
      <CurrencyRow 
        currencyOptions = {currencyOptions}
        selectedCurrency = {toCurrency}
        onChangeCurrency = {e => setToCurrency(e.target.value)}
        onChangeAmount = {handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
