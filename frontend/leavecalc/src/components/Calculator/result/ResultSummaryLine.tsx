// src/components/Calculator/result/ResultSummaryLine.tsx
import type { CalcApiResult } from '../resultTypes';
import { fmtDateKR, typeLabelOf, getPeriods } from './resultUtils';

// 범위 포맷터 (없으면 '-')
function formatRange(a?: string | null, b?: string | null) {
  if (!a || !b) return '-';
  return `${a} ~ ${b}`;
}

// -----------------------------
// Flexible Chip
// -----------------------------
type Segment = {
  /** 화면에 보일 텍스트 */
  text: string;
  /** grid 컬럼 폭 (예: 80, '120px', 'min-content', 'max-content', '1fr' 등) */
  width?: number | string;
  /** 텍스트 정렬 */
  align?: 'left' | 'center' | 'right';
  /** 추가 클래스 */
  className?: string;
};

function toCssSize(v?: number | string) {
  if (v === undefined) return 'auto';
  return typeof v === 'number' ? `${v}px` : v;
}

/**
 * 라벨 | : | 세그먼트1 | 세그먼트2 | ...
 * - labelWidth: 라벨 영역 폭
 * - colonWidth: 콜론 영역 폭
 * - segments: 각 세그먼트(예: '몇일', '·', '기간')의 폭/정렬 개별 제어
 */
function Chip({
  label,
  segments,
  labelWidth = 140,
  colonWidth = 'min-content',
  className = '',
}: {
  label: string;
  segments: Segment[];
  labelWidth?: number | string;
  colonWidth?: number | string;
  className?: string;
}) {
  const cols = [toCssSize(labelWidth), toCssSize(colonWidth)]
    .concat(segments.map((s) => toCssSize(s.width)))
    .join(' ');

  return (
    <span
      className={[
        'inline-grid items-center rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-700',
        className,
      ].join(' ')}
      style={{ gridTemplateColumns: cols }}
    >
      {/* 아이콘+라벨 */}
      <span className="inline-flex items-center gap-1">
        <svg
          aria-hidden
          className="h-3.5 w-3.5 text-neutral-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1ZM4 8h12v6H4V8Z" />
        </svg>
        <span className="font-normal">{label}</span>
      </span>

      {/* 콜론 */}
      <span className="font-normal text-neutral-500">:</span>

      {/* 세그먼트들 */}
      {segments.map((seg, i) => (
        <span
          key={i}
          className={[
            'font-normal whitespace-nowrap',
            seg.align === 'right'
              ? 'text-right'
              : seg.align === 'center'
                ? 'text-center'
                : 'text-left',
            seg.className ?? '',
          ].join(' ')}
          style={{}}
        >
          {seg.text}
        </span>
      ))}
    </span>
  );
}

export default function ResultSummaryLine({ result }: { result: CalcApiResult }) {
  const total = result.calculationDetail.totalLeaveDays;
  const typeLabel = typeLabelOf(result.leaveType);
  const dateKR = fmtDateKR(result.referenceDate);

  const { accrualLabel, usableLabel } = getPeriods(result);
  const showUsable = Boolean(usableLabel);
  const showAccrual = Boolean(accrualLabel && accrualLabel !== usableLabel);

  const isCombo = result.leaveType === 'MONTHLY_AND_PRORATED';

  // 월차+비례연차일 때 각각의 사용 가능 기간 계산
  const monthlyUsableLabel = isCombo
    ? formatRange(
        result.calculationDetail.monthlyDetail?.availablePeriod?.startDate,
        result.calculationDetail.monthlyDetail?.availablePeriod?.endDate,
      )
    : null;

  const proratedUsableLabel = isCombo
    ? formatRange(
        result.calculationDetail.proratedDetail?.availablePeriod?.startDate,
        result.calculationDetail.proratedDetail?.availablePeriod?.endDate,
      )
    : null;

  // ✅ 각각의 "개수(일)" 추출
  const monthlyCount = isCombo
    ? (result.calculationDetail.monthlyDetail?.totalLeaveDays ?? 0)
    : null;

  const proratedCount = isCombo
    ? (result.calculationDetail.proratedDetail?.totalLeaveDays ?? 0)
    : null;

  return (
    <section className="rounded-xl border border-neutral-200 p-5 md:p-6">
      <div className="grid items-center gap-3 grid-cols-[minmax(0,1fr)_auto]">
        {/* 좌측: 캡션 + 문장 + 보조 정보 */}
        <div>
          {/* 캡션 + 유형 배지 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-neutral-500">계산 결과 : </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-sm text-[var(--first)]">
              {typeLabel}
            </span>
          </div>

          {/* 메인 문장 */}
          <p className="mt-1 text-base md:text-xl leading-snug text-neutral-900">
            <span className="text-neutral-600">{dateKR} 기준,</span> 사용할 수 있는 연차는 총{' '}
            <span className="mx-1 inline-block md:text-2xl font-extrabold tracking-tight leading-none text-[var(--first)] align-text-bottom -translate-y-[1px] md:-translate-y-[2px]">
              {total}일
            </span>{' '}
            입니다.
          </p>

          {/* 보조 정보: 사용 가능 기간 (콤보면 두 개, 아니면 하나) */}
          {(isCombo || showUsable || showAccrual) && (
            <div
              className={
                isCombo ? 'mt-2 flex flex-col gap-2' : 'mt-2 flex flex-wrap items-center gap-2'
              }
            >
              {isCombo ? (
                <>
                  {/* ✅ 월차: [몇일] · [기간] — 각 폭/정렬을 개별 제어 */}
                  <Chip
                    label="월차(일수·사용 가능 기간)"
                    labelWidth={180} // 라벨 폭
                    colonWidth="12px" // 콜론 폭 (위치 미세 조정)
                    className="w-[410px]"
                    segments={[
                      { text: `${monthlyCount ?? '-'}일`, width: 40, align: 'right' },
                      { text: '·', width: 15, align: 'center', className: 'text-neutral-400' },
                      { text: monthlyUsableLabel ?? '-', width: 20, align: 'right' },
                    ]}
                  />

                  {/* ✅ 비례연차: [몇일] · [기간] — 월차와 별도 세팅 가능 */}
                  <Chip
                    label="비례연차(일수·사용 가능 기간)"
                    labelWidth={180}
                    colonWidth="12px"
                    className="w-[410px]"
                    segments={[
                      { text: `${proratedCount ?? '-'}일`, width: 40, align: 'right' },
                      { text: '·', width: 15, align: 'center', className: 'text-neutral-400' },
                      { text: proratedUsableLabel ?? '-', width: 20, align: 'right' },
                    ]}
                  />
                </>
              ) : (
                showUsable && (
                  <Chip
                    label="사용 가능 기간"
                    labelWidth={110}
                    colonWidth="10px"
                    className="w-[300px]"
                    segments={[{ text: usableLabel!, width: '1fr', align: 'right' }]}
                  />
                )
              )}
            </div>
          )}
        </div>

        {/* 우측: 큰 숫자 강조 */}
        <div className="text-right shrink-0 justify-self-end">
          <div className="mt-1 mb-1 text-xs font-medium text-center text-neutral-500">
            연차 발생 일수
          </div>
          <div className="inline-block rounded-xl bg-blue-50 px-5 py-3">
            <div className="leading-none text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--first)]">
              {total}
              <span className="ml-1 text-base md:text-lg font-semibold text-[var(--first)]/90">
                일
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
