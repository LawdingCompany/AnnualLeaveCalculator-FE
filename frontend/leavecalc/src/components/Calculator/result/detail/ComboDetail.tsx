// src/components/Calculator/result/detail/ComboDetail.tsx
import React, { useMemo, useState, useEffect, useRef } from 'react';
import MonthlyDetail from './MonthlyDetail';
import ProratedDetail from './ProratedDetail';
import type {
  MonthlyDetail as MonthlyDetailModel,
  ProratedDetail as ProratedDetailModel,
  MonthlyAndProratedDetail as MonthlyAndProratedDetailModel,
} from '../../resultTypes';

// 입력 포맷 정규화
type ComboDetailInput =
  | { monthly: MonthlyDetailModel; prorated: ProratedDetailModel } // 예전 커스텀 포맷
  | MonthlyAndProratedDetailModel; // 정식 API 포맷

function toPair(detail: ComboDetailInput): {
  monthly?: MonthlyDetailModel;
  prorated?: ProratedDetailModel;
} {
  if ('monthlyDetail' in detail && 'proratedDetail' in detail) {
    return {
      monthly: detail.monthlyDetail ?? undefined,
      prorated: detail.proratedDetail ?? undefined,
    };
  }
  const any = detail as any;
  return { monthly: any.monthly, prorated: any.prorated };
}

// ──────────────────────────────────────────────────────────────
// Segmented Tabs (월차 / 비례연차)
// ──────────────────────────────────────────────────────────────
export default function ComboDetail({ detail }: { detail: ComboDetailInput }) {
  const { monthly, prorated } = toPair(detail);

  // 사용 가능한 탭 계산
  const tabs = useMemo(() => {
    const t: Array<{
      key: 'monthly' | 'prorated';
      label: string;
      total?: number;
      disabled?: boolean;
    }> = [
      {
        key: 'monthly',
        label: '월차',
        total: monthly?.totalLeaveDays,
        disabled: !monthly,
      },
      {
        key: 'prorated',
        label: '비례연차',
        total: prorated?.totalLeaveDays,
        disabled: !prorated,
      },
    ];
    return t;
  }, [monthly, prorated]);

  // 기본 선택: 월차 있으면 월차, 없으면 비례연차
  const [active, setActive] = useState<'monthly' | 'prorated'>(() =>
    monthly ? 'monthly' : 'prorated',
  );

  // 데이터가 바뀌면 비활성 탭에 머무르지 않도록 보정
  useEffect(() => {
    if (active === 'monthly' && !monthly && prorated) setActive('prorated');
    if (active === 'prorated' && !prorated && monthly) setActive('monthly');
  }, [active, monthly, prorated]);

  // 키보드 좌우 이동
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDownTabs = (e: React.KeyboardEvent) => {
    const enabled = tabs.filter((t) => !t.disabled);
    if (enabled.length < 2) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    e.preventDefault();
    const idx = enabled.findIndex((t) => t.key === active);
    if (idx < 0) return;
    const next =
      e.key === 'ArrowRight'
        ? enabled[(idx + 1) % enabled.length]
        : enabled[(idx - 1 + enabled.length) % enabled.length];
    setActive(next.key);
    const nextIndex = tabs.findIndex((t) => t.key === next.key);
    if (nextIndex >= 0) btnRefs.current[nextIndex]?.focus();
  };

  return (
    <section className="rounded-xl border border-neutral-200">
      {/* 헤더: 세그먼트 탭 */}
      <header
        className="flex items-center justify-between gap-2 border-b border-neutral-200 px-4 py-3"
        onKeyDown={onKeyDownTabs}
      >
        <div className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white p-1">
          {tabs.map((t, i) => {
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                ref={(el) => {
                  btnRefs.current[i] = el; //   할당만 하고
                }}
                type="button"
                disabled={t.disabled}
                aria-pressed={isActive}
                onClick={() => !t.disabled && setActive(t.key)}
                className={[
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition',
                  t.disabled
                    ? 'text-neutral-400 cursor-not-allowed'
                    : isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-neutral-700 hover:bg-neutral-50',
                ].join(' ')}
              >
                <span className="font-medium">{t.label}</span>
                {typeof t.total === 'number' && (
                  <span
                    className={[
                      'rounded-sm px-1 text-[11px]',
                      isActive
                        ? 'bg-blue-200/60 text-blue-800'
                        : 'bg-neutral-200/60 text-neutral-700',
                    ].join(' ')}
                    aria-label={`${t.label} 합계`}
                    title={`${t.label} 합계`}
                  >
                    {t.total}일
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Body */}
      <div className="p-4">
        {active === 'monthly' &&
          (monthly ? <MonthlyDetail detail={monthly} /> : <Empty label="월차 상세 없음" />)}

        {active === 'prorated' &&
          (prorated ? <ProratedDetail detail={prorated} /> : <Empty label="비례연차 상세 없음" />)}
      </div>
    </section>
  );
}

function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-neutral-200 p-4 text-sm text-neutral-500">
      {label}
    </div>
  );
}
