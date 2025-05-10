export type CalculationMethod = 'hireDate' | 'fiscalYear';

export interface CalculatorFormData {
  calculationMethod: CalculationMethod;
  hireDate: Date | null;
  fiscalYearDate: Date | null;
  referenceDate: Date | null;
  hasSpecialPeriod: boolean;
  includeHolidays: boolean;
}
