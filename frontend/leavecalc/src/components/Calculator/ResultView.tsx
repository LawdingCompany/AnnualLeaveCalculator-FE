// ResultView.tsx
import React from 'react';
import { useCalcDispatch, useCalcState } from './context';

export default function ResultView() {
  const s = useCalcState();
  const d = useCalcDispatch();
  const r = s.result!;
  const typeLabel = r.annualLeaveResultType === 'FULL' ? '정기 연차' : '월차 누적';

  const goBack = () => {
    d({ type: 'SET_RESULT', payload: null });
    d({ type: 'SET_VIEW', payload: 'form' });
  };

  // 공통 상단 요약 카드
  const Summary = () => {
    const total =
      r.annualLeaveResultType === 'FULL'
        ? r.calculationDetail.totalLeaveDays
        : r.calculationDetail.totalLeaveDays;

    const period =
      r.annualLeaveResultType === 'FULL' && r.calculationDetail.accrualPeriod
        ? `${r.calculationDetail.accrualPeriod.startDate} ~ ${r.calculationDetail.accrualPeriod.endDate}`
        : null;

    return (
      <div className="rounded-lg border border-neutral-200 p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-neutral-500">연차 결과</div>
            <h3 className="text-lg font-semibold text-neutral-800 mt-0.5">{typeLabel}</h3>
            <p className="text-sm text-neutral-500 mt-1">{r.explanation}</p>
          </div>
          <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 font-semibold">
            총 {total.toFixed(1)}일
          </div>
        </div>

        {period && (
          <div className="mt-3 text-sm">
            <span className="text-neutral-500 mr-2">사용 가능 기간</span>
            <span className="font-medium">{period}</span>
          </div>
        )}
      </div>
    );
  };

  // 상세보기 본문
  const Details = () => {
    if (r.annualLeaveResultType === 'FULL') {
      const cd = r.calculationDetail;
      return (
        <div className="grid grid-cols-2 gap-3 text-sm">
          {cd.accrualPeriod && (
            <div className="col-span-2">
              <span className="text-neutral-500 mr-2">산정기간</span>
              <span className="font-medium">
                {cd.accrualPeriod.startDate} ~ {cd.accrualPeriod.endDate}
              </span>
            </div>
          )}
          <div>
            <span className="text-neutral-500 mr-2">기본 연차</span>
            <span className="font-medium">{cd.baseAnnualLeave}일</span>
          </div>
          <div>
            <span className="text-neutral-500 mr-2">근속연수</span>
            <span className="font-medium">{cd.serviceYears}년</span>
          </div>
          <div>
            <span className="text-neutral-500 mr-2">가산휴가</span>
            <span className="font-medium">{cd.additionalLeave}일</span>
          </div>
          <div>
            <span className="text-neutral-500 mr-2">총 발생</span>
            <span className="font-semibold">{cd.totalLeaveDays.toFixed(1)}일</span>
          </div>
        </div>
      );
    }

    // MONTHLY
    const cd = r.calculationDetail;
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-500">
              <th className="py-2 pr-3">기간</th>
              <th className="py-2">발생</th>
            </tr>
          </thead>
          <tbody>
            {cd.records.map((rec, i) => (
              <tr key={i} className="border-t">
                <td className="py-2 pr-3">
                  {rec.period.startDate} ~ {rec.period.endDate}
                </td>
                <td className="py-2">{rec.monthlyLeave.toFixed(1)}일</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t font-semibold">
              <td className="py-2 pr-3">합계</td>
              <td className="py-2">{cd.totalLeaveDays.toFixed(1)}일</td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  };

  return (
    <section className="grid gap-4">
      <Summary />

      {/* 상세보기 토글 */}
      <details className="rounded-lg border border-neutral-200 p-4">
        <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm">
          <span className="font-medium text-neutral-800">상세보기</span>
          <svg
            className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clipRule="evenodd"
            />
          </svg>
        </summary>
        <div className="mt-3">
          <Details />
        </div>
      </details>

      <div className="flex justify-end">
        <button
          onClick={goBack}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
        >
          다시 계산
        </button>
      </div>
    </section>
  );
}
