// components/ui/ReasonSelect.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

type Option = { value: number; label: string };

export default function ReasonSelect({
  value,
  onChange,
  options,
  disabled,
  className = '',
  placeholder = '사유 선택',
}: {
  value: number | null;
  onChange: (v: number) => void;
  options: Option[];
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const current = useMemo(() => options.find((o) => o.value === value) || null, [options, value]);

  // 바깥 클릭 닫기
  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (btnRef.current?.contains(t)) return;
      if (listRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  // 키보드 접근
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    if (!open) return;
    const curIdx = current ? options.findIndex((o) => o.value === current.value) : -1;
    setActiveIndex(curIdx);
  }, [open, current, options]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(options.length - 1, (i < 0 ? -1 : i) + 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, (i < 0 ? options.length : i) - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt) {
        onChange(opt.value);
        setOpen(false);
      }
    }
  };

  return (
    <div className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen(!open)}
        className={[
          'w-full inline-flex items-center justify-center',
          'rounded-md border px-3 py-2 text-sm bg-white',
          disabled
            ? 'border-neutral-200 bg-neutral-100 text-neutral-500 cursor-not-allowed'
            : 'border-[#e2e8f0] text-neutral-800 hover:bg-neutral-50 focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]',
        ].join(' ')}
      >
        <span className={current ? '' : 'text-neutral-400'}>
          {current ? current.label : placeholder}
        </span>
      </button>

      {open && !disabled && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-neutral-200 bg-white shadow-lg"
        >
          {options.map((opt, idx) => {
            const selected = value === opt.value;
            const active = idx === activeIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(e) => {
                  // mousedown에서 바로 선택(blur 전에)
                  e.preventDefault();
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={[
                  'cursor-pointer px-3 py-2 text-sm',
                  selected ? 'text-blue-700' : 'text-neutral-800',
                  active ? 'bg-blue-50' : 'hover:bg-neutral-50',
                ].join(' ')}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
