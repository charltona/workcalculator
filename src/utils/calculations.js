export const calculateHourlyRate = (details) => {
  if (!details || !details.income || !details.hoursPerWeek || details.income <= 0 || details.hoursPerWeek <= 0) {
    return 0;
  }

  const income = parseFloat(details.income) || 0;
  const hoursPerWeek = parseFloat(details.hoursPerWeek) || 0;

  if (details.incomeType === 'Hourly') {
    return income;
  }

  let annualIncome = income;
  switch (details.incomeType) {
    case 'Monthly':
      annualIncome = income * 12;
      break;
    case 'Fortnightly':
      annualIncome = income * 26; // 52 weeks / 2
      break;
    case 'Weekly':
      annualIncome = income * 52;
      break;
    // 'Annual' is already the default
  }

  const annualHours = hoursPerWeek * 52;

  if (annualHours === 0) return 0;

  const hourlyRate = annualIncome / annualHours;
  return hourlyRate;
};

export const calculateTimeCost = (itemCost, hourlyRate, hoursPerDay) => {
  if (!itemCost || !hourlyRate || itemCost <= 0 || hourlyRate <= 0) {
    return null;
  }

  const totalHours = parseFloat(itemCost) / hourlyRate;
  const workdayLength = parseFloat(hoursPerDay) || 8; // Default to 8 if not set
  const days = Math.floor(totalHours / workdayLength);
  const remainingHours = totalHours % workdayLength;
  
  // If total hours is less than or equal to 1.0 and there are no work days, show minutes
  if (totalHours <= 1.0 && days === 0) {
    const minutes = Math.round(totalHours * 60);
    return {
      totalHours: parseFloat(totalHours.toFixed(1)),
      minutes,
      showMinutes: true,
      days: 0
    };
  }

  return {
    totalHours: parseFloat(totalHours.toFixed(1)),
    days,
    remainingHours: parseFloat(remainingHours.toFixed(1)),
    showMinutes: false
  };
};
