import { useState } from 'react';
import { useCalcDispatch, useCalcState } from './context';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';

// yyyy-mm-dd <-> Date
function toDate(str?: string): Date | null {
  if (!str) return null;
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = +m[1],
    mm = +m[2] - 1,
    d = +m[3];
  const dt = new Date(y, mm, d);
  return isNaN(dt.getTime()) ? null : dt;
}
function toStr(date: Date | null): string {
  if (!date) return '';
  const pad2 = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

const MAX_HOLIDAYS = 3;

export default function CompanyHolidaysSection() {
  const s = useCalcState();
  const d = useCalcDispatch();

  const hireDateObj = toDate(s.hireDate);
  const refDateObj = toDate(s.referenceDate);

  // 작성용 로컬 상태
  const [draftDate, setDraftDate] = useState<Date | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enabled = s.companyHolidaysEnabled; // ✅ 토글
  const count = s.companyHolidays.length;
  const isFull = count >= MAX_HOLIDAYS;

  const validate = () => {
    setError(null);
    if (!draftDate) return setError('날짜를 선택해주세요.'), false;

    // 입사일~기준일 범위 내(둘 다 있을 때만 강제)
    if (hireDateObj && draftDate < hireDateObj) {
      return setError('휴일은 입사일 이후만 선택할 수 있습니다.'), false;
    }
    if (refDateObj && draftDate > refDateObj) {
      return setError('휴일은 기준일 이전만 선택할 수 있습니다.'), false;
    }

    const draftStr = toStr(draftDate);
    // 중복 방지: 수정 중이면 자기 자신 제외
    for (let i = 0; i < s.companyHolidays.length; i++) {
      if (editIndex !== null && i === editIndex) continue;
      if (s.companyHolidays[i] === draftStr) {
        setError('이미 같은 날짜가 등록되어 있습니다.');
        return false;
      }
    }
    return true;
  };

  const clearDraft = () => {
    setDraftDate(null);
    setEditIndex(null);
    setError(null);
  };

  const handleAddOrUpdate = () => {
    if (editIndex === null && isFull) {
      setError(`최대 ${MAX_HOLIDAYS}개까지만 등록할 수 있습니다.`);
      return;
    }
    if (!validate()) return;

    const val = toStr(draftDate);
    if (editIndex === null) {
      d({ type: 'SET_COMPANY_HOLIDAYS', payload: [...s.companyHolidays, val] });
    } else {
      const next = s.companyHolidays.slice();
      next[editIndex] = val;
      d({ type: 'SET_COMPANY_HOLIDAYS', payload: next });
    }
    clearDraft();
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      d({ type: 'SET_COMPANY_HOLIDAYS_ENABLED', payload: true });
    } else {
      d({ type: 'SET_COMPANY_HOLIDAYS_ENABLED', payload: false });
      d({ type: 'SET_COMPANY_HOLIDAYS', payload: [] }); // 비우기
      clearDraft();
    }
  };

  return (
    <div className="grid gap-2">
      {/* 토글 + 카운터 */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300"
            checked={enabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          회사 휴일
        </label>
        {enabled && (
          <span className="text-xs text-neutral-500">
            {count}/{MAX_HOLIDAYS}
          </span>
        )}
      </div>

      {/* 본문: 체크 ON일 때만 */}
      {enabled && (
        <div className="rounded-lg border border-neutral-200 p-3 space-y-3">
          {/* 작성 영역: 버튼 위치는 원래 3열 유지 */}
          <div className="grid grid-cols-[max-content_1fr_max-content] items-center gap-2">
            <span className="text-sm text-neutral-600">회사 휴일</span>

            {/* 2열: DatePicker + 안내문을 한 칸에 */}
            <div className="flex items-center gap-2">
              <CustomDatePicker
                selected={draftDate}
                onChange={(dt) => setDraftDate(dt)}
                placeholderText="YYYY-MM-DD"
                className="max-w-[150px]"
                minDate={hireDateObj ?? undefined} // 내부에서 2017-05-30으로 상향 보정
                maxDate={refDateObj ?? undefined}
              />
              <small className="text-[12px] text-neutral-500 whitespace-nowrap ml-2">
                * 회사 지정 휴일은 하루 단위로 계산에 반영됩니다.
              </small>
            </div>

            {/* 3열: 추가/수정 버튼 (원래 위치 유지) */}
            <button
              type="button"
              onClick={handleAddOrUpdate}
              className="ml-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-neutral-300"
              disabled={!draftDate || (editIndex === null && isFull)}
              title={
                editIndex === null && isFull ? `최대 ${MAX_HOLIDAYS}개까지 추가 가능합니다.` : ''
              }
            >
              {editIndex === null ? '추가하기' : '수정 완료'}
            </button>
          </div>

          {/* 에러 / 안내 */}
          {error ? (
            <div className="text-xs text-red-600">{error}</div>
          ) : (
            isFull && (
              <div className="text-xs text-neutral-500">
                * 최대 {MAX_HOLIDAYS}개까지 등록 가능합니다.
              </div>
            )
          )}

          {/* 목록 */}
          <div className="grid gap-2">
            {s.companyHolidays.length === 0 ? (
              <div className="text-xs text-neutral-500">
                * 아직 등록된 회사 휴일이 없습니다. 위에서 날짜 선택 후 ‘추가하기’를 눌러주세요.
              </div>
            ) : (
              s.companyHolidays.map((d0, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_max-content_max-content_max-content] items-center gap-2 rounded-md border border-neutral-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-neutral-800">{d0}</div>
                  </div>
                  <button
                    type="button"
                    className="text-xs underline"
                    onClick={() => {
                      setDraftDate(toDate(d0));
                      setEditIndex(idx);
                      setError(null);
                    }}
                  >
                    편집
                  </button>
                  {/* ✅ 구분선 추가 */}
                  <span className="text-neutral-300">|</span>
                  <button
                    type="button"
                    className="text-xs text-red-600 underline"
                    onClick={() => {
                      const next = s.companyHolidays.filter((_, i) => i !== idx);
                      d({ type: 'SET_COMPANY_HOLIDAYS', payload: next });
                      if (editIndex === idx) clearDraft();
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
