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

// 고정 경계
const HIRE_MIN = new Date(1980, 0, 1); // 1980-01-01
const LAW_MIN_REF = new Date(2017, 4, 31); // 2017-05-31
const REF_MAX = new Date(2035, 11, 31); // 2035-12-31

export default function HireAndReference() {
  const s = useCalcState();
  const d = useCalcDispatch();

  const hireDateObj = toDate(s.hireDate);
  const refDateObj = toDate(s.referenceDate);

  // 오늘 00:00 (미래 선택 방지)
  const now = new Date();
  const TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // ✅ 입사일: 최대 오늘, 단 기준일이 오늘보다 더 이르면 기준일까지로 자동 제한
  const hireMax = refDateObj ? (refDateObj < TODAY ? refDateObj : TODAY) : TODAY;

  // ✅ 기준일: 최소 (입사일이 2017-05-31 이후면 입사일, 아니면 2017-05-31), 최대 2035-12-31
  const refMin =
    hireDateObj && hireDateObj.getTime() > LAW_MIN_REF.getTime() ? hireDateObj : LAW_MIN_REF;

  return (
    <div className="hire-and-ref grid grid-cols-[max-content_198px_max-content_1fr] items-center gap-x-8">
      {/* 입사일 */}
      <label className="text-md font-medium text-neutral-700 whitespace-nowrap">
        입사일 <span className="text-red-500">*</span>
      </label>
      <CustomDatePicker
        selected={hireDateObj}
        onChange={(dt) => d({ type: 'SET_HIRE_DATE', payload: toStr(dt) })}
        dateFormat="YYYY-MM-DD"
        placeholderText="YYYY.MM.DD"
        className={`max-w-[150px] rounded-md border-2 ${
          s.hireDate ? 'border-neutral-300' : 'border-red-400'
        } focus:outline-none focus:ring-0 focus:border-neutral-300`}
        minDate={HIRE_MIN} // ✅ 1980-01-01부터
        maxDate={hireMax} // ✅ 항상 오늘 이전, 기준일 선택 시 그 이전
      />

      {/* 기준일 */}
      <label className="text-md font-medium text-neutral-700 whitespace-nowrap">
        계산 기준일 <span className="text-red-500">*</span>
      </label>
      <CustomDatePicker
        selected={refDateObj}
        onChange={(dt) => d({ type: 'SET_REFERENCE_DATE', payload: toStr(dt) })}
        dateFormat="YYYY-MM-DD"
        placeholderText="YYYY.MM.DD"
        className={`max-w-[150px] ml-5 rounded-md border-2 ${
          s.referenceDate ? 'border-neutral-300' : 'border-red-400'
        } focus:outline-none focus:ring-0 focus:border-neutral-300`}
        minDate={refMin} // ✅ 2017-05-31 또는 입사일(입사일이 더 늦으면)
        maxDate={REF_MAX} // ✅ 2035년까지
      />
    </div>
  );
}
