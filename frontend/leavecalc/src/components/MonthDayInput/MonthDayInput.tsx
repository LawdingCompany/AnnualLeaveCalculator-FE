// MonthDayInput.tsx
import { useState, useEffect, useRef, ChangeEvent, FocusEvent } from 'react';

interface MonthDayInputProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
}

export default function MonthDayInput({
  selected,
  onChange,
  placeholderText = 'MM.DD',
  className = '',
}: MonthDayInputProps) {
  // Date 객체에서 MM.DD 형식의 문자열로 변환
  const getFormattedValue = (date: Date | null): string => {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}.${day}`;
  };

  const [inputValue, setInputValue] = useState(getFormattedValue(selected));
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 사용자 입력이 유효한지 여부를 추적하는 참조
  const lastValidValueRef = useRef(getFormattedValue(selected));

  // 입력값이 변경될 때 처리
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // 오류 메시지 초기화
    if (e.target.value !== inputValue) {
      setError('');
    }

    // 사용자 입력에서 숫자만 추출
    let numbersOnly = e.target.value.replace(/[^\d]/g, '');

    // 최대 4자리로 제한
    if (numbersOnly.length > 4) {
      numbersOnly = numbersOnly.substring(0, 4);
    }

    // 입력 자동 포맷팅
    let formattedValue = '';

    if (numbersOnly.length === 0) {
      formattedValue = '';
    } else if (numbersOnly.length === 1) {
      formattedValue = numbersOnly;
    } else if (numbersOnly.length === 2) {
      formattedValue = numbersOnly + '.';
    } else if (numbersOnly.length === 3) {
      formattedValue = numbersOnly.substring(0, 2) + '.' + numbersOnly.substring(2);
    } else if (numbersOnly.length === 4) {
      formattedValue = numbersOnly.substring(0, 2) + '.' + numbersOnly.substring(2);
    }

    setInputValue(formattedValue);
    setIsEditing(true);

    // 완전한 MM.DD 형식이면 Date 객체로 변환 (4자리 입력 완료 시)
    if (numbersOnly.length === 4) {
      const month = parseInt(numbersOnly.substring(0, 2), 10);
      const day = parseInt(numbersOnly.substring(2), 10);

      if (updateDateIfValid(month, day)) {
        lastValidValueRef.current = formattedValue;
      }
    }
  };

  // 월/일이 유효한지 검사하고 Date 객체로 변환
  const updateDateIfValid = (month: number, day: number) => {
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      // 각 월의 최대 일수 확인
      const maxDays = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (day <= maxDays[month]) {
        const currentYear = new Date().getFullYear();
        const date = new Date(currentYear, month - 1, day);
        onChange(date);
        return true;
      }
    }
    return false;
  };

  // 간소화된 입력 파서
  const parseNumericInput = (value: string): [number, number] | null => {
    // 점을 제거하고 숫자만 추출
    const numbersOnly = value.replace(/[^\d]/g, '');

    if (numbersOnly.length >= 3) {
      // 2자리 이상은 월, 나머지는 일
      const month = parseInt(numbersOnly.substring(0, 2), 10);
      const day = parseInt(numbersOnly.substring(2), 10) || 1; // 일이 없으면 1일로 설정
      return [month, day];
    } else if (numbersOnly.length === 2) {
      // 첫 자리는 월, 두 번째 자리는 일
      const month = parseInt(numbersOnly.substring(0, 1), 10);
      const day = parseInt(numbersOnly.substring(1, 2), 10);
      return [month, day];
    } else if (numbersOnly.length === 1) {
      // 한 자리는 월, 일은 1일로
      return [parseInt(numbersOnly, 10), 1];
    }

    return null;
  };

  // 포커스를 잃을 때 포맷팅 및 유효성 검사
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);

    // 입력값이 비어있으면 그대로 두기
    if (!inputValue.trim()) {
      setInputValue('');
      setError('');
      onChange(null);
      return;
    }

    // 입력값 해석 시도
    const parsedDate = parseNumericInput(inputValue);

    if (parsedDate) {
      const [month, day] = parsedDate;

      // 유효한 날짜인지 확인
      if (updateDateIfValid(month, day)) {
        // 유효한 날짜면 포맷팅
        const formattedValue =
          month.toString().padStart(2, '0') + '.' + day.toString().padStart(2, '0');
        setInputValue(formattedValue);
        setError(''); // 오류 메시지 초기화
        lastValidValueRef.current = formattedValue;
        return;
      }
    }

    // 유효하지 않은 날짜일 경우 오류 메시지 표시하고 유지
    setError('알맞는 날짜 형식을 입력해주세요');
    onChange(null);
  };

  // 포커스 시 전체 선택
  const handleFocus = () => {
    setIsEditing(true);
    if (inputRef.current) {
      inputRef.current.select();
    }
  };

  // selected prop이 변경되었을 때 내부 상태 업데이트 - 단, 오류 상태는 유지
  useEffect(() => {
    // 새 selected 값이 들어왔고 편집 중이 아니고, 기존 값과 다를 때만 갱신
    if (!isEditing && selected) {
      const newFormattedValue = getFormattedValue(selected);
      if (newFormattedValue !== inputValue) {
        setInputValue(newFormattedValue);
        lastValidValueRef.current = newFormattedValue;
        // 여기서 error를 초기화하지 않음 - 오류 상태는 유지
      }
    } else if (!isEditing && !selected && lastValidValueRef.current) {
      // selected가 null이고 마지막 유효값이 있으면, 입력값은 유지하고 오류 메시지도 유지
    }
  }, [selected, isEditing]);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholderText}
        className={`w-full h-10 px-3 border text-sm text-center ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-blue-500 focus:border-blue-500'} ${className}`}
        maxLength={5}
      />
      {/* 에러 메시지를 절대 위치로 변경 */}
      {error && <div className="absolute left-0 mt-1 text-xs text-red-500 w-full">{error}</div>}
    </div>
  );
}
