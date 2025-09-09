// SpecialPeriodsSection.tsx
import { useState } from 'react';
import { useCalcDispatch, useCalcState } from './context';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';
import { PERIOD_LABELS, type NonWorkingSubtype } from './types';
import ReasonSelect from '@components/ui/ReasonSelect';

const MAX_PERIODS = 3;

// 사유 코드(1~16)
const SUBTYPE_OPTIONS: readonly NonWorkingSubtype[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
];

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
function daysInclusive(a: string, b: string) {
  const s = toDate(a)?.getTime() ?? 0,
    e = toDate(b)?.getTime() ?? 0;
  return s && e ? Math.floor((e - s) / 86400000) + 1 : 0;
}
function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  const as = toDate(aStart)?.getTime() ?? 0;
  const ae = toDate(aEnd)?.getTime() ?? 0;
  const bs = toDate(bStart)?.getTime() ?? 0;
  const be = toDate(bEnd)?.getTime() ?? 0;
  if (!as || !ae || !bs || !be) return false;
  return as <= be && bs <= ae; // 겹치면 true (포함 비교)
}

export default function SpecialPeriodsSection() {
  const s = useCalcState();
  const d = useCalcDispatch();

  const hireDateObj = toDate(s.hireDate);
  const refDateObj = toDate(s.referenceDate);

  // 작성 컴포저 로컬 상태
  const [draftSubtype, setDraftSubtype] = useState<NonWorkingSubtype | null>(null);
  const [draftStart, setDraftStart] = useState<Date | null>(null);
  const [draftEnd, setDraftEnd] = useState<Date | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enabled = s.specialPeriodsEnabled;
  const count = s.nonWorkingPeriods.length;
  const isFull = count >= MAX_PERIODS;

  // 유효성 검사
  const validate = () => {
    setError(null);
    if (!draftSubtype) return setError('사유를 선택해주세요.'), false;
    if (!draftStart || !draftEnd) return setError('시작일과 종료일을 선택해주세요.'), false;
    if (draftStart > draftEnd) return setError('시작일은 종료일보다 이후일 수 없습니다.'), false;
    if (hireDateObj && draftStart < hireDateObj)
      return setError('시작일은 입사일 이후여야 합니다.'), false;
    if (refDateObj && draftEnd > refDateObj)
      return setError('종료일은 기준일 이전이어야 합니다.'), false;

    // 기존과 겹침 방지 (수정 중이면 자기 자신 제외)
    const candidateS = toStr(draftStart);
    const candidateE = toStr(draftEnd);
    for (let i = 0; i < s.nonWorkingPeriods.length; i++) {
      if (editIndex !== null && i === editIndex) continue;
      const it = s.nonWorkingPeriods[i];
      if (overlaps(candidateS, candidateE, it.startDate, it.endDate)) {
        setError('이미 등록된 특이기간과 겹칩니다.');
        return false;
      }
    }
    return true;
  };

  const clearDraft = () => {
    setDraftSubtype(null);
    setDraftStart(null);
    setDraftEnd(null);
    setEditIndex(null);
    setError(null);
  };

  const handleAddOrUpdate = () => {
    // 추가 시에만 개수 제한 검사
    if (editIndex === null && isFull) {
      setError(`최대 ${MAX_PERIODS}개까지만 등록할 수 있습니다.`);
      return;
    }
    if (!validate()) return;

    const payload = {
      subtype: draftSubtype as NonWorkingSubtype,
      startDate: toStr(draftStart),
      endDate: toStr(draftEnd),
    };

    // ✅ 편집 중이었던 원본이 삭제되어 인덱스가 유효하지 않다면 안전하게 "추가"로 처리
    if (editIndex === null) {
      d({ type: 'ADD_PERIOD', payload });
    } else if (editIndex < 0 || editIndex >= s.nonWorkingPeriods.length) {
      d({ type: 'ADD_PERIOD', payload });
    } else {
      d({ type: 'UPDATE_PERIOD', index: editIndex, payload });
    }

    clearDraft();
  };

  // ✅ 삭제 시 편집 인덱스 보정/해제
  const handleRemove = (idx: number) => {
    if (editIndex !== null) {
      if (idx === editIndex) {
        // 편집 중인 항목 자체를 삭제 → 편집 상태 해제
        clearDraft();
      } else if (idx < editIndex) {
        // 앞쪽 항목이 삭제되어 인덱스가 한 칸 당겨짐 → 보정
        setEditIndex(editIndex - 1);
      }
    }
    d({ type: 'REMOVE_PERIOD', index: idx });
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      d({ type: 'SET_SPECIAL_PERIODS_ENABLED', payload: true });
    } else {
      d({ type: 'SET_SPECIAL_PERIODS_ENABLED', payload: false });
      d({ type: 'CLEAR_PERIODS' });
      clearDraft();
    }
  };

  const reasonOptions = SUBTYPE_OPTIONS.map((code) => ({
    value: code,
    label: PERIOD_LABELS[code],
  }));

  return (
    <div className="grid gap-2">
      {/* 토글 + 카운터 */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-md font-medium text-neutral-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-neutral-300"
            checked={enabled}
            onChange={(e) => handleToggle(e.target.checked)}
          />
          특이사항이 있는 기간
        </label>
        {enabled && (
          <span className="text-sm text-neutral-500">
            {count}/{MAX_PERIODS}
          </span>
        )}
      </div>

      {/* 본문: 체크 ON일 때만 */}
      {enabled && (
        <div className="rounded-lg border border-neutral-200 p-3 space-y-3">
          {/* 작성 컴포저 */}
          <div className="grid grid-cols-[max-content_1fr_max-content_1fr_max-content_1fr_max-content] items-center gap-2">
            <span className="text-sm text-neutral-600 ml-1 mr-1">사유</span>
            <ReasonSelect
              value={draftSubtype ?? null}
              onChange={(v) => setDraftSubtype(v as NonWorkingSubtype)}
              options={reasonOptions}
              disabled={editIndex === null && isFull}
              className="min-w-[160px]"
            />
            <span className="text-sm text-neutral-600 ml-6 mr-1">시작일</span>
            <CustomDatePicker
              selected={draftStart}
              onChange={(dt) => setDraftStart(dt)}
              placeholderText="YYYY-MM-DD"
              className="max-w-[150px]"
              minDate={hireDateObj ?? undefined}
              maxDate={draftEnd ?? refDateObj ?? undefined}
            />

            <span className="text-sm text-neutral-600 mr-1">종료일</span>
            <CustomDatePicker
              selected={draftEnd}
              onChange={(dt) => setDraftEnd(dt)}
              placeholderText="YYYY-MM-DD"
              className="max-w-[150px]"
              minDate={draftStart ?? hireDateObj ?? undefined}
              maxDate={refDateObj ?? undefined}
            />

            <button
              type="button"
              onClick={handleAddOrUpdate}
              className="ml-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-neutral-300"
              disabled={!draftSubtype || !draftStart || !draftEnd || (editIndex === null && isFull)}
              title={
                editIndex === null && isFull ? `최대 ${MAX_PERIODS}개까지 추가 가능합니다.` : ''
              }
            >
              {editIndex === null ? '추가하기' : '수정하기'}
            </button>
          </div>

          {/* 에러 메시지 / 안내 */}
          {error ? (
            <div className="text-xs text-red-600">{error}</div>
          ) : (
            isFull && (
              <div className="text-xs text-neutral-500">
                * 최대 {MAX_PERIODS}개까지 등록 가능합니다. 기존 항목을 삭제하거나 수정하세요.
              </div>
            )
          )}

          {/* 목록 */}
          <div className="grid gap-2">
            {s.nonWorkingPeriods.length === 0 ? (
              <div className="text-xs text-neutral-500">
                * 아직 등록된 특이기간이 없습니다. 위에서 입력 후 ‘추가하기’를 눌러주세요.
              </div>
            ) : (
              s.nonWorkingPeriods.map((p, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_max-content_max-content_max-content] items-center gap-2 rounded-md border text-sm border-neutral-200 px-3 py-2"
                >
                  <div className="min-w-0">
                    <div className=" text-neutral-800 truncate">{PERIOD_LABELS[p.subtype]}</div>
                    <div className="text-xs text-neutral-500">
                      {p.startDate} ~ {p.endDate} · {daysInclusive(p.startDate, p.endDate)}일
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-xs underline"
                    onClick={() => {
                      setDraftSubtype(p.subtype);
                      setDraftStart(toDate(p.startDate));
                      setDraftEnd(toDate(p.endDate));
                      setEditIndex(idx);
                      setError(null);
                    }}
                  >
                    편집
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button
                    type="button"
                    className="text-xs text-red-600 underline"
                    onClick={() => handleRemove(idx)} // ✅ 안전 삭제 핸들러 사용
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>

          {/* 하단 안내 */}
          <div className="flex justify-between">
            <small className="text-xs text-neutral-500">
              * 겹치는 기간은 등록할 수 없습니다. 예시) 2025-01-12 ~ 2025-06-11 : 육아휴직,
              2025-05-15 ~ 2025-05-21 : 가족돌봄휴가
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
