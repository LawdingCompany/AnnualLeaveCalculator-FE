/** YYYY-MM-DD */
export type Ymd = string;

/** 공통 기간 */
export interface Period {
  startDate: Ymd;
  endDate: Ymd;
}

/** 결과 유형 */
export type LeaveType = 'MONTHLY' | 'PRORATED' | 'ANNUAL' | 'MONTHLY_AND_PRORATED';

/** 특수기간(에코) */
export interface NonWorkingPeriod {
  /** 1=출근간주, 2=결근처리, 3=소정근로제외(서버 규약) */
  type: number;
  startDate: Ymd;
  endDate: Ymd;
}

/** 공통 응답 필드 */
export interface BaseResult {
  calculationType: 'HIRE_DATE' | 'FISCAL_YEAR';
  /** 'MM-DD' (FISCAL_YEAR일 때만 존재) */
  fiscalYear?: string;
  hireDate: Ymd;
  referenceDate: Ymd;

  nonWorkingPeriod?: NonWorkingPeriod[];
  companyHolidays?: Ymd[];

  leaveType: LeaveType;

  /** 산정 로직/법령 설명 */
  explanations: string[];
  /** 특수기간 처리 설명 */
  nonWorkingExplanations?: string[];
}

/** MONTHLY */
export interface MonthlyRecord {
  period: Period;
  /** 그 월 발생일 */
  monthlyLeave: number;
}
export interface MonthlyDetail {
  accrualPeriod: Period;
  availablePeriod: Period;
  /** 0~1 */
  attendanceRate?: number;
  /** 0~1 */
  prescribedWorkingRatio?: number;
  serviceYears: number;
  totalLeaveDays: number;
  records: MonthlyRecord[];
}

/** PRORATED */
export interface ProratedDetail {
  accrualPeriod: Period;
  availablePeriod: Period;
  /** 0~1 */
  attendanceRate?: number;
  /** 0~1 */
  prescribedWorkingRatio?: number;
  prescribedWorkingRatioForProrated?: number;
  serviceYears: number;
  totalLeaveDays: number;
  /**
   * 일부 케이스에서 월별 기여 표가 함께 내려옴(옵션).
   * 예시 JSON에 존재하므로 옵션으로 허용.
   */
  records?: MonthlyRecord[];
}

/** ANNUAL */
export interface AnnualDetail {
  accrualPeriod: Period;
  availablePeriod: Period;
  /** 0~1 */
  attendanceRate?: number;
  /** 0~1 */
  prescribedWorkingRatio?: number;
  serviceYears: number;
  /** 최종 연차(= baseAnnualLeave + additionalLeave) */
  totalLeaveDays: number;
  /** 15, 16, ... */
  baseAnnualLeave: number;
  /** 가산연차 */
  additionalLeave: number;
}

/** MONTHLY + PRORATED */
export interface MonthlyAndProratedDetail {
  /** 상단 요약에도 존재 */
  serviceYears: number;
  /** 월차+비례 합계 */
  totalLeaveDays: number;

  /**
   * 예시 JSON과 일치시키기 위해
   * 원형 타입(MonthlyDetail/ProratedDetail) 그대로 사용
   * (각각 serviceYears 포함)
   */
  monthlyDetail: MonthlyDetail;
  proratedDetail: ProratedDetail;
}

/** 최상위 응답 타입 (Discriminated Union) */
export type CalcApiResult =
  | (BaseResult & { leaveType: 'MONTHLY'; calculationDetail: MonthlyDetail })
  | (BaseResult & { leaveType: 'PRORATED'; calculationDetail: ProratedDetail })
  | (BaseResult & { leaveType: 'ANNUAL'; calculationDetail: AnnualDetail })
  | (BaseResult & {
      leaveType: 'MONTHLY_AND_PRORATED';
      calculationDetail: MonthlyAndProratedDetail;
    });

/** 타입가드(스위처/렌더 최적화에 유용) */
export const isMonthly = (
  r: CalcApiResult,
): r is Extract<CalcApiResult, { leaveType: 'MONTHLY' }> => r.leaveType === 'MONTHLY';

export const isProrated = (
  r: CalcApiResult,
): r is Extract<CalcApiResult, { leaveType: 'PRORATED' }> => r.leaveType === 'PRORATED';

export const isAnnual = (r: CalcApiResult): r is Extract<CalcApiResult, { leaveType: 'ANNUAL' }> =>
  r.leaveType === 'ANNUAL';

export const isCombo = (
  r: CalcApiResult,
): r is Extract<CalcApiResult, { leaveType: 'MONTHLY_AND_PRORATED' }> =>
  r.leaveType === 'MONTHLY_AND_PRORATED';
