import React, { useState, useCallback } from 'react';
import { useCalculator, SpecialPeriod } from '@contexts/CalculatorContext';
import InfoTooltip from '@components/InfoTooltip/InfoTooltip';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const PERIOD_TYPES = [
  { value: 'workday', label: '출근 처리' },
  { value: 'maternity', label: '출산전후휴가' },
  { value: 'miscarriage', label: '유산전후휴가' },
  { value: 'spouse', label: '배우자출산' },
  { value: 'other', label: '기타' },
];

const SpecialPeriodSection: React.FC = () => {
  const { formData, toggleSpecialPeriod, addSpecialPeriod, removeSpecialPeriod } = useCalculator();

  // 현재 입력 중인 특이사항 상태
  const [currentPeriod, setCurrentPeriod] = useState<Omit<SpecialPeriod, 'id'>>({
    type: 'workday',
    startDate: null,
    endDate: null,
  });

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
  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPeriod((prev) => ({ ...prev, type: e.target.value }));
  }, []);

  // 시작일 변경 핸들러
  const handleStartDateChange = useCallback((date: Date | null) => {
    setCurrentPeriod((prev) => ({ ...prev, startDate: date }));
  }, []);

  // 종료일 변경 핸들러
  const handleEndDateChange = useCallback((date: Date | null) => {
    setCurrentPeriod((prev) => ({ ...prev, endDate: date }));
  }, []);

  // 특이사항 삭제 핸들러
  const handleRemovePeriod = useCallback(
    (id: string) => {
      removeSpecialPeriod(id);
    },
    [removeSpecialPeriod],
  );

  // 추가 버튼 비활성화 여부
  const isAddDisabled =
    !currentPeriod.startDate || !currentPeriod.endDate || formData.specialPeriods.length >= 5;

  return (
    <div className="mb-6">
      {/* 특이사항이 있는 기간 체크박스 */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="specialPeriod"
          checked={formData.hasSpecialPeriod}
          onChange={toggleSpecialPeriod}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
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
          {/* 기존에 추가된 특이사항 목록 */}
          {formData.specialPeriods.length > 0 && (
            <div className="mb-4 space-y-3">
              {formData.specialPeriods.map((period) => (
                <div
                  key={period.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex-1 flex flex-wrap gap-2">
                    <div className="min-w-[80px] text-sm text-gray-600">
                      {PERIOD_TYPES.find((t) => t.value === period.type)?.label || period.type}
                    </div>
                    <div className="text-sm">
                      {period.startDate?.toLocaleDateString()} ~{' '}
                      {period.endDate?.toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePeriod(period.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="삭제"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 특이사항 입력 폼 */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-2">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-3">
                <select
                  value={currentPeriod.type}
                  onChange={handleTypeChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {PERIOD_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-4">
                <CustomDatePicker
                  selected={currentPeriod.startDate}
                  onChange={handleStartDateChange}
                  placeholderText="시작일"
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-4">
                <DatePicker
                  selected={currentPeriod.endDate}
                  onChange={handleEndDateChange}
                  placeholderText="종료일"
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  minDate={currentPeriod.startDate || undefined}
                />
              </div>

              <div className="col-span-1">
                <button
                  type="button"
                  onClick={handleAddPeriod}
                  disabled={!currentPeriod.startDate || !currentPeriod.endDate}
                  className="w-8 h-8 flex items-center justify-center text-blue-600 hover:text-blue-800 disabled:text-gray-400 transition-colors"
                  aria-label="추가하기"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* 추가하기 버튼 */}
          <button
            type="button"
            className="w-full py-2 flex items-center justify-center gap-1 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:border-blue-400 transition-colors disabled:opacity-50 disabled:hover:text-gray-600 disabled:hover:border-gray-300"
            onClick={handleAddPeriod}
            disabled={isAddDisabled}
          >
            <PlusIcon className="w-4 h-4" />
            추가하기 {formData.specialPeriods.length > 0 && `(${formData.specialPeriods.length}/5)`}
          </button>
        </>
      )}
    </div>
  );
};

export default React.memo(SpecialPeriodSection);
