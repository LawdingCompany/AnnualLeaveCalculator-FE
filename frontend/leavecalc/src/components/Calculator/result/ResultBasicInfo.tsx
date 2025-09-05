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
  return `${a}\u00A0~\u00A0${b}`;
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

/** 4셀: 좌(라벨/값) + 우(라벨/값) 한 행 */
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

  // 공통 기간 요약
  const { accrualLabel, usableLabel } = getPeriods(result);
  const accrualPretty = (() => {
    if (!accrualLabel || accrualLabel === '-') return '-';
    const [a, , b] = accrualLabel.split(' ');
    return formatRange(a, b);
  })();

  // 유형별 사용 가능 기간 라벨
  const monthlyUsable =
    result.leaveType === 'MONTHLY'
      ? usableLabel
      : result.leaveType === 'MONTHLY_AND_PRORATED'
        ? formatRange(
            result.calculationDetail.monthlyDetail.availablePeriod.startDate,
            result.calculationDetail.monthlyDetail.availablePeriod.endDate,
          )
        : null;

  const proratedUsable =
    result.leaveType === 'PRORATED'
      ? usableLabel
      : result.leaveType === 'MONTHLY_AND_PRORATED'
        ? formatRange(
            result.calculationDetail.proratedDetail.availablePeriod.startDate,
            result.calculationDetail.proratedDetail.availablePeriod.endDate,
          )
        : null;

  const annualUsable =
    result.leaveType === 'ANNUAL'
      ? formatRange(
          result.calculationDetail.availablePeriod.startDate,
          result.calculationDetail.availablePeriod.endDate,
        )
      : null;

  // 합계
  const total = result.calculationDetail.totalLeaveDays;

  // 콤보 타입 합계 분해
  const monthlySum =
    result.leaveType === 'MONTHLY_AND_PRORATED'
      ? result.calculationDetail.monthlyDetail.totalLeaveDays
      : undefined;
  const proratedSum =
    result.leaveType === 'MONTHLY_AND_PRORATED'
      ? result.calculationDetail.proratedDetail.totalLeaveDays
      : undefined;

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
          rightLabel="기준일"
          rightValue={result.referenceDate ?? '-'}
        />
        <Row label="연차 산정 기간" value={accrualPretty} />
      </div>

      {/* 2) 결과 요약 */}
      <div className="mt-4" style={{ display: 'grid', rowGap: ROW_GAP }}>
        {result.leaveType === 'ANNUAL' && (
          <>
            <Row label="연차 합계" value={`${fmtDays(total)}일`} />
            <Row label="연차 사용 가능 기간" value={annualUsable ?? '-'} />
          </>
        )}

        {result.leaveType === 'MONTHLY' && (
          <>
            <Row label="월차 합계" value={`${fmtDays(total)}일`} />
            <Row label="월차 사용 가능 기간" value={monthlyUsable ?? '-'} />
          </>
        )}

        {result.leaveType === 'PRORATED' && (
          <>
            <Row label="비례연차 합계" value={`${fmtDays(total)}일`} />
            <Row label="비례연차 사용 가능 기간" value={proratedUsable ?? '-'} />
          </>
        )}

        {result.leaveType === 'MONTHLY_AND_PRORATED' && (
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
              leftValue={monthlyUsable ?? '-'}
              rightLabel="비례연차 사용 가능 기간"
              rightValue={proratedUsable ?? '-'}
            />
          </>
        )}

        <Row label="총 연차 합계" value={`${fmtDays(total)}일`} />
      </div>
    </section>
  );
}
