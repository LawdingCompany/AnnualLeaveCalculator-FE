// ApplicationMode.tsx
import { useCalcDispatch, useCalcState } from './context';
import SelectBox from '@components/ui/SelectBox';

const SEG_BTN = [
  'h-10 px-3 rounded-md border text-md',
  'bg-white text-neutral-700 border-[#e2e8f0]', // 회색 테두리
  'hover:bg-neutral-50', // 호버
  'focus:outline-none focus:border-blue-600', // 포커스 테두리
  'data-[active=true]:border-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700',
].join(' ');

function monthFromFiscalYear(fy: string): string {
  const [mm] = (fy ?? '01-01').split('-');
  return /^\d{2}$/.test(mm) ? mm : '01';
}

export default function ApplicationMode() {
  const s = useCalcState();
  const d = useCalcDispatch();
  const fyDisabled = s.calculationType !== 2;
  const currentMonth = monthFromFiscalYear(s.fiscalYear);

  const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
    const mm = String(i + 1).padStart(2, '0');
    return { value: mm, label: `${i + 1}` };
  });

  return (
    // 라벨 칼럼은 내용폭, 버튼 영역은 200px, 오른쪽 라벨은 내용폭, 입력영역은 1fr
    <div className="grid grid-cols-[max-content_200px_max-content_1fr] items-center gap-x-7">
      {/* 1열: 라벨 */}
      <label className="font-medium text-neutral-700 whitespace-nowrap">산정 방식</label>

      {/* 2열: 버튼 그룹 */}
      <div className="flex items-center gap-2" role="group" aria-label="산정 방식">
        <button
          type="button"
          className={SEG_BTN}
          data-active={s.calculationType === 1}
          aria-pressed={s.calculationType === 1}
          onClick={() => d({ type: 'SET_CALCULATION_TYPE', payload: 1 })}
        >
          입사일
        </button>
        <button
          type="button"
          className={SEG_BTN}
          data-active={s.calculationType === 2}
          aria-pressed={s.calculationType === 2}
          onClick={() => d({ type: 'SET_CALCULATION_TYPE', payload: 2 })}
        >
          회계연도
        </button>
      </div>

      {/* 3열: 라벨 */}
      <span className="text-md font-medium text-neutral-700 whitespace-nowrap mr-2">
        회계연도 시작일
      </span>

      {/* 4열: 시작일 입력 그룹 */}
      <div className="flex items-center gap-2">
        <SelectBox
          value={currentMonth}
          onChange={(mm) => d({ type: 'SET_FISCAL_YEAR', payload: `${mm}-01` })}
          options={MONTH_OPTIONS}
          disabled={fyDisabled}
          className="w-[44px]" // 컨테이너 폭
          buttonClassName="h-9" // 버튼 높이 통일
          placeholder="월"
        />
        <span className="text-md font-medium text-neutral-600">월</span>

        {/* 고정 1일 (disable) */}
        <input
          value="1"
          disabled
          aria-label="회계연도 시작일(일)"
          className="w-[44px] h-9 rounded-md border px-3 py-2 text-md font-medium text-center
                     border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed select-none"
        />
        <span className="text-md font-medium text-neutral-600">일</span>
      </div>
    </div>
  );
}
