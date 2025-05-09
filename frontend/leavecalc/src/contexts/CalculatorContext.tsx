import React, { createContext, useContext, useState } from 'react';
import { CalculationMethod, CalculatorFormData } from '@interfaces/calculator';

interface CalculatorContextProps {
  formData: CalculatorFormData;
  setCalculationMethod: (method: CalculationMethod) => void;
  setHireDate: (date: Date | null) => void;
  setFiscalYearDate: (date: Date | null) => void;
  setReferenceDate: (date: Date | null) => void;
  toggleSpecialPeriod: () => void;
  toggleHolidays: () => void;
  calculateVacation: () => void;
}

const initialFormData: CalculatorFormData = {
  calculationMethod: null,
  hireDate: null,
  fiscalYearDate: null,
  referenceDate: null,
  hasSpecialPeriod: false,
  includeHolidays: false,
};

const CalculatorContext = createContext<CalculatorContextProps | undefined>(undefined);

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}

export default function CalculatorProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [formData, setFormData] = useState<CalculatorFormData>(initialFormData);

  const setCalculationMethod = (method: CalculationMethod) => {
    setFormData((prev) => ({ ...prev, calculationMethod: method }));
  };

  const setHireDate = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, hireDate: date }));
  };

  const setFiscalYearDate = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, fiscalYearDate: date }));
  };

  const setReferenceDate = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, referenceDate: date }));
  };

  const toggleSpecialPeriod = () => {
    setFormData((prev) => ({ ...prev, hasSpecialPeriod: !prev.hasSpecialPeriod }));
  };

  const toggleHolidays = () => {
    setFormData((prev) => ({ ...prev, includeHolidays: !prev.includeHolidays }));
  };

  const calculateVacation = () => {
    // 연차 계산 로직 구현 (추후 개발)
    console.log('Calculating vacation with data:', formData);
  };

  const value = {
    formData,
    setCalculationMethod,
    setHireDate,
    setFiscalYearDate,
    setReferenceDate,
    toggleSpecialPeriod,
    toggleHolidays,
    calculateVacation,
  };

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}
