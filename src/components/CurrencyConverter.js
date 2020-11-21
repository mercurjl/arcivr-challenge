import './CurrencyConverter.scss'
import { useState, useEffect } from 'react'

const CurrencyConverter = () => {
  let [currency1, setCurrency1] = useState({
    type: 'USD',
    amount: 1
  })
  let [currency2, setCurrency2] = useState({
    type: 'GBP',
    amount: 1
  })
  let [exrates, setExrates] = useState(null)

  useEffect(() => {
    fetchRates('USD')
      .then(res => {
        setCurrency2({
          type: 'GBP',
          amount: (1 * res.rates.GBP).toFixed(2)
        })
      })
  }, [])

  useEffect(() => {
    console.log("currency1.type")
    if (exrates) {
      fetchRates(currency1.type)
        .then(res => {
          setCurrency2({
            type: currency2.type,
            amount: (1 * res.rates[currency2.type]).toFixed(2)
          })
        })
    }

  }, [currency1.type])

  useEffect(() => {
    console.log("currency2.type")
    if (exrates) {
      fetchRates(currency2.type)
        .then(res => {
          setCurrency1({
            type: currency1.type,
            amount: (1 * res.rates[currency1.type]).toFixed(2)
          })
        })

    }
  }, [currency2.type])

  const fetchRates = (base) => {
    return fetch('https://api.exchangeratesapi.io/latest?base=' + base)
      .then(res => res.json())
      .then(res => {
        setExrates(res)
        return res
      })
  }

  return (
    <div className="currency-converter-wrapper">
      <h1>Currency Converter</h1>
      {exrates ? <>
        <div className="input-wrapper">
          <div>
            <select onChange={e => setCurrency1({ type: e.target.value, amount: 1 })} name="currency1-type" value={currency1.type}>
              {Object.keys(exrates.rates).map((key, i) => {
                return (
                  <option key={i} value={key}>{key}</option>
                )
              })}
            </select>
            <input name="currency1" onChange={e => {
              setCurrency1({ type: currency1.type, amount: e.target.value })
              setCurrency2(
                {
                  type: currency2.type,
                  amount: (e.target.value * exrates.rates[currency2.type]).toFixed(2)
                }
              )
            }}
              value={currency1.amount} type="text" />
          </div>
          <div>
            <select onChange={e => setCurrency2({ type: e.target.value, amount: 1 })} name="currency2-type" value={currency2.type}>
              {Object.keys(exrates.rates).map((key, i) => {
                return (
                  <option key={i} value={key}>{key}</option>
                )
              })}
            </select>
            <input name="currency2" onChange={e => {
              setCurrency2({ type: currency2.type, amount: e.target.value })
              setCurrency1(
                {
                  type: currency1.type,
                  amount: (e.target.value *  (1 / exrates.rates[currency2.type])).toFixed(2)
                }
              )
            }} value={currency2.amount} value={currency2.amount} type="text" />

          </div>
        </div>
        <div className="footer">
          as of {exrates.date}
        </div>
      </> : <div>Getting exchange rates...</div>}

    </div>
  )
}

export default CurrencyConverter