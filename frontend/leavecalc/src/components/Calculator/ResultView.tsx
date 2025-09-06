// src/components/Calculator/ResultView.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useCalcDispatch, useCalcState } from './context';
import type { CalcApiResult } from './resultTypes';
import ResultSummaryLine from './result/ResultSummaryLine';
import ResultBasicInfo from './result/ResultBasicInfo';
import ResultDetails from './result/ResultDetails';
import FeedbackModal from './FeedbackModal';

export default function ResultView() {
  const s = useCalcState();
  const d = useCalcDispatch();
  const r = s.result as CalcApiResult;

  const [detailOpen, setDetailOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

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

      {/* 3) 하단 액션 바: 좌(오류문의) / 우(상세보기, 다시 계산) */}
      <div className="mt-2 flex items-center justify-between">
        {/* 좌측: 오류 문의 */}
        <button
          type="button"
          onClick={() => setFeedbackOpen(true)}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
        >
          오류 문의
        </button>

        {/* 우측: 상세보기, 다시 계산 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            상세보기
          </button>
          <button
            type="button"
            onClick={goBack}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
          >
            다시 계산
          </button>
        </div>
      </div>

      {/* 상세보기 모달 */}
      <DetailModal open={detailOpen} onClose={() => setDetailOpen(false)} title="상세 보기">
        <ResultDetails result={r} />
      </DetailModal>

      {/* 오류문의 모달 */}
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </section>
  );
}

/** 결과 상세 모달(가벼운 로컬 컴포넌트) */
function DetailModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-modal-title"
        className="absolute left-1/2 top-1/2 w-[920px] max-w-[94vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <h3 id="detail-modal-title" className="text-lg font-semibold text-neutral-900">
            {title}
          </h3>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>

        {/* Footer */}
        <div className="flex justify-end border-t border-neutral-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-200 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
