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
  if (details.incomeType === 'Monthly') {
    annualIncome = income * 12;
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

  return {
    totalHours: totalHours.toFixed(1),
    days,
    remainingHours: remainingHours.toFixed(1),
  };
};
