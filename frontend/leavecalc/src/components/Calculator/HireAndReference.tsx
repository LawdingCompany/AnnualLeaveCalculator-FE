// HireAndReference.tsx
import { useCalcDispatch, useCalcState } from './context';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';

function toDate(str: string | undefined): Date | null {
  if (!str) return null;
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = Number(m[1]),
    mm = Number(m[2]) - 1,
    d = Number(m[3]);
  const dt = new Date(y, mm, d);
  return isNaN(dt.getTime()) ? null : dt;
}

function toStr(date: Date | null): string {
  if (!date) return '';
  const pad2 = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export default function HireAndReference() {
  const s = useCalcState();
  const d = useCalcDispatch();

  const hireDateObj = toDate(s.hireDate);
  const refDateObj = toDate(s.referenceDate);

  return (
    <div className="grid grid-cols-[max-content_198px_max-content_1fr] items-center gap-x-8">
      {/* 입사일 */}
      <label className="text-md font-medium text-neutral-700 whitespace-nowrap">
        입사일 <span className="text-red-500">*</span>
      </label>
      <CustomDatePicker
        selected={hireDateObj}
        onChange={(dt) => d({ type: 'SET_HIRE_DATE', payload: toStr(dt) })}
        dateFormat="YYYY-MM-DD"
        placeholderText="YYYY-MM-DD"
        className={`max-w-[150px] rounded-md border-2 ${
          s.hireDate ? 'border-neutral-300' : 'border-red-400'
        } focus:outline-none focus:ring-0 focus:border-neutral-300`}
        // 선택적으로 기준일 이후 선택 제한
        maxDate={refDateObj ?? undefined}
      />

      {/* 기준일 */}
      <label className="text-md font-medium text-neutral-700 whitespace-nowrap">
        계산 기준일 <span className="text-red-500">*</span>
      </label>
      <CustomDatePicker
        selected={refDateObj}
        onChange={(dt) => d({ type: 'SET_REFERENCE_DATE', payload: toStr(dt) })}
        dateFormat="YYYY-MM-DD"
        placeholderText="YYYY-MM-DD"
        className={`max-w-[150px] ml-5 rounded-md border-2 ${
          s.referenceDate ? 'border-neutral-300' : 'border-red-400'
        } focus:outline-none focus:ring-0 focus:border-neutral-300`}
        // 선택적으로 입사일 이전 선택 제한
        minDate={hireDateObj ?? undefined}
      />
    </div>
  );
}
