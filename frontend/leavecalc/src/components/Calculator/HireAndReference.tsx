import { useCalcDispatch, useCalcState } from './context';

export default function HireAndReference() {
  const s = useCalcState();
  const d = useCalcDispatch();

  return (
    <div className="grid grid-cols-[100px_1fr_100px_1fr] items-center gap-3">
      <label className="text-sm font-medium text-neutral-700">입사일</label>
      <input
        placeholder="YYYY-MM-DD"
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
        value={s.hireDate}
        onChange={(e) => d({ type: 'SET_HIRE_DATE', payload: e.target.value })}
      />
      <span className="text-sm font-medium text-neutral-700">기준 기준일</span>
      <input
        placeholder="YYYY-MM-DD"
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
        value={s.referenceDate}
        onChange={(e) => d({ type: 'SET_REFERENCE_DATE', payload: e.target.value })}
      />
    </div>
  );
}
