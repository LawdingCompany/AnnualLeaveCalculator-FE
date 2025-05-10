import React, { useState, useCallback, useEffect } from 'react';
import { useCalculator, Holiday } from '@contexts/CalculatorContext';
import InfoTooltip from '@components/InfoTooltip/InfoTooltip';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import styles from '../Section.module.scss';
import PlusButton from '@assets/Plus Icon.svg';

export default React.memo(function HolidaySection() {
  const { formData, toggleHolidays, addHoliday, removeHoliday, updateHoliday } = useCalculator();

  const [currentHoliday, setCurrentHoliday] = useState<Omit<Holiday, 'id'>>({
    date: null,
    description: '',
  });

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);

  const handleRemoveHoliday = useCallback(
    (id: string) => {
      removeHoliday(id);
      if (editMode === id) {
        setEditMode(null);
        setEditingHoliday(null);
      }
    },
    [removeHoliday, editMode],
  );

  return (
    <div className="mb-6">
      {/* 체크박스 */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="holidays"
          checked={formData.includeHolidays}
          onChange={toggleHolidays}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="holidays" className="ml-2 text-sm font-medium text-gray-700">
          휴일(최대 7개 입력)
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
          {/* 기존 목록 */}
          {formData.holidays.length > 0 && (
            <div className="mb-4 space-y-3">
              {formData.holidays.map((holiday) => (
                <div
                  key={holiday.id}
                  className={`p-3 border border-gray-200 rounded-lg ${
                    editMode === holiday.id ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  {editMode === holiday.id && editingHoliday ? (
                    <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-2">
                      <div className="grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-5">
                          <input
                            type="text"
                            value={editingHoliday.description || ''}
                            onChange={(e) =>
                              setEditingHoliday((prev) =>
                                prev ? { ...prev, description: e.target.value } : null,
                              )
                            }
                            placeholder="설명(선택사항)"
                            className="block w-full h-[55px] px-3 py-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="col-span-6">
                          <CustomDatePicker
                            selected={editingHoliday.date}
                            onChange={(date) =>
                              setEditingHoliday((prev) => (prev ? { ...prev, date: date } : null))
                            }
                            placeholderText="휴일 날짜"
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end items-center">
                          <button
                            onClick={() => handleRemoveHoliday(holiday.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="삭제"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            if (!editingHoliday?.date) return;
                            updateHoliday({
                              ...editingHoliday,
                              description: editingHoliday.description?.trim() || '회사휴일',
                            });
                            setEditMode(null);
                            setEditingHoliday(null);
                          }}
                          disabled={!editingHoliday?.date}
                          className={`${styles['button-primary']} w-full px-3 py-2 text-sm rounded-md disabled:bg-gray-300 transition`}
                        >
                          추가
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <div className="flex-1">
                        <span className="text-sm font-medium">
                          {holiday.date?.toLocaleDateString()}
                        </span>
                        {holiday.description && (
                          <span className="ml-2 text-sm text-gray-600">
                            ({holiday.description})
                          </span>
                        )}
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() => {
                            setEditMode(holiday.id);
                            setEditingHoliday({ ...holiday });
                          }}
                          className="text-green-500 hover:text-green-700 mr-2"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRemoveHoliday(holiday.id)}
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

          {/* "+ 추가하기" 버튼 (편집 중 아닐 때만) */}
          {!showForm && formData.holidays.length < 7 && !editMode && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className={`${styles['button-outline-primary']} w-full mb-2 flex items-center justify-center gap-2 py-2 rounded-md text-sm transition`}
            >
              <img src={PlusButton} alt="추가 아이콘" className="w-6 h-6" />
              <span className="text-base">추가하기</span>
            </button>
          )}

          {/* 추가 폼 */}
          {showForm && formData.holidays.length < 7 && (
            <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-2">
              <div className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-5">
                  <input
                    type="text"
                    value={currentHoliday.description || ''}
                    onChange={(e) =>
                      setCurrentHoliday((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="설명(선택사항)"
                    className="block w-full h-[55px] px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-6">
                  <CustomDatePicker
                    selected={currentHoliday.date}
                    onChange={(date) =>
                      setCurrentHoliday((prev) => ({
                        ...prev,
                        date,
                      }))
                    }
                    placeholderText="휴일 날짜"
                    className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                  />
                </div>
                <div className="col-span-1 flex justify-end items-center">
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setCurrentHoliday({ date: null, description: '' });
                    }}
                    className="text-red-500 hover:text-red-700"
                    aria-label="입력 취소"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!currentHoliday.date) return;
                    const desc = currentHoliday.description?.trim() || '회사휴일';
                    addHoliday({ ...currentHoliday, description: desc });
                    setCurrentHoliday({ date: null, description: '' });
                    setShowForm(false);
                  }}
                  disabled={!currentHoliday.date}
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
});
