// src/components/Calculator/resultTypes.ts
export type CalculationType = 'FISCAL_YEAR' | 'HIRE_DATE';
export type AnnualLeaveResultType =
  | 'MONTHLY'
  | 'PRORATED'
  | 'MONTHY_PRORATED' // 백엔드 키 그대로 사용
  | 'ADJUSTED'
  | 'FULL';

type CommonResult = {
  calculationType: CalculationType;
  annualLeaveResultType: AnnualLeaveResultType;
  fiscalYear?: string | null;
  hireDate?: string;
  referenceDate?: string;
  explanation: string;
};

/** 4.1 MONTHLY */
export type CalcMonthlyResult = CommonResult & {
  annualLeaveResultType: 'MONTHLY';
  calculationDetail: {
    records: { period: { startDate: string; endDate: string }; monthlyLeave: number }[];
    totalLeaveDays: number;
  };
};

/** 4.2 PRORATED */
export type CalcProratedResult = CommonResult & {
  annualLeaveResultType: 'PRORATED';
  calculationDetail: {
    proratedLeaveAccrualPeriod: { startDate: string; endDate: string };
    totalLeaveDays: number;
  };
};

/** 4.3 MONTHY_PRORATED */
export type CalcMonthlyProratedResult = CommonResult & {
  annualLeaveResultType: 'MONTHY_PRORATED';
  calculationDetail: {
    monthlyLeaveAccrualPeriod: { startDate: string; endDate: string };
    monthlyLeaveDays: number;
    proratedLeaveAccrualPeriod: { startDate: string; endDate: string };
    proratedLeaveDays: number;
    totalLeaveDays: number;
  };
};

/** 4.4 FULL */
export type CalcFullResult = CommonResult & {
  annualLeaveResultType: 'FULL';
  calculationDetail: {
    accrualPeriod: { startDate: string; endDate: string };
    baseAnnualLeave: number;
    serviceYears: number;
    additionalLeave: number;
    totalLeaveDays: number;
  };
};

/** 4.5 ADJUSTED */
export type CalcAdjustedResult = CommonResult & {
  annualLeaveResultType: 'ADJUSTED';
  calculationDetail: {
    baseAnnualLeave: number;
    serviceYears: number;
    additionalLeave: number;
    prescribedWorkingDays: number;
    excludedWorkingDays: number;
    prescribeWorkingRatio: number; // 스펙 키 그대로(철자 주의)
    totalLeaveDays: number;
  };
};

export type CalcApiResult =
  | CalcMonthlyResult
  | CalcProratedResult
  | CalcMonthlyProratedResult
  | CalcFullResult
  | CalcAdjustedResult;
