import React, { useState, useEffect } from 'react';

const Calculator = ({ itemCost, setItemCost, onCalculate, onReset, error }) => {
  const [displayCost, setDisplayCost] = useState('');

  useEffect(() => {
    if (itemCost) {
      setDisplayCost(new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(itemCost));
    } else {
      setDisplayCost('');
    }
  }, [itemCost]);

  const handleCostChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d.]/g, '');
    const numericValue = rawValue ? parseFloat(rawValue) : '';

    setItemCost(numericValue);

    if (rawValue.endsWith('.')) {
        setDisplayCost('$' + rawValue);
    } else if (numericValue) {
        const [integerPart, decimalPart] = rawValue.split('.');
        let formatted = '$' + new Intl.NumberFormat('en-US').format(integerPart);
        if (decimalPart !== undefined) {
            formatted += '.' + decimalPart;
        }
        setDisplayCost(formatted);
    } else {
        setDisplayCost('');
    }
  };

  const handleBlur = () => {
    if (itemCost) {
      setDisplayCost(new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(itemCost));
    }
  };
  return (
    <div className="card">

      <div className="form-group">
        <label htmlFor="itemCost">Purchase Price</label>
        <input
          type="text"
          id="itemCost"
          value={displayCost}
          onChange={handleCostChange}
          onBlur={handleBlur}
          placeholder="e.g., $1,500"
          className={error ? 'input-error' : ''}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="button-group">
        <button onClick={onCalculate} className="btn btn-primary btn-full">
          Calculate
        </button>
      </div>
    </div>
  );
};

export default Calculator;
