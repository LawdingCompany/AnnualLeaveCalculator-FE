import { useCalcDispatch, useCalcState } from './context';
import { PERIOD_LABELS, type NonWorkingSubtype } from './types';

// ✅ key 타입 문제 피하려고 숫자 배열로 명시
const SUBTYPE_OPTIONS: readonly NonWorkingSubtype[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
];

export default function SpecialPeriodsSection() {
  const s = useCalcState();
  const d = useCalcDispatch();

  return (
    <div className="grid grid-cols-[100px_1fr] items-center gap-3">
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-neutral-300"
          checked={s.nonWorkingPeriods.length > 0}
          readOnly
        />
        특이사항이 있는 기간
      </div>

      <div className="grid gap-3 rounded-lg border border-neutral-200 p-3">
        {s.nonWorkingPeriods.map((p, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[60px_1fr_80px_1fr_80px_1fr_auto] items-center gap-2"
          >
            <span className="text-sm text-neutral-600">사유</span>
            <select
              className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-blue-600"
              value={p.subtype}
              onChange={(e) =>
                d({
                  type: 'UPDATE_PERIOD',
                  index: idx,
                  payload: { subtype: Number(e.target.value) as NonWorkingSubtype },
                })
              }
            >
              {SUBTYPE_OPTIONS.map((code) => (
                <option key={code} value={code}>
                  {PERIOD_LABELS[code]}
                </option>
              ))}
            </select>

            <span className="text-sm text-neutral-600">시작일</span>
            <input
              placeholder="YYYY-MM-DD"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
              value={p.startDate}
              onChange={(e) =>
                d({ type: 'UPDATE_PERIOD', index: idx, payload: { startDate: e.target.value } })
              }
            />

            <span className="text-sm text-neutral-600">종료일</span>
            <input
              placeholder="YYYY-MM-DD"
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
              value={p.endDate}
              onChange={(e) =>
                d({ type: 'UPDATE_PERIOD', index: idx, payload: { endDate: e.target.value } })
              }
            />

            <button
              className="text-xs text-red-600 underline"
              onClick={() => d({ type: 'REMOVE_PERIOD', index: idx })}
            >
              삭제
            </button>
          </div>
        ))}

        <div className="flex justify-between">
          <button
            className="text-xs underline"
            onClick={() => d({ type: 'ADD_PERIOD', payload: {} })}
          >
            + 항목 추가
          </button>
          <small className="text-[12px] text-neutral-500">
            공휴일/주말은 소정근로일에 포함되지 않습니다.
          </small>
        </div>
      </div>
    </div>
  );
}
