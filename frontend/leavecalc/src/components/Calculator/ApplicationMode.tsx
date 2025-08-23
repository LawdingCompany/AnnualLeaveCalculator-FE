import { useCalcDispatch, useCalcState } from './context';
import MonthSelect from '@components/ui/MonthSelect';

function monthFromFiscalYear(fy: string): string {
  const [mm] = (fy ?? '01-01').split('-');
  return /^\d{2}$/.test(mm) ? mm : '01';
}

export default function ApplicationMode() {
  const s = useCalcState();
  const d = useCalcDispatch();
  const fyDisabled = s.calculationType !== 2;
  const currentMonth = monthFromFiscalYear(s.fiscalYear);

  return (
    // ✅ 라벨 컬럼을 max-content로 → 라벨 글자 바로 오른쪽에서 'gap-x-4'만큼 띄움
    <div className="grid grid-cols-[max-content_1fr_max-content_1fr] items-center gap-x-6">
      {/* 1열: 라벨 */}
      <label className="text-sm font-medium text-neutral-700 whitespace-nowrap">신청 방식</label>

      {/* 2열: 버튼 그룹 (1fr) */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50
                     data-[active=true]:border-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
          data-active={s.calculationType === 1}
          onClick={() => d({ type: 'SET_CALCULATION_TYPE', payload: 1 })}
        >
          입사일
        </button>
        <button
          type="button"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50
                     data-[active=true]:border-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
          data-active={s.calculationType === 2}
          onClick={() => d({ type: 'SET_CALCULATION_TYPE', payload: 2 })}
        >
          회계연도
        </button>
      </div>

      {/* 3열: 라벨 */}
      <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
        회계연도 시작일
      </span>

      {/* 4열: 시작일 입력 그룹 (1fr) */}
      <div className="flex items-center gap-2">
        <MonthSelect
          value={currentMonth} // "01" ~ "12"
          onChange={(mm) => d({ type: 'SET_FISCAL_YEAR', payload: `${mm}-01` })}
          disabled={fyDisabled}
          className="w-[60px] text-center [text-align-last:center] [&>option]:text-center"
        />
        <span className="text-sm text-neutral-600">월</span>
        <input
          value="1"
          disabled
          aria-label="회계연도 시작일"
          className="w-[40px] rounded-md border px-3 py-2 text-sm text-center border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed select-none"
        />
        <span className="text-sm text-neutral-600">일</span>
      </div>
    </div>
  );
}
