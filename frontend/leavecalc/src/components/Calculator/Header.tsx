// Header.tsx
import { useCalcState } from './context';

export default function Header() {
  const s = useCalcState();
  const isResult = s.view === 'result' && s.result;

  if (!isResult) {
    // 기존 폼 헤더
    return (
      <header className="space-y-2">
        <h2 className="text-2xl font-extrabold">연차 계산기</h2>
        <p className="text-[13px] leading-5 text-neutral-500">
          당신의 진짜 연차 일수는 얼마일까요? 특이사항까지 고려한 정확한 계산 결과를 지금 바로
          확인하세요!
        </p>
        <p className="text-[11px] text-neutral-400">
          ※ 계산결과는 참고용이며, 실제 회사 규정과 다를 수 있습니다.
        </p>
      </header>
    );
  }

  // ✅ 결과용 헤더
  const r = s.result!;
  const typeLabel = r.annualLeaveResultType === 'FULL' ? '정기 연차' : '월차 누적';
  const total =
    r.annualLeaveResultType === 'FULL'
      ? r.calculationDetail.totalLeaveDays
      : r.calculationDetail.totalLeaveDays;

  const period =
    r.annualLeaveResultType === 'FULL' && r.calculationDetail.accrualPeriod
      ? `${r.calculationDetail.accrualPeriod.startDate} ~ ${r.calculationDetail.accrualPeriod.endDate}`
      : null;

  return (
    <header className="space-y-2">
      <h2 className="text-2xl font-extrabold">연차 결과 : {typeLabel}</h2>
      <p className="text-[13px] leading-5 text-neutral-700">
        당신의 총 연차는 <b className="text-blue-700">{total.toFixed(1)}일</b> 입니다.
        {period && <span className="ml-2 text-neutral-500">사용 가능 기간: {period}</span>}
      </p>
      <p className="text-[11px] text-neutral-400">
        ※ 계산결과는 참고용이며, 실제 회사 규정과 다를 수 있습니다.
      </p>
    </header>
  );
}
