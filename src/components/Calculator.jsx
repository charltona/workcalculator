import React, { useState, useEffect } from 'react';

const Calculator = ({ itemCost, setItemCost, onCalculate, onReset, error }) => {
  const [displayCost, setDisplayCost] = useState('');

  const handleCostChange = (e) => {
    let rawValue = e.target.value.replace(/[^\d.]/g, '');
    
    // Handle multiple decimal points by only keeping the first one
    const decimalCount = (rawValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      const parts = rawValue.split('.');
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // If there's a decimal, limit to 2 decimal places
    if (rawValue.includes('.')) {
      const [integerPart, decimalPart] = rawValue.split('.');
      if (decimalPart && decimalPart.length > 2) {
        rawValue = integerPart + '.' + decimalPart.substring(0, 2);
      }
    }

    const numericValue = rawValue ? parseFloat(rawValue) : '';
    setItemCost(numericValue);

    if (rawValue === '') {
      setDisplayCost('');
    } else if (rawValue.endsWith('.')) {
      setDisplayCost('$' + rawValue);
    } else if (numericValue) {
      const [integerPart, decimalPart] = rawValue.split('.');
      let formatted = '$' + new Intl.NumberFormat('en-US').format(parseInt(integerPart || '0', 10));
      if (decimalPart !== undefined) {
        formatted += '.' + decimalPart.padEnd(2, '0').substring(0, 2);
      }
      setDisplayCost(formatted);
    }
  };

  const handleBlur = () => {
    if (itemCost || itemCost === 0) {
      // Format with 2 decimal places when input loses focus
      const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(itemCost);
      
      setDisplayCost(formattedValue);
      
      // Update the numeric value to ensure it has exactly 2 decimal places
      const numericValue = parseFloat(itemCost).toFixed(2);
      setItemCost(parseFloat(numericValue));
    } else {
      setDisplayCost('');
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
