/** 공통 기간 */
export interface Period {
  startDate: string;
  endDate: string;
}

/** 결과 유형 */
export type LeaveType = 'MONTHLY' | 'PRORATED' | 'ANNUAL' | 'MONTHLY_AND_PRORATED';

/** 공통 필드 */
export interface BaseResult {
  calculationType: 'HIRE_DATE' | 'FISCAL_YEAR';
  fiscalYear?: string; // MM-DD
  hireDate: string;
  referenceDate: string;
  nonWorkingPeriod?: {
    type: number;
    startDate: string;
    endDate: string;
  }[];
  companyHolidays?: string[];
  leaveType: LeaveType;
  explanations: string[];
  nonWorkingExplanations?: string[];
}

/** MONTHLY */
export interface MonthlyRecord {
  period: Period;
  monthlyLeave: number;
}
export interface MonthlyDetail {
  accrualPeriod: Period;
  availablePeriod: Period;
  attendanceRate?: number;
  prescribedWorkingRatio?: number;
  serviceYears: number;
  totalLeaveDays: number;
  records: MonthlyRecord[];
}

/** PRORATED */
export interface ProratedDetail {
  accrualPeriod: Period;
  availablePeriod: Period;
  attendanceRate?: number;
  prescribedWorkingRatio?: number;
  serviceYears: number;
  totalLeaveDays: number;
}

/** ANNUAL */
export interface AnnualDetail {
  accrualPeriod: Period;
  availablePeriod: Period;
  attendanceRate?: number;
  prescribedWorkingRatio?: number;
  serviceYears: number;
  totalLeaveDays: number;
  baseAnnualLeave: number;
  additionalLeave: number;
}

/** MONTHLY + PRORATED */
export interface MonthlyAndProratedDetail {
  serviceYears: number;
  totalLeaveDays: number;
  monthlyDetail: Omit<MonthlyDetail, 'serviceYears'>;
  proratedDetail: Omit<ProratedDetail, 'serviceYears'>;
}

/** 최상위 응답 타입 */
export type CalcApiResult =
  | (BaseResult & { leaveType: 'MONTHLY'; calculationDetail: MonthlyDetail })
  | (BaseResult & { leaveType: 'PRORATED'; calculationDetail: ProratedDetail })
  | (BaseResult & { leaveType: 'ANNUAL'; calculationDetail: AnnualDetail })
  | (BaseResult & {
      leaveType: 'MONTHLY_AND_PRORATED';
      calculationDetail: MonthlyAndProratedDetail;
    });
