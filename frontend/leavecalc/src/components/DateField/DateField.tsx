import React from 'react';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';

interface DateFieldProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholder?: string;
}

const DateField: React.FC<DateFieldProps> = ({
  label,
  selected,
  onChange,
  dateFormat = 'yyyy.MM.dd',
  placeholder = 'YYYY.MM.DD',
}) => {
  return (
    <div className="grid grid-cols-3 items-center mb-4">
      <div className="text-right pr-4">
        <label className="text-sm font-medium text-gray-700">{label}</label>
      </div>
      <div className="col-span-2">
        <CustomDatePicker
          selected={selected}
          onChange={onChange}
          dateFormat={dateFormat}
          placeholderText={placeholder}
        />
      </div>
    </div>
  );
};

export default DateField;
