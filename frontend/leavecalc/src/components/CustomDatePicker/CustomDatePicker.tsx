import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './CustomDatePicker.css';

// 뷰 타입 정의
type CalendarView = 'day' | 'month' | 'year';

// Props 타입 정의
interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  monthDayOnly?: boolean;
  Only?: boolean;
  dateFormat?: string;
  placeholderText?: string;
  className?: string;
}

// 요일 라벨 (한국어)
const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

// 월 라벨 (한국어)
const MONTHS = [
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

export default function CustomDatePicker({
  selected,
  onChange,
  monthDayOnly = false,
  dateFormat = 'YYYY.MM.DD',
  placeholderText = 'YYYY.MM.DD',
  className = '',
}: CustomDatePickerProps) {
  // 현재 연도 계산
  const currentYear = new Date().getFullYear();

  // 현재 날짜 정보 (selected가 있으면 해당 날짜, 없으면 현재 날짜)
  const [currentDate, setCurrentDate] = useState<Date>(selected || new Date());

  // 선택된 날짜 정보
  const [selectedDate, setSelectedDate] = useState<Date | null>(selected);

  // 캘린더 뷰 상태 (일/월/연도)
  const [view, setView] = useState<CalendarView>(monthDayOnly ? 'month' : 'day');

  // 수동 입력을 위한 상태
  const [inputValue, setInputValue] = useState<string>('');

  // 캘린더 표시 여부
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 현재 표시되는 연도 범위 (연도 뷰에서 사용)
  const [yearRange, setYearRange] = useState<[number, number]>([2017, currentYear + 5]);

  // 드롭다운 위치를 위한 상태 추가
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // 수동 입력 필드 및 캘린더 컨테이너 참조
  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // selected prop이 변경되면 내부 상태 업데이트
  useEffect(() => {
    if (selected !== selectedDate) {
      setSelectedDate(selected);
      if (selected) {
        setCurrentDate(selected);
        formatAndSetInputValue(selected);
      } else {
        setInputValue('');
      }
    }
  }, [selected]);

  // 초기 마운트 시와 selected 변경 시 input 값 설정
  useEffect(() => {
    if (selectedDate) {
      formatAndSetInputValue(selectedDate);
    } else {
      setInputValue('');
    }
  }, []);

  // 드롭다운 위치 계산을 위한 useEffect 추가
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 5,
        left: rect.left,
      });
    }
  }, [isOpen]);

  // 외부 클릭 감지 이벤트
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Portal을 사용하므로 calendar-dropdown 클래스를 가진 요소를 직접 찾아서 처리
      const dropdown = document.querySelector('.calendar-dropdown');

      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
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

  // 날짜를 지정된 포맷에 맞게 표시하는 함수
  const formatDate = (date: Date): string => {
    if (monthDayOnly) {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      if (dateFormat === 'MM.DD') {
        return `${month}.${day}`;
      } else {
        return `${month}월 ${day}일`;
      }
    } else {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${year}.${month}.${day}`;
    }
  };

  // 날짜 변경 시 input 값 포맷팅 및 설정
  const formatAndSetInputValue = (date: Date) => {
    const formattedValue = formatDate(date);
    setInputValue(formattedValue);
  };

  // 날짜 문자열 포맷팅 함수
  const formatDateString = (input: string): string => {
    // 숫자와 구분자만 허용
    const digitsOnly = input.replace(/[^\d.]/g, '');

    // 숫자만 추출
    const numbers = digitsOnly.replace(/\./g, '');

    // 숫자가 없으면 빈 문자열 반환
    if (numbers.length === 0) return '';

    let formatted = '';

    // 연도 처리 (최대 4자리)
    if (numbers.length > 0) {
      const yearPart = numbers.substring(0, Math.min(4, numbers.length));
      formatted = yearPart;

      // 연도가 완성되고 추가 숫자가 있으면 월 처리
      if (numbers.length > 4) {
        formatted += '.';

        // 월 처리 (최대 2자리)
        const monthPart = numbers.substring(4, Math.min(6, numbers.length));

        // 월이 12를 초과하지 않도록 검사
        let monthNum = parseInt(monthPart, 10);
        if (monthPart.length === 2 && monthNum > 12) {
          monthNum = 12;
        }

        formatted += monthNum.toString().padStart(monthPart.length, '0');

        // 월 포맷으로만 사용하는 경우는 여기서 종료
        if (monthDayOnly) return formatted;

        // 월이 완성되고 추가 숫자가 있으면 일 처리
        if (numbers.length > 6) {
          formatted += '.';

          // 일 처리 (최대 2자리)
          const dayPart = numbers.substring(6, Math.min(8, numbers.length));

          // 일이 해당 월의 최대일수를 초과하지 않도록 검사
          let dayNum = parseInt(dayPart, 10);
          const yearNum = parseInt(formatted.split('.')[0], 10);
          const monthIndex = parseInt(formatted.split('.')[1], 10) - 1;
          const lastDayOfMonth = new Date(yearNum, monthIndex + 1, 0).getDate();

          if (dayPart.length === 2 && dayNum > lastDayOfMonth) {
            dayNum = lastDayOfMonth;
          } else if (dayNum === 0 && dayPart.length > 0) {
            dayNum = 1;
          }

          formatted += dayNum.toString().padStart(dayPart.length, '0');
        }
      }
    }

    return formatted;
  };

  // 입력된 날짜 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // 입력값을 포맷팅하여 상태 업데이트
    const formattedValue = formatDateString(newValue);
    setInputValue(formattedValue);
  };

  // 입력 필드 클릭 시 캘린더 토글
  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  // 입력에서 포커스가 벗어났을 때 입력값 검증 및 완성
  const handleInputBlur = () => {
    try {
      // 완전히 비어있는 경우 null로 설정
      if (inputValue.trim() === '') {
        setSelectedDate(null);
        if (onChange) onChange(null);
        return;
      }

      // 입력된 날짜 검증
      const parts = inputValue.split('.');

      let year: number, month: number, day: number;

      if (monthDayOnly) {
        // 월/일만 있는 경우 현재 연도 사용
        year = currentYear;
        month = parts.length > 0 && parts[0] ? parseInt(parts[0].trim(), 10) - 1 : 0;
        day = parts.length > 1 && parts[1] ? parseInt(parts[1].trim(), 10) : 1;
      } else {
        // 연/월/일 모두 처리
        year = parts[0] ? parseInt(parts[0].trim(), 10) : currentYear;
        month = parts.length > 1 && parts[1] ? parseInt(parts[1].trim(), 10) - 1 : 0;
        day = parts.length > 2 && parts[2] ? parseInt(parts[2].trim(), 10) : 1;
      }

      // 값 범위 검증
      if (year < 2017 || year > currentYear + 5) year = currentYear;
      if (month < 0 || month > 11) month = 0;

      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
      if (day < 1 || day > lastDayOfMonth) day = 1;

      const newDate = new Date(year, month, day);

      // 유효한 날짜인지 확인
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
        setCurrentDate(newDate);

        // 콜백 함수 호출
        if (onChange) onChange(newDate);

        // 형식화된 날짜 문자열로 입력값 업데이트
        formatAndSetInputValue(newDate);
      } else {
        // 유효하지 않은 날짜인 경우 선택된 날짜가 있으면 그 값으로 복원, 아니면 비움
        if (selectedDate) {
          formatAndSetInputValue(selectedDate);
        } else {
          setInputValue('');
        }
      }
    } catch (error) {
      // 파싱 오류 시 이전 선택 날짜로 복원
      if (selectedDate) {
        formatAndSetInputValue(selectedDate);
      } else {
        setInputValue('');
      }
    }
  };

  // 특정 날짜 선택 처리
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    formatAndSetInputValue(date);

    // 콜백 함수 호출
    if (onChange) onChange(date);

    // 날짜를 선택하면 monthDayOnly가 아닌 경우에만 캘린더 닫기
    if (view === 'day') {
      // setTimeout으로 상태 업데이트 후 닫기 실행
      setTimeout(() => {
        setIsOpen(false);
      }, 0);
      setIsOpen(false);
    }
  };

  // 월 선택 처리
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);

    if (monthDayOnly) {
      // 월만 선택하는 모드인 경우 현재 날짜에 1일로 설정
      setCurrentDate(newDate);
      setView('day');
    } else {
      // 일반 모드에서는 일 선택 뷰로 전환
      setCurrentDate(newDate);
      setView('day');
    }
  };

  // 연도 선택 처리
  const handleYearSelect = (year: number) => {
    // 선택 가능한 연도 범위 내에서만 선택 허용
    const currentYear = new Date().getFullYear();

    if (year >= 2017 && year <= currentYear + 5) {
      const newDate = new Date(currentDate);
      newDate.setFullYear(year);
      setCurrentDate(newDate);
      setView('month');
    }
  };

  // 이전/다음 이동 처리
  const handleNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const currentYear = new Date().getFullYear();

    if (view === 'day') {
      // 일 뷰에서는 월 단위로 이동
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'month') {
      // 월 뷰에서는 연도 단위로 이동
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    } else if (view === 'year') {
      // 연도 뷰에서는 12년 단위로 이동
      const [start, end] = yearRange;
      const rangeSize = end - start + 1;

      // 새 범위가 2017~(현재연도+5) 범위를 벗어나지 않도록 검사
      let newStart = start + (direction === 'next' ? rangeSize : -rangeSize);
      let newEnd = end + (direction === 'next' ? rangeSize : -rangeSize);

      // 범위 제한 적용
      if (newStart < 2017) {
        newStart = 2017;
        newEnd = newStart + rangeSize - 1;
      }

      if (newEnd > currentYear + 5) {
        newEnd = currentYear + 5;
        newStart = newEnd - rangeSize + 1;

        // 시작 연도가 2017보다 작아지지 않도록 조정
        if (newStart < 2017) {
          newStart = 2017;
        }
      }

      setYearRange([newStart, newEnd]);
      return;
    }

    setCurrentDate(newDate);
  };

  // 현재 뷰의 제목 텍스트 생성
  const getTitleText = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    if (view === 'day') {
      return `${year}. ${month + 1}.`;
    } else if (view === 'month') {
      return `${year}`;
    } else {
      return `${yearRange[0]} ~ ${yearRange[1]}`;
    }
  };

  // 현재 월의 일 데이터 생성
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // 현재 월의 첫 날
    const firstDay = new Date(year, month, 1);
    // 다음 월의 첫 날 - 1 = 현재 월의 마지막 날
    const lastDay = new Date(year, month + 1, 0);

    // 첫 날의 요일 (0 = 일요일, 6 = 토요일)
    const firstDayOfWeek = firstDay.getDay();
    // 월의 총 일수
    const daysInMonth = lastDay.getDate();

    // 이전 달의 마지막 날들
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    // 캘린더 그리드에 표시할 날짜 데이터
    const days: { date: Date; currentMonth: boolean }[] = [];

    // 이전 달의 날짜들 추가
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = prevMonthLastDay - firstDayOfWeek + i + 1;
      days.push({
        date: new Date(year, month - 1, day),
        currentMonth: false,
      });
    }

    // 현재 달의 날짜들 추가
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }

    // 다음 달의 날짜들로 나머지 채우기 (최대 42칸 = 6주)
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
      });
    }

    return days;
  };

  // 날짜 비교 헬퍼 함수
  const isSameDay = (d1: Date, d2: Date | null) => {
    if (!d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // 일 뷰 렌더링
  const renderDayView = () => {
    const days = getDaysInMonth();

    return (
      <div className="calendar-day-view">
        <div className="weekdays">
          {DAYS_OF_WEEK.map((d, i) => (
            <div
              key={i}
              className={['weekday', i === 0 && 'sunday', i === 6 && 'saturday']
                .filter(Boolean)
                .join(' ')}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="days-grid">
          {days.map((day, idx) => {
            const today = isSameDay(day.date, new Date());
            const sel = isSameDay(day.date, selectedDate);
            const dow = day.date.getDay();
            return (
              <div
                key={idx}
                className={[
                  'day',
                  !day.currentMonth && 'other-month',
                  today && 'today',
                  sel && 'selected',
                  dow === 0 && 'sunday',
                  dow === 6 && 'saturday',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseDown={(e) => {
                  // onClick 대신 onMouseDown 사용
                  e.preventDefault();
                  e.stopPropagation();
                  handleDateSelect(day.date);
                }}
              >
                <span className="day-number">{day.date.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 월 뷰 렌더링
  const renderMonthView = () => {
    return (
      <div className="months-grid">
        {MONTHS.map((m, i) => (
          <div
            key={i}
            className={['month', currentDate.getMonth() === i && 'selected']
              .filter(Boolean)
              .join(' ')}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMonthSelect(i);
            }}
          >
            {m}
          </div>
        ))}
      </div>
    );
  };

  // 연도 뷰 렌더링
  const renderYearView = () => {
    const currentYear = new Date().getFullYear();
    const [startYear, endYear] = yearRange;
    const years = [];

    // 실제 표시 가능한 연도 범위를 2017년 ~ (현재연도 + 5년)으로 제한
    const actualStartYear = Math.max(2017, startYear);
    const actualEndYear = Math.min(currentYear + 5, endYear);

    for (let year = actualStartYear; year <= actualEndYear; year++) {
      years.push(year);
    }

    return (
      <div className="years-grid">
        {years.map((y, i) => (
          <div
            key={i}
            className={['year', currentDate.getFullYear() === y && 'selected']
              .filter(Boolean)
              .join(' ')}
            onMouseDown={(e) => {
              // onClick 대신 onMouseDown 사용
              e.preventDefault(); // 이벤트 기본 동작 방지
              e.stopPropagation(); // 이벤트 버블링 방지
              handleYearSelect(y);
            }}
          >
            {y}
          </div>
        ))}
      </div>
    );
  };

  // 현재 뷰에 따른 컨텐츠 렌더링
  const renderViewContent = () => {
    switch (view) {
      case 'day':
        return renderDayView();
      case 'month':
        return renderMonthView();
      case 'year':
        return renderYearView();
      default:
        return null;
    }
  };

  // 캘린더 드롭다운 컴포넌트
  const CalendarDropdown = () => {
    return (
      <div
        className="calendar-dropdown"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="calendar-container">
          <div
            className="calendar-header"
            onMouseDown={(e) => {
              // 헤더 영역 클릭 시 이벤트 전파 방지
              if (e.target === e.currentTarget) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <button
              className="nav-button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation('prev');
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="title-button"
              style={{
                position: 'relative',
                zIndex: 10,
                userSelect: 'none',
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();

                // 상태 업데이트를 직접 수행
                if (view === 'day') {
                  setView('month');
                } else if (view === 'month') {
                  setView('year');
                } else {
                  setView('day');
                }
              }}
            >
              {getTitleText()}
            </button>
            <button
              type="button"
              className="nav-button"
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation('next');
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="calendar-content">{renderViewContent()}</div>
        </div>
      </div>
    );
  };

  return (
    <div className={`datepicker-container ${className}`} ref={calendarRef}>
      <div className="calendar-input">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onClick={handleInputClick}
          placeholder={placeholderText}
          inputMode="numeric"
        />
      </div>
      {isOpen && createPortal(<CalendarDropdown />, document.body)}
    </div>
  );
}
