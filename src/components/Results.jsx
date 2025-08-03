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
          <div className="stat-card">
            <div className="stat-number">
              <CountUpNumber>{timeCost.minutes}</CountUpNumber>
            </div>
            <div className="stat-label">Minutes</div>
          </div>
        ) : (
          <>
            {timeCost.days > 0 && (
              <div className="stat-card">
                <div className="stat-number">
                  <CountUpNumber>{timeCost.days}</CountUpNumber>
                </div>
                <div className="stat-label">Work {timeCost.days === 1 ? 'Day' : 'Days'}</div>
              </div>
            )}
            <div className="stat-card">
              <div className="stat-number">
                <CountUpNumber>{
                  timeCost.days > 0 ? timeCost.remainingHours : timeCost.totalHours
                }</CountUpNumber>
              </div>
              <div className="stat-label">Hours</div>
            </div>
          </>
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
            placeholder="e.g., New Gaming PC"
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
