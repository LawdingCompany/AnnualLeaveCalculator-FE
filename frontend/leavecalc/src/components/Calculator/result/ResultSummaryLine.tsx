// src/components/Calculator/result/ResultSummaryLine.tsx
import type { CalcApiResult } from '../resultTypes';
import { fmtDays, fmtDateKR, typeLabelOf, getPeriods } from './resultUtils';

export default function ResultSummaryLine({ result }: { result: CalcApiResult }) {
  const total = result.calculationDetail.totalLeaveDays;
  const typeLabel = typeLabelOf(result.leaveType);
  const dateKR = fmtDateKR(result.referenceDate);

  const { accrualLabel, usableLabel } = getPeriods(result);
  const showUsable = Boolean(usableLabel);
  const showAccrual = Boolean(accrualLabel && accrualLabel !== usableLabel);

  const Chip = ({ label, value }: { label: string; value: string }) => (
    <span className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-[11px] text-neutral-700">
      <svg
        aria-hidden
        className="h-3.5 w-3.5 text-neutral-400"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1ZM4 8h12v6H4V8Z" />
      </svg>
      <span className="font-medium">{label}</span>
      <span className="mx-1 text-neutral-300">·</span>
      <span className="font-normal">{value}</span>
    </span>
  );

  return (
    <section className="rounded-xl border border-neutral-200 p-5 md:p-6">
      <div className="grid items-center gap-3 md:grid-cols-[1fr_auto]">
        {/* 좌측: 캡션 + 문장 + 보조 정보 */}
        <div>
          {/* 캡션 + 유형 배지 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-medium text-neutral-500">계산 결과 : </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
              {typeLabel}
            </span>
          </div>

          {/* 메인 문장 */}
          <p className="mt-1 text-base md:text-lg leading-snug text-neutral-900">
            <span className="text-neutral-600">{dateKR} 기준,</span> 사용할 수 있는 연차는 총{' '}
            <span className="mx-1 inline-block text-[18px] md:text-[22px] font-extrabold tracking-tight leading-none tabular-nums text-blue-700 align-text-bottom -translate-y-[1px] md:-translate-y-[2px]">
              {fmtDays(total)}일
            </span>{' '}
            입니다.
          </p>

          {/* 보조 정보: 사용 가능 기간 / 산정 기간 */}
          {(showUsable || showAccrual) && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {showUsable && <Chip label="사용 가능 기간 :" value={usableLabel!} />}
              {showAccrual && <Chip label="산정 기간 :" value={accrualLabel!} />}
            </div>
          )}
        </div>

        {/* 우측: 큰 숫자 강조 */}
        <div className="text-right">
          <div className="mt-1 mb-1 text-[11px] text-center text-neutral-500">
            총 부여 가능 일수
          </div>
          <div className="inline-block rounded-xl bg-blue-50 px-3 py-2">
            <div className="leading-none text-3xl md:text-4xl font-extrabold tracking-tight text-blue-700">
              {fmtDays(total)}
              <span className="ml-1 text-base md:text-lg font-semibold text-blue-700/90">일</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
