import type { CalcApiResult } from '../resultTypes';

export function fmtDays(v: number): string {
  return v % 1 === 0 ? v.toString() : v.toFixed(1);
}

export function fmtDateKR(iso: string): string {
  if (!iso) return '-';
  const [y, m, d] = iso.split('-');
  return `${y}년 ${+m}월 ${+d}일`;
}

export function typeLabelOf(type: CalcApiResult['leaveType']): string {
  switch (type) {
    case 'MONTHLY':
      return '월차';
    case 'PRORATED':
      return '비례연차';
    case 'ANNUAL':
      return '정기연차';
    case 'MONTHLY_AND_PRORATED':
      return '월차+비례연차';
    default:
      return type;
  }
}

/** 결과 기간 요약 */
export function getPeriods(result: CalcApiResult) {
  switch (result.leaveType) {
    case 'MONTHLY': {
      const cd = result.calculationDetail;
      return {
        accrualLabel: `${cd.accrualPeriod.startDate} ~ ${cd.accrualPeriod.endDate}`,
        usableLabel: `${cd.availablePeriod.startDate} ~ ${cd.availablePeriod.endDate}`,
      };
    }
    case 'PRORATED': {
      const cd = result.calculationDetail;
      return {
        accrualLabel: `${cd.accrualPeriod.startDate} ~ ${cd.accrualPeriod.endDate}`,
        usableLabel: `${cd.availablePeriod.startDate} ~ ${cd.availablePeriod.endDate}`,
      };
    }
    case 'ANNUAL': {
      const cd = result.calculationDetail;
      return {
        accrualLabel: `${cd.accrualPeriod.startDate} ~ ${cd.accrualPeriod.endDate}`,
        usableLabel: `${cd.availablePeriod.startDate} ~ ${cd.availablePeriod.endDate}`,
      };
    }
    case 'MONTHLY_AND_PRORATED': {
      const cd = result.calculationDetail;
      return {
        accrualLabel: `${cd.monthlyDetail.accrualPeriod.startDate} ~ ${cd.proratedDetail.accrualPeriod.endDate}`,
        usableLabel: `${cd.proratedDetail.availablePeriod.startDate} ~ ${cd.proratedDetail.availablePeriod.endDate}`,
      };
    }
    default:
      return { accrualLabel: '-', usableLabel: '-' };
  }
}
