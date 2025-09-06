// src/components/Calculator/FAQModal.tsx
import React, { useEffect, useRef } from 'react';

type FAQ = { q: string; a: React.ReactNode };

export default function FAQModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  // ✅ FAQ 데이터 배열
  const faqs: FAQ[] = [
    {
      q: 'Q1. 출근을 못했으면 무조건 결근인가요?',
      a: (
        <div className="space-y-2 text-neutral-800">
          <p>아니요! 결근도 다같은 결근이 아닙니다. 경우에 따라 아래 3가지로 나눌 수 있어요.</p>
          <ul className="mt-2 list-disc pl-5">
            <li>
              결근하였더라도 해당 기간을 <b>출근한 것으로 간주</b>하는 경우
            </li>
            <li>
              <b>결근 처리</b>하는 경우
            </li>
            <li>
              <b>소정근로일수에서 제외</b>하는 경우
            </li>
          </ul>
          <p className="text-sm text-neutral-600">
            각 경우에 따라 발생/차감되는 연차가 달라질 수 있으니, 먼저 계산해 보세요!
          </p>
        </div>
      ),
    },
    {
      q: 'Q2. 근무한 지 1년이 안됐는데도 연차가 생기나요?',
      a: (
        <p className="text-neutral-800">
          네. 근로기준법 제60조 제1항에 따라 <b>매월 개근</b> 시 <b>1일의 월차</b>가 부여됩니다.
        </p>
      ),
    },
    {
      q: 'Q3. 연차 발생 기준이 회사마다 다른가요?',
      a: (
        <p className="text-neutral-800">
          회사마다 운영 기준이 다를 수 있지만, <b>법적 최소 기준 미만</b>으로 부여하는
          내규/취업규칙/단체협약 등은 효력이 없으며, 최소한 법정 기준 이상의 연차를 지급해야 합니다.
        </p>
      ),
    },
    {
      q: 'Q4. 출근을 못 한 날이 있으면 연차가 줄어드나요?',
      a: (
        <p className="text-neutral-800">
          <b>근무기간 1년 미만</b> 또는 산정기간 출근율 <b>80% 미만</b>이라면, <b>개근 월 수</b>만큼
          월차가 발생합니다. 무단결근 등으로 개근이 깨진 달은 그 달의 월차가{' '}
          <b>발생하지 않을 수 있어요</b>.
        </p>
      ),
    },
    {
      q: 'Q5. 소수점 연차는 어떻게 사용하나요?',
      a: (
        <div className="space-y-2 text-neutral-800">
          <p>
            원칙은 일 단위지만, 회사가 허용하면 시간 단위 사용도 가능합니다. 소수점 연차는{' '}
            <b>1일 근무시간 × 소수점</b>으로 환산해 시간 단위로 쓸 수 있어요.
          </p>
          <p className="rounded-md bg-neutral-50 px-3 py-2 text-sm text-neutral-700">
            예: 1일 8시간 근무, 1.75일 연차 → <b>1일 + 6시간</b> 사용
          </p>
          <p className="text-sm text-neutral-600">
            단, 회사에 따라 시간 단위 사용이 제한될 수 있으니 내부 규정을 확인하세요.
          </p>
        </div>
      ),
    },
    // ... 나머지 Q6~Q12도 같은 방식으로 이어붙이면 됨
  ];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-title"
        className="absolute left-1/2 top-1/2 w-[720px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
          <h3 id="faq-title" className="text-lg font-semibold text-neutral-900">
            자주 묻는 질문(FAQ)
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
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          <ul className="space-y-3">
            {faqs.map((item, idx) => (
              <FAQItem key={idx} q={item.q} a={item.a} />
            ))}
          </ul>
          <p className="mt-4 text-[12px] text-neutral-500">
            * 해당 FAQ는 본 서비스의 일반적인 안내이며, 최종 해석과 적용은 회사 규정 및 관계 법령에
            따릅니다.
          </p>
        </div>

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

function FAQItem({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <li className="rounded-lg border border-neutral-200">
      <details className="group">
        <summary className="flex cursor-pointer select-none items-center justify-between gap-3 px-3 py-2">
          <span className="font-medium text-neutral-900">{q}</span>
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
        <div className="border-t border-neutral-200 px-3 py-3 text-sm">{a}</div>
      </details>
    </li>
  );
}
