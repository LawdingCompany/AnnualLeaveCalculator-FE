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

    // ▶ 추가 항목: Q6 ~ Q13
    {
      q: 'Q6. 상시근로자수가 5인 미만인 경우에도 연차가 발생하나요?',
      a: (
        <p className="text-neutral-800">
          <b>상시 근로자(사업주 제외) 5인 미만</b> 사업장은 법정 연차유급휴가 의무가 적용되지
          않습니다.
        </p>
      ),
      tags: ['5인미만', '적용제외', '사업장규모'],
    },
    {
      q: 'Q7. 연차를 다 못 쓰면 어떻게 되나요?',
      a: (
        <div className="space-y-2 text-neutral-800">
          <p>
            연차에는 <b>유효기간</b>이 있어요. <b>월차는 입사일로부터 1년</b>,{' '}
            <b>연차는 발생일로부터 1년</b> 동안 사용 가능합니다.
          </p>
          <p>
            기한 내 사용하지 못한 연차는 <b>연차유급휴가수당청구권</b>으로 전환되어 <b>연차수당</b>
            으로 청구할 수 있어요. (단, 회사가 <b>연차휴가촉진제도</b>를 적법하게 운영한 경우 수당
            청구가 제한될 수 있습니다.)
          </p>
        </div>
      ),
      tags: ['연차수당', '유효기간', '촉진제도'],
    },
    {
      q: 'Q8. 회사가 연차를 마음대로 쓰라고 강제할 수 있나요?',
      a: (
        <div className="space-y-2 text-neutral-800">
          <p>
            연차는 원칙적으로 <b>근로자가 청구한 시기</b>에 부여해야 하며, 회사가 임의로 <b>강제</b>
            할 수는 없습니다.
          </p>
          <p>
            다만, 회사는 <b>사업 운영에 막대한 지장이 있는 경우</b>에 한해 <b>시기변경권</b>을
            행사할 수 있습니다.
          </p>
        </div>
      ),
      tags: ['시기지정', '시기변경권', '사업운영지장'],
    },
    {
      q: 'Q9. 아르바이트(비정규직)도 연차가 생기나요?',
      a: (
        <div className="space-y-2 text-neutral-800">
          <p>
            고용 형태와 무관하게, <b>상시 5인 이상</b> 사업장이라면 <b>주 15시간 이상</b> 근로자에게
            유급휴가가 부여됩니다.
          </p>
          <p>따라서 아르바이트도 요건을 충족하면 연차를 사용할 수 있습니다.</p>
        </div>
      ),
      tags: ['아르바이트', '비정규직', '주15시간'],
    },
    {
      q: 'Q10. 연차 사용시 급여는 어떻게 되나요?',
      a: (
        <p className="text-neutral-800">
          연차는 <b>유급휴가</b>이므로, 연차 사용시간은 근로한 것으로 보아{' '}
          <b>시급/일급 등 통상임금</b>을 지급해야 합니다.
        </p>
      ),
      tags: ['유급휴가', '임금지급', '통상임금'],
    },
    {
      q: 'Q11. 연차를 시간단위로 사용할 수 있나요?',
      a: (
        <div className="space-y-2 text-neutral-800">
          <p>
            원칙은 <b>1일 단위</b>이나, 회사가 허용하면 <b>시간/분 단위</b>로 쪼개 사용 가능합니다.
          </p>
          <p className="text-sm text-neutral-700">
            다만 근로자에게 부여된 총 연차보다 적게 사용하게 할 수 없으므로, 회사가 소수점 단위를{' '}
            <b>올림 처리</b>하여(예: 13.7일 → 14일) 관리하는 정책을 둘 수 있습니다.
          </p>
        </div>
      ),
      tags: ['시간단위', '분단위', '올림처리'],
    },
    {
      q: 'Q12. 퇴사할 때 남은 연차는 어떻게 되나요?',
      a: (
        <p className="text-neutral-800">
          퇴사 시 미사용 연차는 <b>연차유급휴가보상청구권</b>으로 전환되어 <b>수당</b>으로
          정산되어야 합니다.
        </p>
      ),
      tags: ['퇴사정산', '연차보상', '미사용연차'],
    },
    {
      q: 'Q13. (사장님) 소수점 연차는 어떻게 처리해야 하나요?',
      a: (
        <div className="space-y-2 text-neutral-800">
          <p>
            소수점 연차는 <b>시간 단위</b>로 부여할 수 있습니다. 다만 실제 지급은 해당 시간보다 적게
            줄 수 없으므로
            <b> 일(또는 0.5일) 단위 올림</b> 지급을 권고드립니다.
          </p>
        </div>
      ),
      tags: ['소수점', '사업주', '올림지급'],
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
