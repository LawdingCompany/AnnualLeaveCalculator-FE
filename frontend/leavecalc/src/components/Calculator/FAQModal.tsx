// src/components/Calculator/FAQModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { HelpCircle, X, ChevronDown, Search } from 'lucide-react';

type FAQ = { q: string; a: React.ReactNode; tags?: string[] };

export default function FAQModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [query, setQuery] = useState('');
  const [expandAll, setExpandAll] = useState(false);

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

  useEffect(() => {
    if (open) {
      setQuery('');
      setExpandAll(false);
    }
  }, [open]);

  if (!open) return null;

  // ✅ FAQ 데이터
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
      tags: ['결근', '출근간주', '소정근로'],
    },
    {
      q: 'Q2. 근무한 지 1년이 안됐는데도 연차가 생기나요?',
      a: (
        <p className="text-neutral-800">
          네. 근로기준법 제60조 제1항에 따라 <b>매월 개근</b> 시 <b>1일의 월차</b>가 부여됩니다.
        </p>
      ),
      tags: ['월차', '1년미만', '개근'],
    },
    {
      q: 'Q3. 연차 발생 기준이 회사마다 다른가요?',
      a: (
        <p className="text-neutral-800">
          회사마다 운영 기준이 다를 수 있지만, <b>법적 최소 기준 미만</b>으로 부여하는
          내규/취업규칙/단체협약 등은 효력이 없으며, 최소한 법정 기준 이상의 연차를 지급해야 합니다.
        </p>
      ),
      tags: ['법정기준', '내규', '취업규칙'],
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
      tags: ['출근율', '80%', '무단결근', '월차'],
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
      tags: ['소수점', '시간단위', '환산'],
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(q) ||
        (typeof f.a === 'string' && f.a.toLowerCase().includes(q)) ||
        (f.tags ?? []).some((t) => t.toLowerCase().includes(q)),
    );
  }, [faqs, query]);

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop + blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-title"
        className="absolute left-1/2 top-1/2 w-[760px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <HelpCircle className="h-4 w-4" aria-hidden />
            </div>
            <h3 id="faq-title" className="text font-semibold text-neutral-900">
              자주 묻는 질문(FAQ)
            </h3>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Toolbar: 검색 + 전체 펼치기/접기 */}
        <div className="flex items-center gap-2 px-5 pt-3">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="키워드로 검색하세요 (예: 월차, 80%, 무단결근)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-3 py-2 text-sm outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)]"
            />
          </div>
          <button
            type="button"
            onClick={() => setExpandAll((v) => !v)}
            className="shrink-0 rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
            aria-pressed={expandAll}
          >
            {expandAll ? '전체 접기' : '전체 펼치기'}
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[68vh] overflow-y-auto px-5 py-4">
          {filtered.length === 0 ? (
            <p className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              검색 결과가 없습니다. 다른 키워드를 입력해 보세요.
            </p>
          ) : (
            <ul className="space-y-3">
              {filtered.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} expandAll={expandAll} />
              ))}
            </ul>
          )}

          <p className="mt-4 text-[12px] text-neutral-500">
            * 본 안내는 일반 정보이며, 최종 해석과 적용은 회사 규정 및 관계 법령에 따릅니다.
          </p>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 flex justify-end border-t border-neutral-200 bg-white/95 px-5 py-4 backdrop-blur">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ q, a, expandAll }: { q: string; a: React.ReactNode; expandAll: boolean }) {
  // open 상태를 외부 expandAll의 변화에 동기화
  const [open, setOpen] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
    } else {
      setOpen(expandAll);
    }
  }, [expandAll]);

  return (
    <li className="rounded-xl border border-neutral-200">
      <details
        className="group"
        open={open}
        onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="flex cursor-pointer select-none items-center gap-3 px-3 py-2">
          <span className="inline-flex shrink-0 items-center justify-center rounded-md bg-blue-50 px-2 py-[2px] text-[11px] font-semibold text-blue-700">
            {q.split('.')[0]}.
          </span>
          <span className="font-medium text-neutral-900">{q.replace(/^Q\d+\.\s*/, '')}</span>
          <ChevronDown
            className="ml-auto h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="border-t border-neutral-200 px-3 py-3 text-sm">{a}</div>
      </details>
    </li>
  );
}
