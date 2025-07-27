import React, { useState, useEffect } from 'react';

const CountUpNumber = ({ children, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  const end = parseFloat(children) || 0;

  useEffect(() => {
    let start = 0;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const current = start + (end - start) * progress;
      
      const decimalPlaces = (end.toString().split('.')[1] || '').length;
      setCount(parseFloat(current.toFixed(decimalPlaces)));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure it ends on the exact number
      }
    };

    requestAnimationFrame(animate);

  }, [end, duration]);

  return <span>{count}</span>;
};

export default CountUpNumber;
