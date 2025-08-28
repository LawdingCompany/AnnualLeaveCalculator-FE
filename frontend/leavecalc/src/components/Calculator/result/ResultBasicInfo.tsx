// src/components/Calculator/result/ResultBasicInfo.tsx
import type { CalcApiResult } from '../resultTypes';
import { getPeriods, fmtDays } from './resultUtils';

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
const VALUE_CLS = `${BASE} text-neutral-900 tabular-nums`;

// 날짜 범위 포맷
function formatRange(a?: string | null, b?: string | null) {
  if (!a || !b) return '-';
  return `${a}\u00A0~\u00A0${b}`; // non-breaking space로 간격 고정
}

/** 2셀: 라벨/값 한 행 */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid items-center gap-x-3" style={{ gridTemplateColumns: `${LABEL_W}px 1fr` }}>
      <div className={LABEL_CLS}>{label}</div>
      <div className={VALUE_CLS}>{value}</div>
    </div>
  );
}

/** 4셀: 좌(라벨/값) + 우(라벨/값) 한 행 — 하나의 DOM만 사용, 반응형은 컬럼 수만 변경 */
function PairRow({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
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

export default function ResultBasicInfo({ result }: { result: CalcApiResult }) {
  // 공통 표기
  const calcLabel = result.calculationType === 'FISCAL_YEAR' ? '회계연도' : '입사일';
  const fiscalStart = result.calculationType === 'FISCAL_YEAR' ? (result.fiscalYear ?? '-') : '-';

  // 공통 기간
  const { accrualLabel, monthlySum, proratedSum } = getPeriods(result);
  const accrualPretty = (() => {
    if (!accrualLabel || accrualLabel === '-') return '-';
    const [a, , b] = accrualLabel.split(' ');
    return formatRange(a, b);
  })();

  // 유형별 기간
  const monthlyPeriodLabel =
    result.annualLeaveResultType === 'MONTHLY'
      ? accrualLabel
      : result.annualLeaveResultType === 'MONTHY_PRORATED'
        ? formatRange(
            result.calculationDetail.monthlyLeaveAccrualPeriod.startDate,
            result.calculationDetail.monthlyLeaveAccrualPeriod.endDate,
          )
        : null;

  const proratedPeriodLabel =
    result.annualLeaveResultType === 'PRORATED'
      ? accrualLabel
      : result.annualLeaveResultType === 'MONTHY_PRORATED'
        ? formatRange(
            result.calculationDetail.proratedLeaveAccrualPeriod.startDate,
            result.calculationDetail.proratedLeaveAccrualPeriod.endDate,
          )
        : null;

  const fullPeriodLabel =
    result.annualLeaveResultType === 'FULL'
      ? formatRange(
          result.calculationDetail.accrualPeriod.startDate,
          result.calculationDetail.accrualPeriod.endDate,
        )
      : null;

  const total = result.calculationDetail.totalLeaveDays;

  return (
    <section className="rounded-xl border border-neutral-200 p-5 md:p-6">
      {/* 타이틀 */}
      <h4 className="text-[14px] font-semibold text-neutral-800">계산 정보</h4>

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

      {/* 1) 공통 정보 (행 간격은 한 곳에서 통일) */}
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
          rightLabel="기준일"
          rightValue={result.referenceDate ?? '-'}
        />
        <Row label="연차 산정 기간" value={accrualPretty} />
      </div>

      {/* 2) 결과 요약 */}
      <div className="mt-4" style={{ display: 'grid', rowGap: ROW_GAP }}>
        {(result.annualLeaveResultType === 'FULL' ||
          result.annualLeaveResultType === 'ADJUSTED') && (
          <>
            <Row label="연차 합계" value={`${fmtDays(total)}일`} />
            <Row label="연차 사용 가능 기간" value={fullPeriodLabel ?? '-'} />
          </>
        )}

        {result.annualLeaveResultType === 'MONTHLY' && (
          <>
            <Row label="월차 합계" value={`${fmtDays(total)}일`} />
            <Row label="월차 사용 가능 기간" value={monthlyPeriodLabel ?? '-'} />
          </>
        )}

        {result.annualLeaveResultType === 'PRORATED' && (
          <>
            <Row label="비례연차 합계" value={`${fmtDays(total)}일`} />
            <Row label="비례연차 사용 가능 기간" value={proratedPeriodLabel ?? '-'} />
          </>
        )}

        {result.annualLeaveResultType === 'MONTHY_PRORATED' && (
          <>
            {/* 1행: 월차 합계 | 비례연차 합계 */}
            <PairRow
              leftLabel="월차 합계"
              leftValue={`${fmtDays(monthlySum ?? 0)}일`}
              rightLabel="비례연차 합계"
              rightValue={`${fmtDays(proratedSum ?? 0)}일`}
            />
            {/* 2행: 월차 사용 가능 기간 | 비례연차 사용 가능 기간 */}
            <PairRow
              leftLabel="월차 사용 가능 기간"
              leftValue={monthlyPeriodLabel ?? '-'}
              rightLabel="비례연차 사용 가능 기간"
              rightValue={proratedPeriodLabel ?? '-'}
            />
          </>
        )}

        <Row label="총 연차 합계" value={`${fmtDays(total)}일`} />
      </div>
    </section>
  );
}
