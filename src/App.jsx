import React, { useState, useEffect } from 'react';
import IncomeForm from './components/IncomeForm';
import Calculator from './components/Calculator';
import Results from './components/Results';
import SavedList from './components/SavedList';
import IncomeSummary from './components/IncomeSummary';
import ThemeToggle from './components/ThemeToggle';
import BuyMeACoffee from './components/BuyMeACoffee';
import { calculateHourlyRate, calculateTimeCost } from './utils/calculations';

function App() {
  // State for user inputs
  const [incomeDetails, setIncomeDetails] = useState({
    income: '',
    incomeType: 'Annual', // 'Annual', 'Monthly', 'Hourly'
    hoursPerWeek: '',
    hoursPerDay: '',
  });

  const [itemCost, setItemCost] = useState('');
  const [itemName, setItemName] = useState('');

  // State for results and saved items
  const [timeCost, setTimeCost] = useState(null);
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(true);
  const [savedCalculations, setSavedCalculations] = useState([]);
  const [errors, setErrors] = useState({});
  const [hourlyRate, setHourlyRate] = useState(null);
  const [calculatedItemCost, setCalculatedItemCost] = useState(null);

  // Calculate hourly rate automatically when income details change
  useEffect(() => {
    const rate = calculateHourlyRate(incomeDetails);
    setHourlyRate(rate);
  }, [incomeDetails]);

  // State for 'Remember Me'
  const [rememberMe, setRememberMe] = useState(false);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedIncome = localStorage.getItem('work-calculator_income');
    if (savedIncome) {
      const parsed = JSON.parse(savedIncome);
      setIncomeDetails(parsed);
      setRememberMe(true);
    }

    const savedItems = localStorage.getItem('work-calculator-saved-items');
    if (savedItems) {
      setSavedCalculations(JSON.parse(savedItems));
    }
  }, []);

  // Handle 'Remember Me' and save/clear data from localStorage
  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('work-calculator_income', JSON.stringify(incomeDetails));
    } else {
      localStorage.removeItem('work-calculator_income');
    }
  }, [incomeDetails, rememberMe]);
  
  // Save calculations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('work-calculator-saved-items', JSON.stringify(savedCalculations));
  }, [savedCalculations]);


  const validateInputs = () => {
    const newErrors = {};
    const { income, hoursPerWeek, hoursPerDay } = incomeDetails;
    const hoursPerWeekNum = parseFloat(hoursPerWeek);
    const hoursPerDayNum = parseFloat(hoursPerDay);

    if (!income || parseFloat(income) <= 0) {
      newErrors.income = 'Please enter a valid income.';
    }
    
    // Validate hours per week
    if (!hoursPerWeek || isNaN(hoursPerWeekNum) || hoursPerWeekNum <= 0) {
      newErrors.hoursPerWeek = 'Hours per week must be greater than 0.';
    } else if (hoursPerWeekNum > 168) {
      newErrors.hoursPerWeek = 'Hours per week cannot exceed 168 (24 hours × 7 days).';
    }

    // Validate hours per day
    if (!hoursPerDay || isNaN(hoursPerDayNum) || hoursPerDayNum <= 0) {
      newErrors.hoursPerDay = 'Hours per day must be greater than 0.';
    } else if (hoursPerDayNum > 24) {
      newErrors.hoursPerDay = 'Hours per day cannot exceed 24.';
    }

    // Validate relationship between hours per day and hours per week
    if (hoursPerDayNum && hoursPerWeekNum) {
      if (hoursPerWeekNum < hoursPerDayNum) {
        newErrors.hoursPerWeek = 'Hours per week cannot be less than hours per day.';
        newErrors.hoursPerDay = 'Hours per day cannot be more than hours per week.';
      } else if (hoursPerWeekNum > (hoursPerDayNum * 7)) {
        newErrors.hoursPerWeek = 'Hours per week cannot be more than hours per day × 7.';
        newErrors.hoursPerDay = 'Hours per day × 7 must be at least equal to hours per week.';
      }
    }

    if (!itemCost || parseFloat(itemCost) <= 0) {
      newErrors.itemCost = 'Please enter a valid item cost.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculation = () => {
    if (!validateInputs()) {
      setTimeCost(null);
      return;
    }

    const cost = calculateTimeCost(itemCost, hourlyRate, incomeDetails.hoursPerDay);
    setTimeCost(cost);
    setCalculatedItemCost(itemCost);
    if (cost) {
      setIsIncomeFormOpen(false);
    }
  };

  const handleSaveCalculation = () => {
    if (!timeCost || !itemName) {
        alert("Please provide an item name to save the calculation.");
        return;
    }
    const newCalculation = {
        id: Date.now(),
        name: itemName,
        price: parseFloat(itemCost).toFixed(2),
        timeCost: timeCost,
        hourlyRate: parseFloat(hourlyRate).toFixed(2) // Save the hourly rate with 2 decimal places
    };
    setSavedCalculations(prev => [...prev, newCalculation]);
    setItemName(''); // Reset item name after saving
  };

  const handleDeleteCalculation = (id) => {
    setSavedCalculations(prev => prev.filter(item => item.id !== id));
  };
  
  const handleReset = () => {
      setIncomeDetails({ income: '', incomeType: 'Annual', hoursPerWeek: '', hoursPerDay: '' });
      setItemCost('');
      setItemName('');
      setTimeCost(null);
      setHourlyRate(null);
      setCalculatedItemCost(null);
      setRememberMe(false); // Also reset the remember me checkbox
      setIsIncomeFormOpen(true);
  };

  return (
    <div className="container">
      <header>
        <div className="header-content">
          <div>
            <h1>Work To Buy</h1>
            <p>Calculate the real cost of your purchases in work time</p>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main>
        {isIncomeFormOpen ? (
        <IncomeForm
          details={incomeDetails}
          setDetails={setIncomeDetails}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          errors={errors}
          hourlyRate={hourlyRate}
          onReset={handleReset}
        />
      ) : (
        <IncomeSummary 
          details={incomeDetails}
          onEdit={() => setIsIncomeFormOpen(true)}
        />
      )}
        <Calculator
          itemCost={itemCost}
          setItemCost={setItemCost}
          onCalculate={handleCalculation}
          onReset={handleReset}
          error={errors.itemCost}
        />
        {timeCost && (
            <Results
                timeCost={timeCost}
                itemName={itemName}
                setItemName={setItemName}
                onSave={handleSaveCalculation}
                hourlyRate={hourlyRate}
                itemCost={calculatedItemCost}
            />
        )}
        <SavedList
          items={savedCalculations}
          onDelete={handleDeleteCalculation}
        />
      </main>
      <footer>
        <p>Income & purchase data is stored locally in your browser, not sent to a server.</p>
        <p></p>
        <BuyMeACoffee hourlyRate={hourlyRate} />
      </footer>
    </div>
  );
}

export default App;
