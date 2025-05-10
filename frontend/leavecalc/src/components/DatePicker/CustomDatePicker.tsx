import { forwardRef, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import { format, isValid, parse } from 'date-fns'; // date-fns 추가 함수 임포트
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
  // 입력 필드의 현재 값을 관리하는 상태
  const [inputValue, setInputValue] = useState<string>('');

  // 월/일만 표시하는 경우 dateFormat 설정
  const finalDateFormat = monthYearOnly ? 'MM.dd' : dateFormat || 'yyyy.MM.dd';
  const finalPlaceholder = monthYearOnly ? 'MM.DD' : placeholderText || 'YYYY.MM.DD';

  // selected가 변경되면 입력 필드 업데이트
  useEffect(() => {
    if (selected) {
      setInputValue(format(selected, finalDateFormat));
    } else {
      setInputValue('');
    }
  }, [selected, finalDateFormat]);

  // 숫자로만 이루어진 문자열을 날짜로 파싱하는 함수
  const parseNumericDateString = (value: string): Date | null => {
    // 숫자만 추출
    const numbersOnly = value.replace(/\D/g, '');

    // 입력된 숫자 길이에 따라 다른 파싱 로직 적용
    if (numbersOnly.length >= 6) {
      let year, month, day;

      if (numbersOnly.length === 8) {
        // YYYYMMDD 형식 (20230302)
        year = numbersOnly.substring(0, 4);
        month = numbersOnly.substring(4, 6);
        day = numbersOnly.substring(6, 8);
      } else if (numbersOnly.length === 6) {
        // YYMMDD 형식 (230302)
        const currentYear = new Date().getFullYear().toString();
        const century = currentYear.substring(0, 2);
        year = `${century}${numbersOnly.substring(0, 2)}`;
        month = numbersOnly.substring(2, 4);
        day = numbersOnly.substring(4, 6);
      } else if (numbersOnly.length === 7) {
        // YYYYMDD 또는 YYYYMMD 형식 처리
        year = numbersOnly.substring(0, 4);
        // 남은 3자리 중 처음이 1 또는 2로 시작하면 YYYYMDD 형식으로 가정
        if (numbersOnly[4] === '1' || numbersOnly[4] === '2') {
          month = numbersOnly.substring(4, 6);
          day = `0${numbersOnly.substring(6, 7)}`;
        } else {
          month = `0${numbersOnly.substring(4, 5)}`;
          day = numbersOnly.substring(5, 7);
        }
      } else {
        // 기타 케이스는 직접 파싱하기 어려우므로 null 반환
        return null;
      }

      // 월이 1~12 범위인지 확인
      if (parseInt(month) < 1 || parseInt(month) > 12) return null;

      // 해당 월의 유효한 일자인지 확인
      const maxDaysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
      if (parseInt(day) < 1 || parseInt(day) > maxDaysInMonth) return null;

      // 날짜 객체 생성 및 유효성 확인
      const dateObj = new Date(`${year}-${month}-${day}`);
      return isValid(dateObj) ? dateObj : null;
    }

    return null;
  };

  // 입력 변경 처리 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // 숫자로만 입력된 경우 날짜 파싱 시도
    const isNumericInput =
      /^\d+$/.test(value.replace(/\D/g, '')) && value.replace(/\D/g, '').length > 0;

    if (isNumericInput) {
      const parsedDate = parseNumericDateString(value);
      if (parsedDate) {
        onChange(parsedDate);
      }
    } else if (value === '') {
      // 입력값이 비어있으면 날짜 선택 초기화
      onChange(null);
    }
  };

  // 포커스를 잃었을 때 처리
  const handleBlur = () => {
    if (selected) {
      // 선택된 날짜가 있으면 포맷에 맞게 표시
      setInputValue(format(selected, finalDateFormat));
    } else if (inputValue) {
      // 입력값이 있지만 유효한 날짜가 아니면 입력값 초기화
      setInputValue('');
    }
  };

  // 날짜 입력 필드의 커스텀 UI
  const CustomInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    (props, ref) => (
      <div className="relative">
        <input
          {...props}
          ref={ref}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
          placeholder={finalPlaceholder}
          disabled={disabled}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
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
    ),
  );

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
