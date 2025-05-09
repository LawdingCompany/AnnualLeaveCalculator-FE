import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './CustomDatePicker.module.scss';

type CustomDatePickerProps = {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholderText?: string;
  monthYearOnly?: boolean;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

export default function CustomDatePicker({
  selected,
  onChange,
  dateFormat,
  placeholderText,
  monthYearOnly = false,
  className = '',
  disabled = false,
  minDate,
  maxDate,
}: CustomDatePickerProps) {
  // 월/일만 표시하는 경우 dateFormat 설정
  const finalDateFormat = monthYearOnly ? 'MM.dd' : dateFormat || 'yyyy.MM.dd';
  const finalPlaceholder = monthYearOnly ? 'MM.DD' : placeholderText || 'YYYY.MM.DD';

  // 날짜 입력 필드의 커스텀 UI
  const CustomInput = forwardRef((props: any, ref) => (
    <div className="relative">
      <input
        {...props}
        ref={ref}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        placeholder={finalPlaceholder}
        disabled={disabled}
        readOnly
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>
  ));

  CustomInput.displayName = 'DatePickerInput';

  // 기본 속성 설정
  const commonProps = {
    selected,
    onChange,
    dateFormat: finalDateFormat,
    locale: ko,
    customInput: <CustomInput />,
    calendarClassName: styles.calendar,
    popperClassName: styles.calendarPopper,
    disabled,
    minDate,
    maxDate,
  };

  // 요일 색상 변경을 위한 day 커스텀 렌더링
  const dayClassName = (date: Date) => {
    const day = date.getDay();
    if (day === 0) return styles.sundayText; // 일요일
    if (day === 6) return styles.saturdayText; // 토요일
    return '';
  };

  // 월/일만 표시하는 경우
  if (monthYearOnly) {
    return <DatePicker {...commonProps} showMonthYearPicker={false} dayClassName={dayClassName} />;
  }

  // 기본 캘린더 형식
  return <DatePicker {...commonProps} dayClassName={dayClassName} />;
}
