// components/HolidaySection/HolidaySection.tsx
import React from 'react';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';

interface Holiday {
  id: string;
  date: Date | null;
  description: string;
}

interface HolidaySectionProps {
  holiday: Holiday;
  onChange: (holiday: Holiday) => void;
  onRemove: () => void;
}

const HolidaySection: React.FC<HolidaySectionProps> = ({ holiday, onChange, onRemove }) => {
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...holiday, description: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    onChange({ ...holiday, date });
  };

  return (
    <div className="mb-3 p-2 border border-gray-200 rounded-md">
      <div className="flex justify-between mb-2">
        <input
          type="text"
          value={holiday.description}
          onChange={handleDescriptionChange}
          placeholder="휴일 설명"
          className="text-sm p-1 border border-gray-300 rounded-md flex-grow mr-2"
        />
        <button type="button" onClick={onRemove} className="text-red-500" aria-label="삭제">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
            <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
          </svg>
        </button>
      </div>
      <div>
        <span className="text-xs text-gray-500">날짜</span>
        <CustomDatePicker
          selected={holiday.date}
          onChange={handleDateChange}
          dateFormat="yyyy.MM.dd"
          placeholderText="YYYY.MM.DD"
          className="w-full text-sm"
        />
      </div>
    </div>
  );
};

export default HolidaySection;
