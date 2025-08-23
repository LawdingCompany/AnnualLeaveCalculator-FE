import { useCalcDispatch, useCalcState } from './context';

export default function ApplicationMode() {
  const s = useCalcState();
  const d = useCalcDispatch();

  return (
    <div className="grid grid-cols-[100px_1fr_100px_1fr] items-center gap-3">
      <label className="text-sm font-medium text-neutral-700">신청 방식</label>
      <div className="col-span-3 flex gap-2">
        <button
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 data-[active=true]:border-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
          data-active={s.calculationType === 1}
          onClick={() => d({ type: 'SET_CALCULATION_TYPE', payload: 1 })}
        >
          입사일
        </button>
        <button
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          data-active={s.calculationType === 2}
          onClick={() => d({ type: 'SET_CALCULATION_TYPE', payload: 2 })}
        >
          회계연도
        </button>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-neutral-600">회계연도</span>
          <input
            placeholder="MM-DD"
            className="w-[90px] rounded-md border border-neutral-300 px-3 py-2 text-center text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
            value={s.fiscalYear}
            onChange={(e) => d({ type: 'SET_FISCAL_YEAR', payload: e.target.value })}
            disabled={s.calculationType !== 2}
          />
        </div>
      </div>
    </div>
  );
}
