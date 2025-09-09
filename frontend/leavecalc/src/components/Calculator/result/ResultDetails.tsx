// src/components/Calculator/result/detail/ResultDetail.tsx
import React from 'react';
import type { CalcApiResult, LeaveType } from '../resultTypes';
import MonthlyDetail from './detail/MonthlyDetail';
import ProratedDetail from './detail/ProratedDetail';
import ComboDetail from './detail/ComboDetail';
import AnnualDetail from './detail/AnnualDetail';
import ExplanationSection from './detail/_shared';

// 안전한 타입 가드
function isMonthly(type?: LeaveType) {
  return type === 'MONTHLY';
}
function isProrated(type?: LeaveType) {
  return type === 'PRORATED';
}
function isCombo(type?: LeaveType) {
  return type === 'MONTHLY_AND_PRORATED';
}
function isAnnual(type?: LeaveType) {
  return type === 'ANNUAL';
}

export default function ResultDetail({ result }: { result: CalcApiResult | null }) {
  if (!result) {
    return <div className="p-6 text-sm text-neutral-500">표시할 결과가 없습니다.</div>;
  }

  const { leaveType, calculationDetail, explanations, nonWorkingExplanations } = result;

  let detailEl: React.ReactNode = null;

  if (isMonthly(leaveType)) {
    detailEl = <MonthlyDetail detail={calculationDetail as any} />;
  } else if (isProrated(leaveType)) {
    detailEl = <ProratedDetail detail={calculationDetail as any} />;
  } else if (isCombo(leaveType)) {
    detailEl = <ComboDetail detail={calculationDetail as any} />;
  } else if (isAnnual(leaveType)) {
    detailEl = <AnnualDetail detail={calculationDetail as any} />;
  }

  return (
    <div>
      {detailEl}
      {/* ✅ 공통 설명 블록 추가 */}
      <ExplanationSection
        explanations={explanations}
        nonWorkingExplanations={nonWorkingExplanations}
      />
    </div>
  );
}
