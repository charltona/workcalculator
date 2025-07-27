import React from 'react';

const IncomeSummary = ({ details, onEdit }) => {
  const formattedIncome = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(details.income || 0);

  return (
    <div className="card summary-card">
      <div className="summary-content" style={{ position: 'relative' }}>
        <p style={{ margin: 0, paddingRight: '50px' }}>
          <strong>Your Details:</strong> {formattedIncome} / {details.incomeType} @ {details.hoursPerWeek} hrs/week
        </p>
        <button 
          onClick={onEdit} 
          className="btn-text"
          type="button"
          style={{
            position: 'absolute',
            right: '0',
            top: '50%',
            transform: 'translateY(-50%)',
            margin: 0
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default IncomeSummary;
