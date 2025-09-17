import { useState } from 'react';
import { useCalcDispatch, useCalcState } from './context';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';
import SelectBox from '@components/ui/SelectBox';
import { HelpCircle } from 'lucide-react';
import { openGuide } from './guideBus';

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

// ▼ 드롭다운 옵션 (필요시 수정/추가)
const HOLIDAY_TYPE_OPTIONS = [
  { value: 'CASE1', label: '회사 창립기념일' },
  { value: 'CASE2', label: '단체협약상 유·무급 휴가일' },
  { value: 'CASE3', label: '노동조합 창립기념일' },
  { value: 'CASE4', label: '사내 규정상 휴일(Family day, 종무식)' },
  { value: 'CASE5', label: '일괄 여름휴가 지정일(단체 연차사용 제외)' },
  { value: 'CASE6', label: '명절 전후 임의휴무일(단체 연차사용 제외)' },
  { value: 'CASE7', label: '기타' },
] as const;
type HolidayType = (typeof HOLIDAY_TYPE_OPTIONS)[number]['value'];

function typeLabelOf(v?: HolidayType) {
  return HOLIDAY_TYPE_OPTIONS.find((o) => o.value === v)?.label ?? undefined;
}

export default function CompanyHolidaysSection() {
  const s = useCalcState();
  const d = useCalcDispatch();

  const hireDateObj = toDate(s.hireDate);
  const refDateObj = toDate(s.referenceDate);
  const canEdit = Boolean(hireDateObj && refDateObj); // ✅ 두 날짜가 모두 있어야 편집 가능

  // 작성용 로컬 상태 (타입은 현재 UI 메모용)
  const [draftType, setDraftType] = useState<HolidayType | ''>('');
  const [draftDate, setDraftDate] = useState<Date | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // UI 전용: 날짜 -> 타입 매핑(목록 표기/편집 복구용)
  const [holidayTypeByDate, setHolidayTypeByDate] = useState<Record<string, HolidayType>>({});

  const enabled = s.companyHolidaysEnabled;
  const count = s.companyHolidays.length;
  const isFull = count >= MAX_HOLIDAYS;

  const validate = () => {
    setError(null);
    if (!draftDate) return setError('날짜를 선택해주세요.'), false;

    if (hireDateObj && draftDate < hireDateObj) {
      return setError('휴일은 입사일 이후만 선택할 수 있습니다.'), false;
    }
    if (refDateObj && draftDate > refDateObj) {
      return setError('휴일은 기준일 이전만 선택할 수 있습니다.'), false;
    }

    const draftStr = toStr(draftDate);
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
    setDraftType('');
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

    // UI 표시용: 날짜 -> 선택된 타입 저장(없으면 삭제)
    setHolidayTypeByDate((prev) => {
      const next = { ...prev };
      if (draftType) next[val] = draftType as HolidayType;
      else delete next[val];
      return next;
    });

    if (editIndex === null) {
      d({ type: 'SET_COMPANY_HOLIDAYS', payload: [...s.companyHolidays, val] });
    } else {
      const nextDates = s.companyHolidays.slice();
      const oldDate = nextDates[editIndex];

      // 편집 시 날짜가 바뀌면 맵 키도 옮김
      setHolidayTypeByDate((prev) => {
        const m = { ...prev };
        if (oldDate !== val) {
          const oldType = m[oldDate];
          delete m[oldDate];
          if (draftType) m[val] = draftType as HolidayType;
          else if (oldType) m[val] = oldType;
        }
        return m;
      });

      nextDates[editIndex] = val;
      d({ type: 'SET_COMPANY_HOLIDAYS', payload: nextDates });
    }
    clearDraft();
  };

  const handleToggle = (checked: boolean) => {
    if (checked) {
      d({ type: 'SET_COMPANY_HOLIDAYS_ENABLED', payload: true });
    } else {
      d({ type: 'SET_COMPANY_HOLIDAYS_ENABLED', payload: false });
      d({ type: 'SET_COMPANY_HOLIDAYS', payload: [] });
      setHolidayTypeByDate({});
      clearDraft();
    }
  };

  const options = HOLIDAY_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label }));

  return (
    <div className="grid gap-2">
      {/* 헤더: 왼쪽(체크박스+텍스트+?아이콘) / 오른쪽(카운터) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-md font-medium text-neutral-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300"
              checked={enabled}
              onChange={(e) => handleToggle(e.target.checked)}
            />
            공휴일 외 회사휴일
          </label>

          {/* ? 아이콘: 텍스트 바로 옆 */}
          <button
            type="button"
            onClick={() => openGuide('q2')}
            aria-controls="guide-root"
            title="도움말"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-[var(--first)] hover:border-blue-400 hover:text-blue-700"
          >
            <HelpCircle className="h-4 w-4" aria-hidden />
            <span className="sr-only">이용가이드 열기</span>
          </button>
        </div>

        {/* 오른쪽: 카운터 (안내문일 땐 숨김) */}
        {enabled && canEdit && (
          <span className="text-xs text-neutral-500">
            {count}/{MAX_HOLIDAYS}
          </span>
        )}
      </div>

      {/* 본문 */}
      {enabled &&
        (canEdit ? (
          <div className="rounded-lg border border-neutral-200 p-3 space-y-3">
            {/* 한 줄 구성: 사유 | 드롭다운 | 날짜 | 캘린더 | 추가하기 */}
            <div className="grid grid-cols-[max-content_max-content_max-content_1fr_max-content] items-center gap-2">
              {/* 사유 라벨 */}
              <span className="text-sm ml-1 mr-1 text-neutral-600">사유</span>

              <SelectBox
                value={draftType || null}
                onChange={(v) => setDraftType(v)}
                options={options}
                disabled={editIndex === null && isFull}
                className="min-w-[170px]"
                buttonClassName="h-9"
              />

              {/* 날짜 라벨 (연한색) */}
              <span className="text-sm ml-2 mr-1 text-neutral-500">날짜</span>

              {/* DatePicker + 보조 문구 */}
              <div className="flex items-center gap-2">
                <CustomDatePicker
                  selected={draftDate}
                  onChange={(dt) => setDraftDate(dt)}
                  placeholderText="YYYY.MM.DD"
                  className="max-w-[150px]"
                  minDate={hireDateObj ?? undefined}
                  maxDate={refDateObj ?? undefined}
                />
                <small className="text-xs ml-2 text-neutral-500 whitespace-nowrap">
                  * 하루 단위로 계산에 반영됩니다.
                </small>
              </div>

              {/* 추가/수정 버튼 */}
              <button
                type="button"
                onClick={handleAddOrUpdate}
                className="ml-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-neutral-300"
                disabled={!draftType || !draftDate || (editIndex === null && isFull)}
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
                  * 아직 등록된 회사 휴일이 없습니다. 사유 선택 후 날짜를 선택하고 ‘추가하기’를
                  눌러주세요.
                </div>
              ) : (
                s.companyHolidays.map((dateStr, idx) => {
                  const ty = holidayTypeByDate[dateStr]; // HolidayType | undefined
                  const tyLabel = typeLabelOf(ty);

                  return (
                    <div
                      key={idx}
                      className="grid grid-cols-[1fr_max-content_max-content_max-content] items-center gap-2 rounded-md border border-neutral-200 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="text-sm">
                          {/* 유형 먼저 */}
                          {tyLabel && <span>{tyLabel}</span>}
                          {tyLabel && <span className="mx-1">·</span>}
                          {/* 날짜는 연한 회색 */}
                          <span className="text-neutral-500">{dateStr}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-xs underline"
                        onClick={() => {
                          setDraftDate(toDate(dateStr));
                          const safeTy = ty as HolidayType | undefined;
                          setDraftType(safeTy ?? '');
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
                        onClick={() => {
                          const next = s.companyHolidays.filter((_, i) => i !== idx);
                          d({ type: 'SET_COMPANY_HOLIDAYS', payload: next });
                          setHolidayTypeByDate((prev) => {
                            const m = { ...prev };
                            delete m[dateStr];
                            return m;
                          });
                          if (editIndex === idx) clearDraft();
                        }}
                      >
                        삭제
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          // ✅ 입사일/기준일이 없을 때 안내만
          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            먼저 <b>입사일</b>과 <b>계산 기준일</b>을 입력해주세요.
            <div className="mt-2 text-xs text-amber-700">
              설정이 완료되면 이 영역에 <b>사유 · 날짜</b> 입력창이 나타납니다.
            </div>
          </div>
        ))}
    </div>
  );
}
