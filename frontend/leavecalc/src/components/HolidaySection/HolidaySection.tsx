import React, { useState, useCallback } from 'react';
import { useCalculator, Holiday } from '@contexts/CalculatorContext';
import InfoTooltip from '@components/InfoTooltip/InfoTooltip';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const HolidaySection: React.FC = () => {
  const { formData, toggleHolidays, addHoliday, removeHoliday } = useCalculator();

  // 현재 입력 중인 휴일 상태
  const [currentHoliday, setCurrentHoliday] = useState<Omit<Holiday, 'id'>>({
    date: null,
    description: '',
  });

  // 입력 필드 초기화
  const resetFields = useCallback(() => {
    setCurrentHoliday({
      date: null,
      description: '',
    });
  }, []);

  // 휴일 추가 핸들러
  const handleAddHoliday = useCallback(() => {
    if (!currentHoliday.date) return;

    addHoliday(currentHoliday);
    resetFields();
  }, [currentHoliday, addHoliday, resetFields]);

  // 날짜 변경 핸들러
  const handleDateChange = useCallback((date: Date | null) => {
    setCurrentHoliday((prev) => ({ ...prev, date }));
  }, []);

  // 설명 변경 핸들러
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentHoliday((prev) => ({ ...prev, description: e.target.value }));
  }, []);

  // 휴일 삭제 핸들러
  const handleRemoveHoliday = useCallback(
    (id: string) => {
      removeHoliday(id);
    },
    [removeHoliday],
  );

  // 추가 버튼 비활성화 여부
  const isAddDisabled = !currentHoliday.date || formData.holidays.length >= 7;

  return (
    <div className="mb-6">
      {/* 휴일 체크박스 */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="holidays"
          checked={formData.includeHolidays}
          onChange={toggleHolidays}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="holidays" className="ml-2 text-sm font-medium text-gray-700">
          휴일(휴가, 법정 공휴일 外, 최대 7개 입력)
        </label>
        <InfoTooltip
          title="휴일 안내"
          content={
            <div>
              <p>휴일에 대한 자세한 설명</p>
              <p className="mt-2">
                법정공휴일을 제외하고, 회사규정, 징계규정 등에서 정한 의무 휴일에 한함.
              </p>
            </div>
          }
        />
      </div>

      {formData.includeHolidays && (
        <>
          {/* 기존에 추가된 휴일 목록 */}
          {formData.holidays.length > 0 && (
            <div className="mb-4 space-y-3">
              {formData.holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium">
                      {holiday.date?.toLocaleDateString()}
                    </span>
                    {holiday.description && (
                      <span className="ml-2 text-sm text-gray-600">({holiday.description})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHoliday(holiday.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label="삭제"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 휴일 입력 폼 */}
          <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-2">
            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-6">
                <CustomDatePicker
                  selected={currentHoliday.date}
                  onChange={handleDateChange}
                  placeholderText="휴일 날짜"
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="col-span-5">
                <input
                  type="text"
                  value={currentHoliday.description || ''}
                  onChange={handleDescriptionChange}
                  className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="설명 (선택사항)"
                />
              </div>

              <div className="col-span-1">
                <button
                  type="button"
                  onClick={handleAddHoliday}
                  disabled={!currentHoliday.date}
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
            onClick={handleAddHoliday}
            disabled={isAddDisabled}
          >
            <PlusIcon className="w-4 h-4" />
            추가하기 {formData.holidays.length > 0 && `(${formData.holidays.length}/7)`}
          </button>
        </>
      )}
    </div>
  );
};

export default React.memo(HolidaySection);
