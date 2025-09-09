// src/components/Calculator/result/ResultBasicInfo.tsx
import React, { useMemo } from 'react';
import type { CalcApiResult } from '../resultTypes';

// ── 인라인 구분선 조절
const SEP_PX = 1.5;
const SEP_MT = 14;
const SEP_MB = 14;
const SEP_COLOR = '#e5e7eb';

// ── 표 레이아웃(상수로 통일)
const LABEL_W = 160; // px: 라벨 고정 폭
const ROW_GAP = 8; // px: 행 간 간격

// ── 타이포(자간/행간 통일)
const BASE = 'text-[13px] leading-[20px] tracking-[-0.005em]';
const LABEL_CLS = `${BASE} text-neutral-500`;
const VALUE_CLS = `${BASE} text-neutral-900`;

// 날짜 범위 포맷
function formatRange(a?: string | null, b?: string | null) {
  if (!a || !b) return '-';
  return `${a}\u00A0~\u00A0${b}`; // non-breaking space
}

/** 가운데 정렬 디바이더 */
function Divider({
  width = '60%',
  mt = 12,
  mb = 12,
  color = '#e5e7eb',
  thick = 1.5,
}: {
  width?: string;
  mt?: number;
  mb?: number;
  color?: string;
  thick?: number;
}) {
  return (
    <div
      className="mx-auto border-t"
      style={{ width, borderTopWidth: thick, marginTop: mt, marginBottom: mb, borderColor: color }}
    />
  );
}

/** 2셀: 라벨/값 한 행 */
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid items-center gap-x-3" style={{ gridTemplateColumns: `${LABEL_W}px 1fr` }}>
      <div className={LABEL_CLS}>{label}</div>
      <div className={VALUE_CLS}>{value}</div>
    </div>
  );
}

/** 4셀: 좌(라벨/값) + 우(라벨/값) 한 행 */
function PairRow({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: React.ReactNode;
  rightLabel: string;
  rightValue: React.ReactNode;
}) {
  return (
    <div className="grid items-center gap-x-3 grid-cols-[160px_1fr] md:grid-cols-[160px_1fr_160px_1fr]">
      <div className={LABEL_CLS}>{leftLabel}</div>
      <div className={VALUE_CLS}>{leftValue}</div>
      <div className={LABEL_CLS}>{rightLabel}</div>
      <div className={VALUE_CLS}>{rightValue}</div>
    </div>
  );
}

/** 특이기간 카테고리(결과 스키마의 type 그대로 사용) */
type CatKey = 1 | 2 | 3;
const CAT_LABEL: Record<CatKey, string> = {
  1: '출근 처리',
  2: '결근 처리',
  3: '소정근로 제외',
};

