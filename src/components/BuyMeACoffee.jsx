import React from 'react';

const BuyMeACoffee = ({ hourlyRate }) => {
  // Assuming an average coffee costs $5
  const COFFEE_PRICE = 5;
  
  // Calculate minutes to earn the price of a coffee
  const minutesToBuyCoffee = hourlyRate > 0 
    ? Math.ceil((COFFEE_PRICE / hourlyRate) * 60)
    : null;

  return (
    <div className="buy-me-coffee">
      <a 
        href="https://buymeacoffee.com/aaronc.au" 
        target="_blank" 
        rel="noopener noreferrer"
        className="coffee-link"
      >
        {hourlyRate > 0 ? (
          `☕ It would take you ${minutesToBuyCoffee} minute${minutesToBuyCoffee !== 1 ? 's' : ''} to buy me a coffee`
        ) : (
          '☕ Buy Me A Coffee'
        )}
      </a>
    </div>
  );
};

export default BuyMeACoffee;
