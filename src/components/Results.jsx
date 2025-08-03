import React from 'react';
import CountUpNumber from './CountUpNumber';

const Results = ({ timeCost, itemName, setItemName, onSave, hourlyRate, itemCost }) => {
  if (!timeCost) return null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value || 0);
  };

  return (
    <div className="insight-card">
      <h3>You would need to work for</h3>
      <div className="stats-container">
        {timeCost.showMinutes ? (
          <div className="time-value">
            <span className="stat-number">
              <CountUpNumber>{timeCost.minutes}</CountUpNumber>
            </span>
            <span className="stat-label">Minutes</span>
          </div>
        ) : timeCost.days > 0 ? (
          <div className="time-values-container">
            <div className="time-values-row">
              <div className="time-value">
                <span className="stat-number">
                  <CountUpNumber>{timeCost.days}</CountUpNumber>
                </span>
                <span className="stat-label">
                  Work {timeCost.days === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <div className="add-operator">and</div>
              {timeCost.remainingHours < 1 ? (
                <div className="time-value">
                  <span className="stat-number">
                    <CountUpNumber>{Math.round(timeCost.remainingHours * 60)}</CountUpNumber>
                  </span>
                  <span className="stat-label">Minutes</span>
                </div>
              ) : (
                <div className="time-value">
                  <span className="stat-number">
                    <CountUpNumber>{timeCost.remainingHours.toFixed(1)}</CountUpNumber>
                  </span>
                  <span className="stat-label">Hours</span>
                </div>
              )}
            </div>
            {timeCost.days > 0 && (
              <div className="hours-per-day-note">
                Based on {timeCost.hoursPerDay || 8} hours per work day
              </div>
            )}
          </div>
        ) : (
          <div className="time-value">
            <span className="stat-number">
              <CountUpNumber>{timeCost.totalHours.toFixed(1)}</CountUpNumber>
            </span>
            <span className="stat-label">Hours</span>
          </div>
        )}
      </div>

      <div className="calculation-breakdown">
        <h4>Calculation Breakdown</h4>
        <div className="breakdown-item">
          <span>Your Hourly Rate:</span>
          <span>{formatCurrency(hourlyRate)}</span>
        </div>
        <div className="breakdown-item">
          <span>Item Cost:</span>
          <span>{formatCurrency(itemCost)}</span>
        </div>
        <div className="breakdown-item total">
          <span>Total Time Cost:</span>
          <span>
            {timeCost.showMinutes 
              ? `${timeCost.minutes} minutes` 
              : `${timeCost.totalHours} hours`
            }
          </span>
        </div>
      </div>

      <div className="save-insight-section">
        <hr />
        <label htmlFor="insightName">Save this Insight</label>
        <div className="save-input-group">
          <input
            type="text"
            id="insightName"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., Flight to Europe"
          />
          <button onClick={onSave} className="btn-primary">
            {/* SVG for save icon can go here */}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
