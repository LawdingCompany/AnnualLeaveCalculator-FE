import React from 'react';
import CustomDatePicker from '@components/DatePicker/CustomDatePicker';

interface SpecialPeriod {
  id: string;
  type: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface SpecialPeriodSectionProps {
  period: SpecialPeriod;
  onChange: (period: SpecialPeriod) => void;
  onRemove: () => void;
}

const SpecialPeriodSection: React.FC<SpecialPeriodSectionProps> = ({
  period,
  onChange,
  onRemove,
}) => {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...period, type: e.target.value });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', date: Date | null) => {
    onChange({ ...period, [field]: date });
  };

  return (
    <div className="mb-3 p-2 border border-gray-200 rounded-md">
      <div className="flex justify-between mb-2">
        <select
          value={period.type}
          onChange={handleTypeChange}
          className="text-sm p-1 border border-gray-300 rounded-md"
        >
          <option value="">선택</option>
          <option value="시용">시용</option>
          <option value="무급휴가">무급휴가</option>
          <option value="육아휴직">육아휴직</option>
        </select>
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
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-xs text-gray-500">시작일</span>
          <CustomDatePicker
            selected={period.startDate}
            onChange={(date) => handleDateChange('startDate', date)}
            dateFormat="yyyy.MM.dd"
            placeholderText="YYYY.MM.DD"
            className="w-full text-sm"
          />
        </div>
        <div>
          <span className="text-xs text-gray-500">종료일</span>
          <CustomDatePicker
            selected={period.endDate}
            onChange={(date) => handleDateChange('endDate', date)}
            dateFormat="yyyy.MM.dd"
            placeholderText="YYYY.MM.DD"
            className="w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SpecialPeriodSection;
