import React, { useState, useEffect } from 'react';

const IncomeForm = ({ details, setDetails, rememberMe, setRememberMe, errors, hourlyRate, onReset }) => {
  const [displayIncome, setDisplayIncome] = useState('');

  useEffect(() => {
    // Sync local display state when prop changes (e.g., from localStorage)
    if (details.income) {
      setDisplayIncome(new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(details.income));
    } else {
      setDisplayIncome('');
    }
  }, [details.income]);

  const handleIncomeChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const numericValue = rawValue ? parseInt(rawValue, 10) : '';

    // Update parent state with the clean number
    setDetails(prev => ({ ...prev, income: numericValue }));

    // Update local state with the formatted string for display
    if (numericValue) {
      setDisplayIncome('$' + new Intl.NumberFormat('en-US').format(numericValue));
    } else {
      setDisplayIncome('');
    }
  };

  const handleBlur = () => {
    // On blur, format it nicely as a final step
    if (details.income) {
      setDisplayIncome(new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(details.income));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="card">


      <div className="form-row">
        <div className="form-group flex-grow">
          <label htmlFor="income">Your After-Tax Income</label>
          <input
            type="text"
            inputMode="decimal"
            id="income"
            name="income"
            value={displayIncome}
            onChange={handleIncomeChange}
            onBlur={handleBlur}
            placeholder="e.g., $60,000"
            className={errors.income ? 'input-error' : ''}
          />
          {errors.income && <p className="error-message">{errors.income}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="incomeType">Frequency</label>
          <select id="incomeType" name="incomeType" value={details.incomeType} onChange={handleChange}>
            <option value="Annual">Annual</option>
            <option value="Monthly">Monthly</option>
            <option value="Hourly">Hourly</option>
          </select>
        </div>
      </div>



      <div className="form-row">
        <div className="form-group">
          <label htmlFor="hoursPerWeek">Hours worked per week</label>
          <input
            type="number"
            id="hoursPerWeek"
            value={details.hoursPerWeek}
            onChange={(e) => setDetails(prev => ({ ...prev, hoursPerWeek: e.target.value }))}
            placeholder="e.g., 40"
            className={errors.hoursPerWeek ? 'input-error' : ''}
          />
          {errors.hoursPerWeek && <p className="error-message">{errors.hoursPerWeek}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="hoursPerDay">Hours in a typical work day</label>
          <input
            type="number"
            id="hoursPerDay"
            value={details.hoursPerDay}
            onChange={(e) => setDetails(prev => ({ ...prev, hoursPerDay: e.target.value }))}
            placeholder="e.g., 8"
            className={errors.hoursPerDay ? 'input-error' : ''}
          />
          {errors.hoursPerDay && <p className="error-message">{errors.hoursPerDay}</p>}
        </div>
      </div>

      <div className="form-group-inline">
        <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
        <label htmlFor="rememberMe">Remember my details</label>
      </div>

      {hourlyRate > 0 && (
        <div className="hourly-rate-container">
          <div className="hourly-rate-display">
            Your effective hourly rate is: <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(hourlyRate)}</strong>
          </div>
          <button 
            onClick={onReset} 
            className="btn-text"
            type="button"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default IncomeForm;
