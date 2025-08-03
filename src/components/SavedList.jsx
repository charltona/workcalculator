import React, { useState, useEffect, useRef } from 'react';

const SavedList = ({ items, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const listRef = useRef(null);
  const wasEmpty = useRef(items.length === 0);
  const prevItemsLength = useRef(items.length);

  const formatTime = (timeCost, hourlyRate) => {
    if (!timeCost) return '';
    const { days, remainingHours, showMinutes, minutes } = timeCost;
    let timeString = '';
    
    if (showMinutes && minutes !== undefined) {
      timeString = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (days > 0) {
      const dayString = days === 1 ? 'work day' : 'work days';
      timeString = `${days} ${dayString}${remainingHours > 0 ? `, ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}` : ''}`;
    } else if (remainingHours !== undefined) {
      timeString = `${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    }
    
    // Add hourly rate if available
    if (hourlyRate) {
      return `${timeString} @ $${hourlyRate} p/hr`;
    }
    return timeString;
  };

  // Auto-expand when a new item is added
  useEffect(() => {
    if (items.length > prevItemsLength.current) {
      setIsExpanded(true);
      // Scroll to the newly added item after a short delay to allow for the expansion animation
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.lastElementChild?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
    prevItemsLength.current = items.length;
  }, [items.length]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Always render the card, but show empty state when no items
  return (
    <div className="saved-insights-card">
      <div 
        className="saved-insights-header" 
        onClick={toggleExpand}
        aria-expanded={isExpanded}
        aria-controls="saved-insights-list"
      >
        <span>Saved Insights</span>
        <svg 
          className={`chevron ${isExpanded ? 'expanded' : ''}`} 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      <div 
        id="saved-insights-list"
        className={`saved-insights-content ${isExpanded ? 'expanded' : ''}`}
        ref={listRef}
      >
        {items.length === 0 ? (
          <div className="empty-state">No saved insights</div>
        ) : (
          <ul className="saved-items-list">
            {items.map(item => (
              <li key={item.id} className="saved-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-details">
                    ${item.price} • {formatTime(item.timeCost, item.hourlyRate)}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }} 
                  className="btn-text"
                  aria-label={`Delete ${item.name}`}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SavedList;
