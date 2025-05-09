import React from 'react';
import { useCalculator } from '@contexts/CalculatorContext';

const CalculationMethod: React.FC = () => {
  const { formData, setCalculationMethod } = useCalculator();

  return (
    <div className="flex space-x-2">
      <button
        type="button"
        onClick={() => setCalculationMethod('hireDate')}
        className={`px-4 py-2 text-sm border rounded-md transition-colors ${
          formData.calculationMethod === 'hireDate'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        입사일
      </button>
      <button
        type="button"
        onClick={() => setCalculationMethod('fiscalYear')}
        className={`px-4 py-2 text-sm border rounded-md transition-colors ${
          formData.calculationMethod === 'fiscalYear'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
        }`}
      >
        회계연도
      </button>
    </div>
  );
};

export default CalculationMethod;
