import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import './MonthDayInput.css'; // 필요한 경우 이 CSS 파일도 생성해야 합니다

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
}: Readonly<MonthDayInputProps>) {
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentMonth, setCurrentMonth] = useState<number>(
    selected ? selected.getMonth() : new Date().getMonth(),
  );
  const [selectedMonth, setSelectedMonth] = useState<number | null>(
    selected ? selected.getMonth() : null,
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    selected ? selected.getDate() : null,
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // 월, 일로 포맷팅된 문자열 반환
  const formatMonthDay = (month: number, day: number): string => {
    return `${(month + 1).toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
  };

  // selected prop이 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (selected) {
      setSelectedMonth(selected.getMonth());
      setSelectedDay(selected.getDate());
      setCurrentMonth(selected.getMonth());
      setInputValue(formatMonthDay(selected.getMonth(), selected.getDate()));
    } else {
      setSelectedMonth(null);
      setSelectedDay(null);
      setInputValue('');
    }
  }, [selected]);

  // 드롭다운 위치 계산
  useEffect(() => {
    if (isOpen && inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 5,
        left: rect.left,
      });
    }
  }, [isOpen]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.month-day-dropdown');
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // 입력값 포맷팅 및 검증
  const formatDateString = (input: string): string => {
    const digitsOnly = input.replace(/[^\d.]/g, '');
    const numbers = digitsOnly.replace(/\./g, '');

    if (numbers.length === 0) return '';

    let formatted = '';

    // 월 처리 (최대 2자리)
    if (numbers.length > 0) {
      const monthPart = numbers.substring(0, Math.min(2, numbers.length));

      // 월이 12를 초과하지 않도록 검사
      let monthNum = parseInt(monthPart, 10);
      if (monthPart.length === 2 && monthNum > 12) {
        monthNum = 12;
      }

      formatted = monthNum.toString().padStart(monthPart.length, '0');

      // 월이 완성되고 추가 숫자가 있으면 일 처리
      if (numbers.length > 2) {
        formatted += '.';

        // 일 처리 (최대 2자리)
        const dayPart = numbers.substring(2, Math.min(4, numbers.length));

        // 일이 해당 월의 최대일수를 초과하지 않도록 검사
        const monthIndex = parseInt(formatted.split('.')[0], 10) - 1;
        const year = new Date().getFullYear(); // 현재 연도 사용
        const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();

        let dayNum = parseInt(dayPart, 10);
        if (dayPart.length === 2 && dayNum > lastDayOfMonth) {
          dayNum = lastDayOfMonth;
        } else if (dayNum === 0 && dayPart.length > 0) {
          dayNum = 1;
        }

        formatted += dayNum.toString().padStart(dayPart.length, '0');
      }
    }

    return formatted;
  };

  // 입력값 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const formattedValue = formatDateString(newValue);
    setInputValue(formattedValue);
  };

  // 캘린더 토글
  const toggleCalendar = () => {
    setIsOpen(!isOpen);
  };

  // 입력 필드 클릭 처리
  const handleInputClick = () => {
    toggleCalendar();
  };

  // 입력 필드 포커스 아웃 처리
  const handleInputBlur = () => {
    try {
      // 입력값이 비어있는 경우
      if (inputValue.trim() === '') {
        setSelectedMonth(null);
        setSelectedDay(null);
        if (onChange) onChange(null);
        return;
      }

      // 입력된 값 검증
      const parts = inputValue.split('.');

      let month = parts[0] ? parseInt(parts[0].trim(), 10) - 1 : 0;
      let day = parts.length > 1 && parts[1] ? parseInt(parts[1].trim(), 10) : 1;

      // 값 범위 검증
      if (month < 0 || month > 11) month = 0;

      const year = new Date().getFullYear(); // 현재 연도 사용
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      if (day < 1 || day > lastDayOfMonth) day = 1;

      const newDate = new Date(year, month, day);

      // 유효한 날짜인지 확인
      if (!isNaN(newDate.getTime())) {
        setSelectedMonth(month);
        setSelectedDay(day);
        setCurrentMonth(month);

        // 콜백 함수 호출
        if (onChange) onChange(newDate);

        // 형식화된 값으로 업데이트
        setInputValue(formatMonthDay(month, day));
      } else {
        // 유효하지 않은 경우 이전 선택 상태로 복원
        if (selectedMonth !== null && selectedDay !== null) {
          setInputValue(formatMonthDay(selectedMonth, selectedDay));
        } else {
          setInputValue('');
        }
      }
    } catch (error) {
      // 파싱 오류 시 이전 선택 상태로 복원
      if (selectedMonth !== null && selectedDay !== null) {
        setInputValue(formatMonthDay(selectedMonth, selectedDay));
      } else {
        setInputValue('');
      }
    }
  };

  // 날짜 선택 처리
  const handleDateSelect = (month: number, day: number) => {
    setSelectedMonth(month);
    setSelectedDay(day);

    // 현재 연도 사용
    const year = new Date().getFullYear();
    const newDate = new Date(year, month, day);

    setInputValue(formatMonthDay(month, day));

    // 콜백 함수 호출
    if (onChange) onChange(newDate);

    // 달력 닫기
    setIsOpen(false);
  };

  // 월 변경 처리
  const handleMonthChange = (direction: 'prev' | 'next') => {
    let newMonth = currentMonth;

    if (direction === 'prev') {
      newMonth = (currentMonth - 1 + 12) % 12; // 12월을 지나 1월로 이동
    } else {
      newMonth = (currentMonth + 1) % 12; // 12월을 지나 1월로 이동
    }

    setCurrentMonth(newMonth);
  };

  // 달력 일 데이터 생성
  const getDaysInMonth = () => {
    const year = new Date().getFullYear(); // 현재 연도 사용

    // 현재 월의 첫 날
    const firstDay = new Date(year, currentMonth, 1);
    // 다음 월의 첫 날 - 1 = 현재 월의 마지막 날
    const lastDay = new Date(year, currentMonth + 1, 0);

    // 첫 날의 요일 (0 = 일요일, 6 = 토요일)
    const firstDayOfWeek = firstDay.getDay();
    // 월의 총 일수
    const daysInMonth = lastDay.getDate();

    // 캘린더 그리드에 표시할 날짜 데이터
    const days: number[] = [];

    // 현재 달의 모든 일자 추가
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return { days, firstDayOfWeek };
  };

  // 달력 드롭다운 컴포넌트
  const MonthDayDropdown = () => {
    const { days, firstDayOfWeek } = getDaysInMonth();
    const monthNames = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ];

    // 요일 라벨 (한국어)
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    return (
      <div
        className="month-day-dropdown"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="month-day-container">
          <div className="month-day-header">
            <button
              className="nav-button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMonthChange('prev');
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <div className="current-month">{monthNames[currentMonth]}</div>
            <button
              className="nav-button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleMonthChange('next');
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="weekdays-header">
            {weekdays.map((day, i) => (
              <div
                key={i}
                className={`weekday ${i === 0 ? 'sunday' : ''} ${i === 6 ? 'saturday' : ''}`}
              >
                {day}
              </div>
            ))}
          </div>

          <div className="days-grid">
            {/* 첫 날의 요일에 맞게 빈 셀 추가 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="day empty"></div>
            ))}

            {/* 모든 일자 표시 */}
            {days.map((day) => {
              const isSelected = currentMonth === selectedMonth && day === selectedDay;
              const dayOfWeek = new Date(new Date().getFullYear(), currentMonth, day).getDay();

              return (
                <div
                  key={day}
                  className={`day ${isSelected ? 'selected' : ''} ${dayOfWeek === 0 ? 'sunday' : ''} ${dayOfWeek === 6 ? 'saturday' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDateSelect(currentMonth, day);
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`month-day-input-container ${className}`}>
      <div className="month-day-input-wrapper" ref={inputContainerRef}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onClick={handleInputClick}
          placeholder={placeholderText}
          inputMode="numeric"
          className="month-day-input-field"
        />
        <button
          type="button"
          className="calendar-icon-button"
          onClick={toggleCalendar}
          aria-label="달력 열기"
        >
          <Calendar size={20} />
        </button>
      </div>
      {isOpen && createPortal(<MonthDayDropdown />, document.body)}
    </div>
  );
}
