// src/components/Calculator/result/ResultSummaryLine.tsx
import type { CalcApiResult } from '../resultTypes';
import { fmtDateKR, typeLabelOf, getPeriods } from './resultUtils';

// 범위 포맷터 (없으면 '-')
function formatRange(a?: string | null, b?: string | null) {
  if (!a || !b) return '-';
  return `${a} ~ ${b}`;
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

  const Chip = ({
    label,
    value,
    width, // 예: 'w-[320px]' 또는 'w-[220px] min-w-[240px]'
    colonAt = 140, // ← 여기(px)를 바꾸면 ':' 위치가 바뀜
    className = '',
  }: {
    label: string;
    value: string;
    width?: string;
    colonAt?: number; // px 단위
    className?: string;
  }) => (
    <span
      className={[
        'inline-grid items-center rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-700',
        width ?? '',
        className,
      ].join(' ')}
      style={{
        // 아이콘+라벨 영역 | ':' | 값 영역
        gridTemplateColumns: `${colonAt}px min-content 1fr`,
      }}
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

      {/* 콜론(고정 위치) */}
      <span className="font-normal text-neutral-500">:</span>

      {/* 값(오른쪽 정렬, 줄바꿈 방지) */}
      <span className="font-normal text-right tabular-nums whitespace-nowrap">{value}</span>
    </span>
  );

  return (
    <section className="rounded-xl border border-neutral-200 p-5 md:p-6">
      <div className="grid items-center gap-3 grid-cols-[minmax(0,1fr)_auto]">
        {/* 좌측: 캡션 + 문장 + 보조 정보 */}
        <div>
          {/* 캡션 + 유형 배지 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-neutral-500">계산 결과 : </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-sm text-blue-700">
              {typeLabel}
            </span>
          </div>

          {/* 메인 문장 */}
          <p className="mt-1 text-base md:text-xl leading-snug text-neutral-900">
            <span className="text-neutral-600">{dateKR} 기준,</span> 사용할 수 있는 연차는 총{' '}
            <span className="mx-1 inline-block md:text-2xl font-extrabold tracking-tight leading-none tabular-nums text-blue-700 align-text-bottom -translate-y-[1px] md:-translate-y-[2px]">
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
                  {/* 콤보: 넓게, 콜론 140px 지점 */}
                  <Chip
                    label="월차 사용 가능 기간"
                    value={monthlyUsableLabel ?? '-'}
                    width="w-[320px]"
                    colonAt={140}
                  />
                  <Chip
                    label="비례연차 사용 가능 기간"
                    value={proratedUsableLabel ?? '-'}
                    width="w-[320px]"
                    colonAt={140}
                  />
                </>
              ) : (
                showUsable && (
                  <Chip
                    label="사용 가능 기간"
                    value={usableLabel}
                    width="w-[270px]" // 내용 길면 자연 확장
                    colonAt={92} // ← 여기 숫자만 바꿔서 ':' 위치 미세조정
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
            <div className="leading-none text-3xl md:text-4xl font-extrabold tracking-tight text-blue-700">
              {total}
              <span className="ml-1 text-base md:text-lg font-semibold text-blue-700/90">일</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
