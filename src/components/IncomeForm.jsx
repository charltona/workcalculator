import React, { useState, useEffect } from 'react';

const IncomeForm = ({ details, setDetails, rememberMe, setRememberMe, errors, hourlyRate, onReset }) => {
  const [displayIncome, setDisplayIncome] = useState('');
  const [showCalculation, setShowCalculation] = useState(false);

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
      <div className="form-group">
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
        <select 
          id="incomeType" 
          name="incomeType" 
          value={details.incomeType} 
          onChange={handleChange}
          className="full-width"
        >
          <option value="Annual">Annual</option>
          <option value="Monthly">Monthly</option>
          <option value="Fortnightly">Fortnightly</option>
          <option value="Weekly">Weekly</option>
          <option value="Hourly">Hourly</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="hoursPerWeek">Hours worked per week</label>
        <input
          type="number"
          id="hoursPerWeek"
          value={details.hoursPerWeek}
          onChange={(e) => setDetails(prev => ({ ...prev, hoursPerWeek: e.target.value }))}
          placeholder="e.g., 40"
          className={`${errors.hoursPerWeek ? 'input-error' : ''} full-width`}
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
          className={`${errors.hoursPerDay ? 'input-error' : ''} full-width`}
        />
        {errors.hoursPerDay && <p className="error-message">{errors.hoursPerDay}</p>}
      </div>

      <div className="remember-me-checkbox">
        <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
        <label htmlFor="rememberMe">Remember my details</label>
      </div>

      {/* Error Message Box */}
      {Object.keys(errors).length > 0 && (
        <div className="error-message-box">
          <div className="error-message-header">Please fix the following issues:</div>
          <ul className="error-message-list">
            {Object.entries(errors).map(([field, message]) => (
              <li key={field}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {hourlyRate > 0 && (
        <div className="hourly-rate-container">
          <div className="hourly-rate-display">
            <div className="hourly-rate-summary">
              <div>Your effective hourly rate is: <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(hourlyRate)}</strong></div>
              <div className="button-row" style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  className="btn-text" 
                  onClick={() => setShowCalculation(!showCalculation)}
                  style={{ fontSize: '0.85rem' }}
                >
                  {showCalculation ? 'Hide' : 'Show'} Calculation
                </button>
                <button 
                  onClick={onReset} 
                  className="btn-text"
                  type="button"
                  style={{ fontSize: '0.85rem' }}
                >
                  Reset
                </button>
              </div>
            </div>
            {showCalculation && (
              <div className="hourly-rate-calculation">
                {details.incomeType === 'Hourly' ? (
                  <div className="calculation-equation">
                    <div className="calculation-row">
                      <span className="calculation-label">Your hourly rate is simply your input rate:</span>
                      <span className="calculation-value">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(hourlyRate)}/hr
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="calculation-equation">
                    <div className="calculation-row">
                      <span className="calculation-label">Calculation:</span>
                      <span className="calculation-value">
                        {details.incomeType === 'Annual' ? '' : (
                          <>
                            {details.incomeType === 'Monthly' ? (
                              <>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(details.income)} × 12 months = {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(details.income * 12)}</>
                            ) : details.incomeType === 'Fortnightly' ? (
                              <>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(details.income)} × 26 fortnights = {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(details.income * 26)}</>
                            ) : (
                              <>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(details.income)} × 52 weeks = {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(details.income * 52)}</>
                            )}
                            <br />
                          </>
                        )}
                        {details.incomeType !== 'Annual' ? (
                          <>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(
                            details.incomeType === 'Monthly' ? details.income * 12 :
                            details.incomeType === 'Fortnightly' ? details.income * 26 :
                            details.income * 52
                          )} ÷ ({details.hoursPerWeek} hours/week × 52 weeks) = </>
                        ) : (
                          <>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(details.income)} ÷ ({details.hoursPerWeek} × 52) = </>
                        )}
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(hourlyRate)}/hr
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeForm;