export default function ResultBasicInfo({
  result,
  onOpenGuide,
}: {
  result: CalcApiResult;
  onOpenGuide?: (section: 'accuracy' | 'glossary' | 'disclaimer' | 'types') => void;
}) {
  // ── 공통 표기
  const calcLabel = result.calculationType === 'FISCAL_YEAR' ? '회계연도' : '입사일';
  const fiscalStart = result.calculationType === 'FISCAL_YEAR' ? (result.fiscalYear ?? '-') : '-';

  // ── 합계
  const total = result.calculationDetail.totalLeaveDays;

  // ── 콤보 타입의 부분 합계
  const monthlySum =
    result.leaveType === 'MONTHLY_AND_PRORATED'
      ? result.calculationDetail.monthlyDetail?.totalLeaveDays
      : undefined;
  const proratedSum =
    result.leaveType === 'MONTHLY_AND_PRORATED'
      ? result.calculationDetail.proratedDetail?.totalLeaveDays
      : undefined;

  // ── 산정 기간(유형별)
  const annualAccrual = (() => {
    if (result.leaveType !== 'ANNUAL') return null;
    const p = result.calculationDetail.accrualPeriod;
    return formatRange(p?.startDate, p?.endDate);
  })();

  const monthlyAccrual = (() => {
    if (result.leaveType === 'MONTHLY') {
      const p = result.calculationDetail.accrualPeriod;
      return formatRange(p?.startDate, p?.endDate);
    }
    if (result.leaveType === 'MONTHLY_AND_PRORATED') {
      const p = result.calculationDetail.monthlyDetail?.accrualPeriod;
      return formatRange(p?.startDate ?? null, p?.endDate ?? null);
    }
    return null;
  })();

  const proratedAccrual = (() => {
    if (result.leaveType === 'PRORATED') {
      const p = result.calculationDetail.accrualPeriod;
      return formatRange(p?.startDate, p?.endDate);
    }
    if (result.leaveType === 'MONTHLY_AND_PRORATED') {
      const p = result.calculationDetail.proratedDetail?.accrualPeriod;
      return formatRange(p?.startDate ?? null, p?.endDate ?? null);
    }
    return null;
  })();

  // ── 사용 가능 기간(유형별)
  const annualUsable =
    result.leaveType === 'ANNUAL'
      ? formatRange(
          result.calculationDetail.availablePeriod?.startDate,
          result.calculationDetail.availablePeriod?.endDate,
        )
      : null;

  const monthlyUsable =
    result.leaveType === 'MONTHLY'
      ? formatRange(
          result.calculationDetail.availablePeriod?.startDate,
          result.calculationDetail.availablePeriod?.endDate,
        )
      : result.leaveType === 'MONTHLY_AND_PRORATED'
        ? formatRange(
            result.calculationDetail.monthlyDetail?.availablePeriod?.startDate ?? null,
            result.calculationDetail.monthlyDetail?.availablePeriod?.endDate ?? null,
          )
        : null;

  const proratedUsable =
    result.leaveType === 'PRORATED'
      ? formatRange(
          result.calculationDetail.availablePeriod?.startDate,
          result.calculationDetail.availablePeriod?.endDate,
        )
      : result.leaveType === 'MONTHLY_AND_PRORATED'
        ? formatRange(
            result.calculationDetail.proratedDetail?.availablePeriod?.startDate ?? null,
            result.calculationDetail.proratedDetail?.availablePeriod?.endDate ?? null,
          )
        : null;

  // ── 특이기간 + 회사휴일 → 카테고리별 집계 (회사휴일은 type=3로 편입)
  const grouped = useMemo(() => {
    const byCat: Record<
      CatKey,
      Array<{ startDate: string; endDate: string; isCompanyHoliday?: boolean }>
    > = { 1: [], 2: [], 3: [] };

    const periods = result.nonWorkingPeriod ?? [];
    for (const p of periods) {
      const t = (p.type as CatKey) ?? 3;
      if (t === 1 || t === 2 || t === 3) {
        byCat[t].push({ startDate: p.startDate, endDate: p.endDate });
      } else {
        byCat[3].push({ startDate: p.startDate, endDate: p.endDate });
      }
    }

    for (const d of result.companyHolidays ?? []) {
      byCat[3].push({ startDate: d, endDate: d, isCompanyHoliday: true });
    }

    (Object.keys(byCat) as unknown as CatKey[]).forEach((k) =>
      byCat[k].sort((a, b) => a.startDate.localeCompare(b.startDate)),
    );

    return byCat;
  }, [result.nonWorkingPeriod, result.companyHolidays]);

  // ── 뱃지 존재 여부
  const hasAnyBadge = Boolean(grouped[1].length || grouped[2].length || grouped[3].length);

  return (
    <section className="rounded-xl border border-neutral-200 p-5 md:p-6">
      {/* 타이틀 + 처리 뱃지(제목 바로 옆) */}
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="text font-semibold text-neutral-800">계산 정보</h4>

        {hasAnyBadge && (
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="특이기간 요약"
          >
            {([1, 2, 3] as CatKey[]).map((k) =>
              grouped[k].length ? (
                <button
                  key={k}
                  type="button"
                  onClick={() => onOpenGuide?.('types')}
                  className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200
                     bg-neutral-50 px-2.5 py-1 text-[12px] text-neutral-700
                     hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label={`특이기간: ${CAT_LABEL[k]} 설명 보기`}
                  title={`${CAT_LABEL[k]} 설명 보기`}
                >
                  <span className="font-medium">{CAT_LABEL[k]}</span>
                  <span className="rounded-sm bg-neutral-200/60 px-1 text-xs">
                    {grouped[k].length}
                  </span>
                </button>
              ) : null,
            )}
          </div>
        )}
      </div>

      {/* 인라인 구분선 */}
      <div
        className="border-t"
        style={{
          borderTopWidth: SEP_PX,
          marginTop: SEP_MT,
          marginBottom: SEP_MB,
          borderColor: SEP_COLOR,
        }}
      />

      {/* 1) 공통 정보 */}
      <div style={{ display: 'grid', rowGap: ROW_GAP }}>
        <PairRow
          leftLabel="산정 기준"
          leftValue={calcLabel}
          rightLabel="회계연도 시작일"
          rightValue={fiscalStart}
        />
        <PairRow
          leftLabel="입사일"
          leftValue={result.hireDate ?? '-'}
          rightLabel="계산 기준일"
          rightValue={result.referenceDate ?? '-'}
        />
      </div>

      {/* 가운데 정렬된 커스텀 구분선 */}
      <Divider width="60%" thick={1.5} mt={16} mb={16} />

      {/* 2) 결과 요약 */}
      <div className="mt-4" style={{ display: 'grid', rowGap: ROW_GAP }}>
        {result.leaveType === 'ANNUAL' && (
          <>
            <PairRow
              leftLabel="연차 합계"
              leftValue={<span className="font-semibold">{total} 일</span>}
              rightLabel="연차 산정 기간"
              rightValue={annualAccrual ?? '-'}
            />
            <Row label="연차 사용 가능 기간" value={annualUsable ?? '-'} />

            {/* 합계 위 구분선 */}
            <Divider />

            <Row label="총 연차 합계" value={<span className="font-semibold">{total} 일</span>} />
          </>
        )}

        {result.leaveType === 'MONTHLY' && (
          <>
            <PairRow
              leftLabel="월차 합계"
              leftValue={<span className="font-semibold">{total} 일</span>}
              rightLabel="월차 산정 기간"
              rightValue={monthlyAccrual ?? '-'}
            />
            <Row label="월차 사용 가능 기간" value={monthlyUsable ?? '-'} />

            {/* 합계 위 구분선 */}
            <Divider />

            <Row label="총 연차 합계" value={<span className="font-semibold">{total} 일</span>} />
          </>
        )}

        {result.leaveType === 'PRORATED' && (
          <>
            <PairRow
              leftLabel="비례연차 합계"
              leftValue={<span className="font-semibold">{total} 일</span>}
              rightLabel="비례연차 산정 기간"
              rightValue={proratedAccrual ?? '-'}
            />
            <Row label="비례연차 사용 가능 기간" value={proratedUsable ?? '-'} />

            {/* 합계 위 구분선 */}
            <Divider />

            <Row label="총 연차 합계" value={<span className="font-semibold">{total} 일</span>} />
          </>
        )}

        {result.leaveType === 'MONTHLY_AND_PRORATED' && (
          <>
            {/* 월차 파트 */}
            <PairRow
              leftLabel="월차 합계"
              leftValue={
                <span className="font-semibold">
                  {monthlySum !== undefined ? `${monthlySum} 일` : '-'}
                </span>
              }
              rightLabel="월차 산정 기간"
              rightValue={monthlyAccrual ?? '-'}
            />
            <Row label="월차 사용 가능 기간" value={monthlyUsable ?? '-'} />

            {/* 월차/비례 파트 사이 구분선 */}
            <Divider />

            {/* 비례연차 파트 */}
            <PairRow
              leftLabel="비례연차 합계"
              leftValue={
                <span className="font-semibold">
                  {proratedSum !== undefined ? `${proratedSum} 일` : '-'}
                </span>
              }
              rightLabel="비례연차 산정 기간"
              rightValue={proratedAccrual ?? '-'}
            />
            <Row label="비례연차 사용 가능 기간" value={proratedUsable ?? '-'} />

            {/* 총합 앞 구분선 */}
            <Divider />

            {/* 총합 */}
            <Row label="총 연차 합계" value={<span className="font-semibold">{total} 일</span>} />
          </>
        )}
      </div>
    </section>
  );
}
