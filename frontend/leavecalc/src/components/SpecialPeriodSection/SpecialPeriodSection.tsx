import React, { useState, useCallback, useEffect } from 'react';
import { useCalculator, SpecialPeriod } from '@contexts/CalculatorContext';
import InfoTooltip from '@components/InfoTooltip/InfoTooltip';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';
import ChevronDown from '@assets/Chevron down.svg';
import PlusButton from '@assets/Plus Icon.svg';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import styles from './SpecialPeriodSection.module.scss';

const PERIOD_TYPES = [
  { value: 'workday', label: '출근 처리' },
  { value: 'maternity', label: '출산전후휴가' },
  { value: 'miscarriage', label: '유산전후휴가' },
  { value: 'spouse', label: '배우자출산' },
  { value: 'other', label: '기타' },
];

function SpecialPeriodSection() {
  const {
    formData,
    toggleSpecialPeriod,
    addSpecialPeriod,
    updateSpecialPeriod,
    removeSpecialPeriod,
  } = useCalculator();

  // 현재 입력 중인 특이사항 상태
  const [currentPeriod, setCurrentPeriod] = useState<Omit<SpecialPeriod, 'id'>>({
    type: 'workday',
    startDate: null,
    endDate: null,
  });
  // 1. 상태 추가
  const [showForm, setShowForm] = useState(false);
  // 편집 모드 상태 관리
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editingPeriod, setEditingPeriod] = useState<SpecialPeriod | null>(null);

  // 입력 필드 초기화
  const resetFields = useCallback(() => {
    setCurrentPeriod({
      type: 'workday',
      startDate: null,
      endDate: null,
    });
  }, []);

  // 특이사항 추가 핸들러
  const handleAddPeriod = useCallback(() => {
    if (!currentPeriod.startDate || !currentPeriod.endDate) return;

    addSpecialPeriod(currentPeriod);
    resetFields();
  }, [currentPeriod, addSpecialPeriod, resetFields]);

  // 타입 변경 핸들러
  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>, isEditing = false) => {
      if (isEditing && editingPeriod) {
        setEditingPeriod((prev) => (prev ? { ...prev, type: e.target.value } : null));
      } else {
        setCurrentPeriod((prev) => ({ ...prev, type: e.target.value }));
      }
    },
    [editingPeriod],
  );

  // 시작일 변경 핸들러
  const handleStartDateChange = useCallback(
    (date: Date | null, isEditing = false) => {
      if (isEditing && editingPeriod) {
        setEditingPeriod((prev) => {
          if (!prev) return null;
          // 새 시작일이 종료일보다 뒤에 있는 경우, 종료일 초기화
          if (date && prev.endDate && date > prev.endDate) {
            return {
              ...prev,
              startDate: date,
              endDate: null,
            };
          }
          return { ...prev, startDate: date };
        });
      } else {
        setCurrentPeriod((prev) => {
          // 새 시작일이 종료일보다 뒤에 있는 경우, 종료일 초기화
          if (date && prev.endDate && date > prev.endDate) {
            return {
              ...prev,
              startDate: date,
              endDate: null, // 종료일 초기화
            };
          }
          // 그렇지 않으면 시작일만 업데이트
          return {
            ...prev,
            startDate: date,
          };
        });
      }
    },
    [editingPeriod],
  );

  // 종료일 변경 핸들러
  const handleEndDateChange = useCallback(
    (date: Date | null, isEditing = false) => {
      if (isEditing && editingPeriod) {
        // 시작일이 있고, 새 종료일이 시작일보다 이전이면 무시
        if (editingPeriod.startDate && date && date < editingPeriod.startDate) {
          return;
        }
        setEditingPeriod((prev) => (prev ? { ...prev, endDate: date } : null));
      } else {
        // 시작일이 있고, 새 종료일이 시작일보다 이전이면 무시
        if (currentPeriod.startDate && date && date < currentPeriod.startDate) {
          return;
        }
        setCurrentPeriod((prev) => ({ ...prev, endDate: date }));
      }
    },
    [currentPeriod.startDate, editingPeriod],
  );

  // 편집 모드 시작 핸들러
  const handleStartEdit = useCallback((period: SpecialPeriod) => {
    setEditMode(period.id);
    setEditingPeriod({ ...period });
  }, []);

  // 편집 취소 핸들러
  const handleCancelEdit = useCallback(() => {
    setEditMode(null);
    setEditingPeriod(null);
  }, []);

  // 편집 저장 핸들러
  const handleSaveEdit = useCallback(() => {
    if (editingPeriod && editingPeriod.startDate && editingPeriod.endDate) {
      // 기존 항목 삭제 후 새로운 항목 추가하는 방식으로 업데이트
      updateSpecialPeriod(editingPeriod);
      setEditMode(null);
      setEditingPeriod(null);
    }
  }, [editingPeriod, removeSpecialPeriod, addSpecialPeriod]);

  // 특이사항 삭제 핸들러
  const handleRemovePeriod = useCallback(
    (id: string) => {
      removeSpecialPeriod(id);
      // 삭제하는 항목이 현재 편집 중이면 편집 모드 취소
      if (editMode === id) {
        setEditMode(null);
        setEditingPeriod(null);
      }
    },
    [removeSpecialPeriod, editMode],
  );

  // 날짜 변경 시 유효성 검증을 위한 useEffect
  useEffect(() => {
    // 시작일과 종료일이 모두 있고, 시작일이 종료일보다 뒤라면
    if (
      currentPeriod.startDate &&
      currentPeriod.endDate &&
      currentPeriod.startDate > currentPeriod.endDate
    ) {
      // 종료일 초기화
      setCurrentPeriod((prev) => ({
        ...prev,
        endDate: null,
      }));
    }
  }, [currentPeriod.startDate, currentPeriod.endDate]);

  // 편집 모드의 유효성 검증
  useEffect(() => {
    if (
      editingPeriod?.startDate &&
      editingPeriod?.endDate &&
      editingPeriod.startDate > editingPeriod.endDate
    ) {
      setEditingPeriod((prev) =>
        prev
          ? {
              ...prev,
              endDate: null,
            }
          : null,
      );
    }
  }, [editingPeriod?.startDate, editingPeriod?.endDate]);

  // 추가 버튼 비활성화 여부
  const isAddDisabled =
    !currentPeriod.startDate || !currentPeriod.endDate || formData.specialPeriods.length >= 5;

  return (
    <div className="mb-6">
      {/* 특이사항 체크박스 */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="specialPeriod"
          checked={formData.hasSpecialPeriod}
          onChange={toggleSpecialPeriod}
          className="w-4 h-4 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="specialPeriod" className="ml-2 text-sm font-medium text-gray-700">
          특이사항이 있는 기간(최대 5개 입력)
        </label>
        <InfoTooltip
          title="특이사항 안내"
          content={
            <div>
              <p>특이사항이 있는 기간에 대한 자세한 설명</p>
              <ul className="list-disc pl-5 mt-2">
                <li>출근 처리</li>
                <li>출산전후휴가</li>
                <li>유산전후휴가</li>
                <li>배우자출산</li>
                <li>기타 특이사항</li>
              </ul>
            </div>
          }
        />
      </div>

      {formData.hasSpecialPeriod && (
        <>
          {/* 기존 목록 */}
          {formData.specialPeriods.length > 0 && (
            <div className="mb-4 space-y-3">
              {formData.specialPeriods.map((period) => (
                <div
                  key={period.id}
                  className={`p-3 border border-gray-200 rounded-lg ${
                    editMode === period.id ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {editMode === period.id && editingPeriod ? (
                    <div className="space-y-3">
                      {/* 편집 입력 폼 */}
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-700">사유</label>
                        <div className="relative w-40">
                          <select
                            value={editingPeriod.type}
                            onChange={(e) => handleTypeChange(e, true)}
                            className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md appearance-none focus:outline-none"
                          >
                            {PERIOD_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                            <img src={ChevronDown} alt="화살표" className="w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <CustomDatePicker
                          selected={editingPeriod.startDate}
                          onChange={(date) => handleStartDateChange(date, true)}
                          placeholderText="시작일"
                          className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                        />
                        <CustomDatePicker
                          selected={editingPeriod.endDate}
                          onChange={(date) => handleEndDateChange(date, true)}
                          placeholderText="종료일"
                          className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                          minDate={editingPeriod.startDate || undefined}
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          disabled={!editingPeriod?.startDate || !editingPeriod?.endDate}
                          className={`${styles['button-primary']} w-full px-3 py-2 text-sm rounded-md disabled:bg-gray-300 transition`}
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="flex-1 flex flex-wrap gap-2">
                        <div className="min-w-[80px] text-sm text-gray-600">
                          {PERIOD_TYPES.find((t) => t.value === period.type)?.label || period.type}
                        </div>
                        <div className="text-sm">
                          {period.startDate?.toLocaleDateString()} ~{' '}
                          {period.endDate?.toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(period)}
                          className="text-blue-500 hover:text-blue-700 mr-2"
                        >
                          <PencilIcon className="w-5 h-5 text-green-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePeriod(period.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 항상 보여지는 + 추가하기 버튼 */}
          {formData.specialPeriods.length < 5 && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className={`${styles['button-outline-primary']} w-full mb-2 flex items-center justify-center gap-2 py-2 rounded-md transition`}
            >
              <img src={PlusButton} alt="추가하기 아이콘" className="w-6 h-6" />
              <span>추가하기</span>
            </button>
          )}

          {/* 폼은 + 버튼 클릭 시 나타남 */}
          {formData.specialPeriods.length < 5 && showForm && (
            <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-2 space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">사유</label>
                <div className="relative w-40">
                  <select
                    value={currentPeriod.type}
                    onChange={(e) => handleTypeChange(e)}
                    className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md appearance-none focus:outline-none"
                  >
                    {PERIOD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <img src={ChevronDown} alt="화살표" className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomDatePicker
                  selected={currentPeriod.startDate}
                  onChange={(date) => handleStartDateChange(date)}
                  placeholderText="시작일"
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                />
                <CustomDatePicker
                  selected={currentPeriod.endDate}
                  onChange={(date) => handleEndDateChange(date)}
                  placeholderText="종료일"
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  minDate={currentPeriod.startDate || undefined}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    handleAddPeriod();
                    setShowForm(false);
                  }}
                  disabled={isAddDisabled}
                  className={`${styles['button-primary']} w-full px-3 py-2 text-sm rounded-md disabled:bg-gray-300 transition`}
                >
                  추가
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default React.memo(SpecialPeriodSection);
