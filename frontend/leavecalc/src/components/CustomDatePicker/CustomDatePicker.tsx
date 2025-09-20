// CustomDatePicker.tsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import './CustomDatePicker.css';

type CalendarView = 'day' | 'month' | 'year';

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholderText?: string;
  className?: string;
  minDate?: Date | null;
  maxDate?: Date | null;
}

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];
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

// ✅ 고정 연도 범위 (뷰 전용)
const YEAR_MIN = 1980;
const YEAR_MAX = 2035;
const YEAR_BLOCK = 12;

// ✅ 법개정 최소 선택일 (2017-05-31)
const LAW_MIN_DATE = new Date(2017, 4, 31);

// 스크롤 부모들 찾기
function getScrollParents(el: HTMLElement | null): (HTMLElement | Window)[] {
  const res: (HTMLElement | Window)[] = [window];
  let p = el?.parentElement || null;
  const re = /(auto|scroll)/;
  while (p && p !== document.body) {
    const cs = getComputedStyle(p);
    if (re.test(`${cs.overflow}${cs.overflowY}${cs.overflowX}`)) res.push(p);
    p = p.parentElement;
  }
  return res;
}

function getYearBlock(targetYear: number): [number, number] {
  const clamped = Math.min(Math.max(targetYear, YEAR_MIN), YEAR_MAX);
  const offset = Math.floor((clamped - YEAR_MIN) / YEAR_BLOCK);
  const start = YEAR_MIN + offset * YEAR_BLOCK;
  const end = Math.min(start + YEAR_BLOCK - 1, YEAR_MAX); // ✅ 끝만 잘라냄
  return [start, end];
}

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function CustomDatePicker({
  selected,
  onChange,
  placeholderText = 'YYYY.MM.DD',
  className = '',
  minDate = null,
  maxDate = null,
}: CustomDatePickerProps) {
  const now = new Date();
  const TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const currentYear = TODAY.getFullYear();

  // ✅ 선택 가능 범위는 필드별 min/max로 제한
  const effectiveMinDate: Date | null = minDate ?? LAW_MIN_DATE;
  const effectiveMaxDate: Date | null = maxDate ?? null;

  const [currentDate, setCurrentDate] = useState<Date>(selected || TODAY);
  const [selectedDate, setSelectedDate] = useState<Date | null>(selected);
  const [view, setView] = useState<CalendarView>('day');
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 드롭다운 위치/너비
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);

  // ✅ 연도 뷰 가시 블록 (항상 12칸)
  const initialYear = selected?.getFullYear() ?? currentYear;
  const [yearRange, setYearRange] = useState<[number, number]>(() => getYearBlock(initialYear));

  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = isMobileDevice();

  // ✅ selected prop 동기화
  useEffect(() => {
    if (selected !== selectedDate) {
      setSelectedDate(selected);
      if (selected) {
        setCurrentDate(selected);
        formatAndSetInputValue(selected);
        // 값이 바뀌면 연도뷰 블록도 맞춰둠
        setYearRange(getYearBlock(selected.getFullYear()));
      } else {
        setInputValue('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // ✅ 마운트 시 인풋값 초기화
  useEffect(() => {
    if (selectedDate) formatAndSetInputValue(selectedDate);
    else setInputValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⬇️ 드롭다운 위치 업데이트
  const updatePosition = () => {
    if (!inputContainerRef.current) return;
    const rect = inputContainerRef.current.getBoundingClientRect();
    setPosition({ top: rect.bottom + 5, left: rect.left });
    setDropdownWidth(rect.width);
  };

  // 열려 있을 때 스크롤/리사이즈에 반응
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const parents = getScrollParents(inputContainerRef.current);
    parents.forEach((p) =>
      p.addEventListener('scroll', updatePosition, { passive: true, capture: true }),
    );
    window.addEventListener('resize', updatePosition, { passive: true });

    const ro = 'ResizeObserver' in window ? new ResizeObserver(() => updatePosition()) : null;
    if (ro && inputContainerRef.current) ro.observe(inputContainerRef.current);

    return () => {
      parents.forEach((p) =>
        p.removeEventListener('scroll', updatePosition, { capture: true } as any),
      );
      window.removeEventListener('resize', updatePosition);
      if (ro && inputContainerRef.current) ro.disconnect();
    };
  }, [isOpen]);

  // 외부 클릭으로 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector('.calendar-dropdown');
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        inputContainerRef.current &&
        !inputContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}.${m}.${d}`;
  };
  const formatAndSetInputValue = (date: Date) => {
    setInputValue(formatDate(date));
  };

  const formatDateString = (input: string): string => {
    const digitsOnly = input.replace(/[^\d.]/g, '');
    const numbers = digitsOnly.replace(/\./g, '');
    if (numbers.length === 0) return '';
    let formatted = '';
    if (numbers.length > 0) {
      const yearPart = numbers.substring(0, Math.min(4, numbers.length));
      formatted = yearPart;
      if (numbers.length > 4) {
        formatted += '.';
        const monthPart = numbers.substring(4, Math.min(6, numbers.length));
        let monthNum = parseInt(monthPart, 10);
        if (monthPart.length === 2 && monthNum > 12) monthNum = 12;
        formatted += monthNum.toString().padStart(monthPart.length, '0');
        if (numbers.length > 6) {
          formatted += '.';
          const dayPart = numbers.substring(6, Math.min(8, numbers.length));
          let dayNum = parseInt(dayPart, 10);
          const yearNum = parseInt(formatted.split('.')[0], 10);
          const monthIndex = parseInt(formatted.split('.')[1], 10) - 1;
          const lastDayOfMonth = new Date(yearNum, monthIndex + 1, 0).getDate();
          if (dayPart.length === 2 && dayNum > lastDayOfMonth) dayNum = lastDayOfMonth;
          else if (dayNum === 0 && dayPart.length > 0) dayNum = 1;
          formatted += dayNum.toString().padStart(dayPart.length, '0');
        }
      }
    }
    return formatted;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatDateString(e.target.value);
    setInputValue(formattedValue);
  };

  const handleInputClick = () => {
    if (isMobile) return; // ✅ 모바일이면 커스텀 달력 안 열림
    setIsOpen(true);
  };

  const isDateInRange = (date: Date): boolean => {
    const t = date.getTime();
    const min = effectiveMinDate ? effectiveMinDate.getTime() : Number.NEGATIVE_INFINITY;
    const max = effectiveMaxDate ? effectiveMaxDate.getTime() : Number.POSITIVE_INFINITY;
    return t >= min && t <= max;
  };

  const isDateDisabled = (date: Date): boolean => !isDateInRange(date);

  const handleInputBlur = () => {
    try {
      if (inputValue.trim() === '') {
        setSelectedDate(null);
        onChange?.(null);
        return;
      }
      const parts = inputValue.split('.');
      let year = parts[0] ? parseInt(parts[0].trim(), 10) : currentYear;
      let month = parts.length > 1 && parts[1] ? parseInt(parts[1].trim(), 10) - 1 : 0;
      let day = parts.length > 2 && parts[2] ? parseInt(parts[2].trim(), 10) : 1;

      if (month < 0 || month > 11) month = 0;
      const lastDay = new Date(year, month + 1, 0).getDate();
      if (day < 1 || day > lastDay) day = 1;

      const newDate = new Date(year, month, day);
      if (!isNaN(newDate.getTime())) {
        if (isDateInRange(newDate)) {
          setSelectedDate(newDate);
          setCurrentDate(newDate);
          onChange?.(newDate);
          formatAndSetInputValue(newDate);
        } else {
          if (effectiveMinDate && newDate < effectiveMinDate) {
            setSelectedDate(effectiveMinDate);
            setCurrentDate(effectiveMinDate);
            onChange?.(effectiveMinDate);
            formatAndSetInputValue(effectiveMinDate);
          } else if (effectiveMaxDate && newDate > effectiveMaxDate) {
            setSelectedDate(effectiveMaxDate);
            setCurrentDate(effectiveMaxDate);
            onChange?.(effectiveMaxDate);
            formatAndSetInputValue(effectiveMaxDate);
          } else if (selectedDate) {
            formatAndSetInputValue(selectedDate);
          } else {
            setInputValue('');
          }
        }
      } else {
        if (selectedDate) formatAndSetInputValue(selectedDate);
        else setInputValue('');
      }
    } catch {
      if (selectedDate) formatAndSetInputValue(selectedDate);
      else setInputValue('');
    }
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    setSelectedDate(date);
    setCurrentDate(date);
    formatAndSetInputValue(date);
    onChange?.(date);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setView('day');
  };

  const handleYearSelect = (year: number) => {
    // 선택 제한은 month/day 단계에서 처리되므로, 여기서는 연도 이동만
    const newDate = new Date(currentDate);
    newDate.setFullYear(year);
    setCurrentDate(newDate);
    setView('month');
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);

    if (view === 'day') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
      setCurrentDate(newDate);
      return;
    }

    if (view === 'month') {
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
      setCurrentDate(newDate);
      return;
    }

    // ✅ year 뷰: 12년 단위 이동, 마지막 블록은 2028~2035처럼 짧아도 그대로
    if (view === 'year') {
      const delta = direction === 'next' ? YEAR_BLOCK : -YEAR_BLOCK;

      // 현재 블록 시작 연도만 12씩 이동
      let [s] = yearRange;
      let ns = s + delta;

      // 블록 경계 클램프
      const lastBlockStart = YEAR_MIN + Math.floor((YEAR_MAX - YEAR_MIN) / YEAR_BLOCK) * YEAR_BLOCK; // 2028
      if (ns < YEAR_MIN) ns = YEAR_MIN;
      if (ns > lastBlockStart) ns = lastBlockStart;

      const ne = Math.min(ns + YEAR_BLOCK - 1, YEAR_MAX); // 끝은 잘려도 OK(예: 2028~2035)
      setYearRange([ns, ne]);
      return;
    }
  };

  const getTitleText = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    if (view === 'day') return `${year}년 ${month + 1}월`;
    if (view === 'month') return `${year}`;
    return `${yearRange[0]} ~ ${yearRange[1]}`;
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days: { date: Date; currentMonth: boolean }[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      const day = prevMonthLastDay - firstDayOfWeek + i + 1;
      days.push({ date: new Date(year, month - 1, day), currentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), currentMonth: true });
    }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), currentMonth: false });
    }
    return days;
  };

  const isSameDay = (d1: Date, d2: Date | null) =>
    !!d2 &&
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

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
            const today = isSameDay(day.date, TODAY);
            const sel = isSameDay(day.date, selectedDate);
            const dow = day.date.getDay();
            const disabled = isDateDisabled(day.date);
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
                  disabled && 'disabled',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseDown={(e) => {
                  if (disabled) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
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

  const renderMonthView = () => {
    const min = effectiveMinDate ? effectiveMinDate.getTime() : Number.NEGATIVE_INFINITY;
    const max = effectiveMaxDate ? effectiveMaxDate.getTime() : Number.POSITIVE_INFINITY;

    return (
      <div className="months-grid">
        {MONTHS.map((m, i) => {
          const monthFirstTs = new Date(currentDate.getFullYear(), i, 1).getTime();
          const monthLastTs = new Date(currentDate.getFullYear(), i + 1, 0).getTime();

          const disabled = monthLastTs < min || monthFirstTs > max;
          return (
            <div
              key={i}
              className={[
                'month',
                currentDate.getMonth() === i && 'selected',
                disabled && 'disabled',
              ]
                .filter(Boolean)
                .join(' ')}
              onMouseDown={(e) => {
                if (disabled) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                e.preventDefault();
                e.stopPropagation();
                handleMonthSelect(i);
              }}
            >
              {m}
            </div>
          );
        })}
      </div>
    );
  };

  // ✅ 연도 뷰: 항상 12칸, 1980~2035 고정 / 선택만 비활성화
  const renderYearView = () => {
    const [startYear, endYear] = yearRange;

    const min = effectiveMinDate ? effectiveMinDate.getTime() : Number.NEGATIVE_INFINITY;
    const max = effectiveMaxDate ? effectiveMaxDate.getTime() : Number.POSITIVE_INFINITY;

    const years: { year: number; disabled: boolean }[] = [];
    for (let y = startYear; y <= endYear; y++) {
      const yearFirstTs = new Date(y, 0, 1).getTime();
      const yearLastTs = new Date(y, 11, 31).getTime();
      const disabled = yearLastTs < min || yearFirstTs > max;
      years.push({ year: y, disabled });
    }

    return (
      <div className="years-grid">
        {years.map((y) => (
          <div
            key={y.year}
            className={[
              'year',
              currentDate.getFullYear() === y.year && 'selected',
              y.disabled && 'disabled',
            ]
              .filter(Boolean)
              .join(' ')}
            onMouseDown={(e) => {
              if (y.disabled) {
                e.preventDefault();
                e.stopPropagation(); // ✅ 추가
                return;
              }
              e.preventDefault();
              e.stopPropagation(); // ✅ 추가
              handleYearSelect(y.year);
            }}
          >
            {y.year}
          </div>
        ))}
      </div>
    );
  };

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

  const CalendarDropdown = () => {
    return (
      <div
        className="calendar-dropdown"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: dropdownWidth ? `${dropdownWidth}px` : undefined,
        }}
      >
        <div className="calendar-container">
          <div
            className="calendar-header"
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
              style={{ position: 'relative', zIndex: 10, userSelect: 'none' }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setView((v) => {
                  if (v === 'day') return 'month';
                  if (v === 'month') {
                    // ⬇️ 연도뷰로 올라갈 때 블록 위치 결정
                    const targetYear = selectedDate?.getFullYear() ?? currentDate.getFullYear();
                    setYearRange(getYearBlock(targetYear));
                    return 'year';
                  }
                  // year -> day 로 내릴 때는 현재 연도 유지
                  return 'day';
                });
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
      <div className="calendar-input-wrapper" ref={inputContainerRef}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onClick={handleInputClick}
          placeholder={placeholderText}
          inputMode="numeric"
          className="calendar-input-field"
        />
        <button
          type="button"
          className="calendar-icon-button"
          onClick={() => {
            // 열 때 연도뷰로 직접 들어올 수도 있으니, 현재 선택/오늘 기준으로 블록 정렬만 미리 맞춰둠
            const baseYear = selectedDate?.getFullYear() ?? TODAY.getFullYear();
            setYearRange(getYearBlock(baseYear));
            setIsOpen((v) => !v);
          }}
          aria-label="달력 열기"
        >
          <Calendar size={18} />
        </button>
      </div>
      {isOpen && createPortal(<CalendarDropdown />, document.body)}
    </div>
  );
}
