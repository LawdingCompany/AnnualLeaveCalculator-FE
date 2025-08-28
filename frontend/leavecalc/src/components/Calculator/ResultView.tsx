// src/components/Calculator/ResultView.tsx
import React from 'react';
import { useCalcDispatch, useCalcState } from './context';
import type { CalcApiResult } from './resultTypes';
import ResultSummaryLine from './result/ResultSummaryLine';
import ResultBasicInfo from './result/ResultBasicInfo';
import ResultDetails from './result/ResultDetails';

export default function ResultView() {
  const s = useCalcState();
  const d = useCalcDispatch();
  const r = s.result as CalcApiResult;

  const goBack = () => {
    d({ type: 'SET_RESULT', payload: null });
    d({ type: 'SET_VIEW', payload: 'form' });
  };

  return (
    <section className="grid gap-4">
      {/* 1) 한 줄 요약 */}
      <ResultSummaryLine result={r} />

      {/* 2) 기본 정보 */}
      <ResultBasicInfo result={r} />

      {/* 3) 상세보기 */}
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
          <ResultDetails result={r} />
        </div>
      </details>

      {/* 4) 다시 계산 */}
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
