import { describe, it, expect } from 'vitest';
import { calculateHourlyRate, calculateTimeCost } from './calculations';

describe('calculateHourlyRate', () => {
  it('should return the correct hourly rate for annual income', () => {
    const details = { income: 52000, incomeType: 'Annual', hoursPerWeek: 40 };
    expect(calculateHourlyRate(details)).toBe(25);
  });

  it('should return the correct hourly rate for monthly income', () => {
    // (10870 * 12) / (40 * 52) = 130440 / 2080 = 62.71
    const details = { income: 10870, incomeType: 'Monthly', hoursPerWeek: 40 };
    expect(calculateHourlyRate(details)).toBeCloseTo(62.71, 2);
  });

  it('should return the income directly if incomeType is Hourly', () => {
    const details = { income: 30, incomeType: 'Hourly', hoursPerWeek: 40 };
    expect(calculateHourlyRate(details)).toBe(30);
  });

  it('should return 0 if income is not provided', () => {
    const details = { income: 0, incomeType: 'Annual', hoursPerWeek: 40 };
    expect(calculateHourlyRate(details)).toBe(0);
  });

  it('should return 0 if hoursPerWeek is not provided', () => {
    const details = { income: 52000, incomeType: 'Annual', hoursPerWeek: 0 };
    expect(calculateHourlyRate(details)).toBe(0);
  });
});

describe('calculateTimeCost', () => {
  it('should correctly calculate the time cost', () => {
    // $1000 item / $50/hr = 20 hours. 20 hours / 8hr/day = 2 days, 4 hours
    const result = calculateTimeCost(1000, 50, 8);
    expect(result.days).toBe(2);
    expect(parseFloat(result.remainingHours)).toBe(4);
    expect(parseFloat(result.totalHours)).toBe(20);
  });

  it('should return null for invalid or zero inputs', () => {
    expect(calculateTimeCost(0, 50, 8)).toBeNull();
    expect(calculateTimeCost(1000, 0, 8)).toBeNull();
    expect(calculateTimeCost(1000, 50, 0)).not.toBeNull(); // Should default to 8
  });

  it('should correctly calculate a complex scenario', () => {
    // $130,000 salary @ 38hr/week = $65.83/hr
    const details = { income: 130000, incomeType: 'Annual', hoursPerWeek: 38 };
    const hourlyRate = calculateHourlyRate(details);
    expect(hourlyRate).toBeCloseTo(65.79, 2);

    // $2200 item / $65.83/hr = 33.4 hours
    // 33.4 hours / 8hr/day = 4 days and 1.4 hours
    const result = calculateTimeCost(2200, hourlyRate, 8);
    expect(result.days).toBe(4);
    expect(parseFloat(result.remainingHours)).toBeCloseTo(1.4, 1);
    expect(parseFloat(result.totalHours)).toBeCloseTo(33.4, 1);
  });
});
