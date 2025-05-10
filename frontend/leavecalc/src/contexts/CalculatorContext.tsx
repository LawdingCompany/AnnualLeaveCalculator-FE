import React, { createContext, useContext, useState, useCallback } from 'react';
import { CalculationMethod, CalculatorFormData } from '@interfaces/calculator';

// 특이사항 및 휴일 인터페이스 추가
export interface SpecialPeriod {
  id: string;
  startDate: Date | null;
  endDate: Date | null;
  type: string;
}

export interface Holiday {
  id: string;
  date: Date | null;
  description?: string;
}

// 기존 CalculatorFormData 확장 (필요시 interfaces/calculator.ts 파일도 업데이트 필요)
interface ExtendedCalculatorFormData extends CalculatorFormData {
  specialPeriods: SpecialPeriod[];
  holidays: Holiday[];
  result?: number | null; // result를 선택적(optional) 속성으로 변경
}

interface CalculatorContextProps {
  formData: ExtendedCalculatorFormData;
  setCalculationMethod: (method: CalculationMethod) => void;
  setHireDate: (date: Date | null) => void;
  setFiscalYearDate: (date: Date | null) => void;
  setReferenceDate: (date: Date | null) => void;
  toggleSpecialPeriod: () => void;
  toggleHolidays: () => void;
  // 특이사항 관련 함수 추가
  addSpecialPeriod: (period: Omit<SpecialPeriod, 'id'>) => void;
  updateSpecialPeriod: (period: SpecialPeriod) => void;
  removeSpecialPeriod: (id: string) => void;
  // 휴일 관련 함수 추가
  addHoliday: (holiday: Omit<Holiday, 'id'>) => void;
  removeHoliday: (id: string) => void;
  calculateVacation: () => void;
}

const initialFormData: ExtendedCalculatorFormData = {
  calculationMethod: 'hireDate',
  hireDate: null,
  fiscalYearDate: new Date(new Date().getFullYear(), 0, 1),
  referenceDate: null,
  hasSpecialPeriod: false,
  includeHolidays: false,
  // 특이사항 및 휴일 배열 추가
  specialPeriods: [],
  holidays: [],
  result: null, // result 속성 추가
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
  const [formData, setFormData] = useState<ExtendedCalculatorFormData>(initialFormData);

  const setCalculationMethod = useCallback((method: CalculationMethod) => {
    setFormData((prev) => ({ ...prev, calculationMethod: method }));
  }, []);

  const setHireDate = useCallback((date: Date | null) => {
    setFormData((prev) => ({ ...prev, hireDate: date }));
  }, []);

  const setFiscalYearDate = useCallback((date: Date | null) => {
    setFormData((prev) => ({ ...prev, fiscalYearDate: date }));
  }, []);

  const setReferenceDate = useCallback((date: Date | null) => {
    setFormData((prev) => ({ ...prev, referenceDate: date }));
  }, []);

  const toggleSpecialPeriod = useCallback(() => {
    setFormData((prev) => ({ ...prev, hasSpecialPeriod: !prev.hasSpecialPeriod }));
  }, []);

  const toggleHolidays = useCallback(() => {
    setFormData((prev) => ({ ...prev, includeHolidays: !prev.includeHolidays }));
  }, []);

  // 특이사항 추가 함수
  const addSpecialPeriod = useCallback((period: Omit<SpecialPeriod, 'id'>) => {
    const newPeriod = {
      ...period,
      id: crypto.randomUUID(),
    };

    setFormData((prev) => ({
      ...prev,
      specialPeriods: [...prev.specialPeriods, newPeriod],
    }));
  }, []);

  // 특이사항 편집 함수
  const updateSpecialPeriod = useCallback((updatedPeriod: SpecialPeriod) => {
    setFormData((prev) => ({
      ...prev,
      specialPeriods: prev.specialPeriods.map((period) =>
        period.id === updatedPeriod.id ? updatedPeriod : period,
      ),
    }));
  }, []);

  // 특이사항 제거 함수
  const removeSpecialPeriod = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      specialPeriods: prev.specialPeriods.filter((period) => period.id !== id),
    }));
  }, []);

  // 휴일 추가 함수
  const addHoliday = useCallback((holiday: Omit<Holiday, 'id'>) => {
    const newHoliday = {
      ...holiday,
      id: crypto.randomUUID(),
    };

    setFormData((prev) => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday],
    }));
  }, []);

  // 휴일 제거 함수
  const removeHoliday = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      holidays: prev.holidays.filter((holiday) => holiday.id !== id),
    }));
  }, []);

  const calculateVacation = useCallback(() => {
    // 연차 계산 로직 구현 (추후 개발)
    console.log('Calculating vacation with data:', formData);

    // 예시: 임시 결과값 설정
    setFormData((prev) => ({
      ...prev,
      result: 15, // 결과값 설정 예시
    }));
  }, [formData]);

  const value = {
    formData,
    setCalculationMethod,
    setHireDate,
    setFiscalYearDate,
    setReferenceDate,
    toggleSpecialPeriod,
    toggleHolidays,
    addSpecialPeriod,
    updateSpecialPeriod,
    removeSpecialPeriod,
    addHoliday,
    removeHoliday,
    calculateVacation,
  };

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>;
}
