import type { CalcApiResult } from '../resultTypes';

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
      return '연차';
    case 'MONTHLY_AND_PRORATED':
      return '월차 & 비례연차';
    default:
      return type;
  }
}

/** 결과 기간 요약 */
export function getPeriods(result: CalcApiResult) {
  const toRange = (a?: { startDate?: string | null; endDate?: string | null } | null) =>
    a?.startDate && a?.endDate ? `${a.startDate} ~ ${a.endDate}` : '-';

  switch (result.leaveType) {
    case 'MONTHLY': {
      const cd = result.calculationDetail as any;
      return {
        accrualLabel: toRange(cd?.accrualPeriod),
        usableLabel: toRange(cd?.availablePeriod),
      };
    }
    case 'PRORATED': {
      const cd = result.calculationDetail as any;
      return {
        accrualLabel: toRange(cd?.accrualPeriod),
        usableLabel: toRange(cd?.availablePeriod),
      };
    }
    case 'ANNUAL': {
      const cd = result.calculationDetail as any;
      return {
        accrualLabel: toRange(cd?.accrualPeriod),
        usableLabel: toRange(cd?.availablePeriod),
      };
    }
    case 'MONTHLY_AND_PRORATED': {
      const cd = result.calculationDetail as any;
      // 실제 키 이름 확인: monthly/prorated 또는 monthlyDetail/proratedDetail
      const monthly = cd?.monthly ?? cd?.monthlyDetail;
      const prorated = cd?.prorated ?? cd?.proratedDetail;
      return {
        accrualLabel: toRange(monthly?.accrualPeriod) || toRange(prorated?.accrualPeriod),
        usableLabel: toRange(prorated?.availablePeriod),
      };
    }
    default:
      return { accrualLabel: '-', usableLabel: '-' };
  }
}
