// CustomDatePicker.tsx (전체 교체)
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

// 요일/월 라벨
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

// ✅ 법개정 최소 선택일
const LAW_MIN_DATE = new Date(2017, 4, 30); // 2017-05-30 (0=1월)

// 스크롤 부모들 찾기 (overflow: auto|scroll)
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

export default function CustomDatePicker({
  selected,
  onChange,
  placeholderText = 'YYYY.MM.DD',
  className = '',
  minDate = null,
  maxDate = null,
}: CustomDatePickerProps) {
  const currentYear = new Date().getFullYear();

  const [currentDate, setCurrentDate] = useState<Date>(selected || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(selected);
  const [view, setView] = useState<CalendarView>('day');
  const [inputValue, setInputValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 드롭다운 위치/너비
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [dropdownWidth, setDropdownWidth] = useState<number | undefined>(undefined);

  const [yearRange, setYearRange] = useState<[number, number]>([2017, currentYear + 5]);

  const inputRef = useRef<HTMLInputElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // ✅ props.minDate와 법개정일 중 더 큰 값
  const effectiveMinDate: Date | null = minDate
    ? minDate < LAW_MIN_DATE
      ? LAW_MIN_DATE
      : minDate
    : LAW_MIN_DATE;
  const effectiveMaxDate: Date | null = maxDate ?? null;

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

  useEffect(() => {
    if (selectedDate) formatAndSetInputValue(selectedDate);
    else setInputValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ⬇️ 드롭다운 위치 업데이트
  const updatePosition = () => {
    if (!inputContainerRef.current) return;
    const rect = inputContainerRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 5, // fixed 기준이므로 scrollY 더하지 않음
      left: rect.left,
    });
    setDropdownWidth(rect.width);
  };

  // 열려 있을 때 스크롤/리사이즈/리사이즈옵저버로 따라붙기
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

  const handleInputClick = () => setIsOpen(true);

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

      if (year < 2017 || year > currentYear + 5) year = currentYear;
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
    const nowY = new Date().getFullYear();
    if (year >= 2017 && year <= nowY + 5) {
      const newDate = new Date(currentDate);
      newDate.setFullYear(year);
      setCurrentDate(newDate);
      setView('month');
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const nowY = new Date().getFullYear();
    if (view === 'day') newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    else if (view === 'month')
      newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
    else if (view === 'year') {
      const [start, end] = yearRange;
      const size = end - start + 1;
      let ns = start + (direction === 'next' ? size : -size);
      let ne = end + (direction === 'next' ? size : -size);
      if (ns < 2017) {
        ns = 2017;
        ne = ns + size - 1;
      }
      if (ne > nowY + 5) {
        ne = nowY + 5;
        ns = ne - size + 1;
        if (ns < 2017) ns = 2017;
      }
      setYearRange([ns, ne]);
      return;
    }
    setCurrentDate(newDate);
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
            const today = isSameDay(day.date, new Date());
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

          const disabled = monthLastTs < min || monthFirstTs > max; // ✅ 모두 number
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

  const renderYearView = () => {
    const nowY = new Date().getFullYear();
    const [startYear, endYear] = yearRange;

    const min = effectiveMinDate ? effectiveMinDate.getTime() : Number.NEGATIVE_INFINITY;
    const max = effectiveMaxDate ? effectiveMaxDate.getTime() : Number.POSITIVE_INFINITY;

    const years: { year: number; disabled: boolean }[] = [];
    const actualStart = Math.max(2017, startYear);
    const actualEnd = Math.min(nowY + 5, endYear);

    for (let y = actualStart; y <= actualEnd; y++) {
      const yearFirstTs = new Date(y, 0, 1).getTime();
      const yearLastTs = new Date(y, 11, 31).getTime();
      const disabled = yearLastTs < min || yearFirstTs > max; // ✅ 모두 number
      years.push({ year: y, disabled });
    }

    return (
      <div className="years-grid">
        {years.map((y, i) => (
          <div
            key={i}
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
                e.stopPropagation();
                return;
              }
              e.preventDefault();
              e.stopPropagation();
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
              style={{ position: 'relative', zIndex: 10, userSelect: 'none' }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setView((v) => (v === 'day' ? 'month' : v === 'month' ? 'year' : 'day'));
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
