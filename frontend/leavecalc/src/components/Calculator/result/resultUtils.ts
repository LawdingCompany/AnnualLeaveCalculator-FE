// src/components/Calculator/result/resultUtils.ts
import type { CalcApiResult } from '../resultTypes';

export const TYPE_LABEL: Record<CalcApiResult['annualLeaveResultType'], string> = {
  FULL: '정기 연차',
  MONTHLY: '월차',
  PRORATED: '비례연차',
  MONTHY_PRORATED: '월차 + 비례연차',
  ADJUSTED: '출근율 비례삭감 연차',
};

export function typeLabelOf(t: CalcApiResult['annualLeaveResultType']): string {
  return TYPE_LABEL[t];
}

export function fmtDays(n?: number) {
  return typeof n === 'number' ? n.toFixed(1) : '-';
}

export function fmtDateKR(iso?: string) {
  if (!iso) return '-';
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return iso;
  return `${m[1]}년 ${m[2]}월 ${m[3]}일`;
}

/** 산정기간/사용가능기간 + (월차/비례연차) 합계 */
export function getPeriods(r: CalcApiResult) {
  let accrualLabel: string | null = null;
  let monthlySum: number | null = null;
  let proratedSum: number | null = null;

  switch (r.annualLeaveResultType) {
    case 'FULL':
      accrualLabel = `${r.calculationDetail.accrualPeriod.startDate} ~ ${r.calculationDetail.accrualPeriod.endDate}`;
      break;
    case 'PRORATED':
      accrualLabel = `${r.calculationDetail.proratedLeaveAccrualPeriod.startDate} ~ ${r.calculationDetail.proratedLeaveAccrualPeriod.endDate}`;
      break;
    case 'MONTHY_PRORATED':
      accrualLabel = `${r.calculationDetail.monthlyLeaveAccrualPeriod.startDate} ~ ${r.calculationDetail.monthlyLeaveAccrualPeriod.endDate}`;
      monthlySum = r.calculationDetail.monthlyLeaveDays;
      proratedSum = r.calculationDetail.proratedLeaveDays;
      break;
    case 'MONTHLY': {
      const recs = r.calculationDetail.records ?? [];
      if (recs.length) {
        const first = recs[0].period.startDate;
        const last = recs[recs.length - 1].period.endDate;
        accrualLabel = `${first} ~ ${last}`;
      }
      break;
    }
    // ADJUSTED: 기간 없음
  }

  const usableLabel = r.annualLeaveResultType === 'FULL' && accrualLabel ? accrualLabel : null;

  return { accrualLabel, usableLabel, monthlySum, proratedSum };
}
