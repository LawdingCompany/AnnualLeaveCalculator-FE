import React from 'react';

export interface MonthSelectProps {
  value: string; // "01" ~ "12"
  onChange: (mm: string) => void;
  disabled?: boolean;
  className?: string; // Tailwind width 등 외부에서 제어 (예: "w-[80px]")
  id?: string;
  name?: string;
  center?: boolean; // 텍스트 가운데 정렬 (기본 true)
}

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const mm = String(i + 1).padStart(2, '0');
  const label = String(i + 1); // 표시: 1~12 (앞 0 없음)
  return { value: mm, label };
});

export default function MonthSelect({
  value,
  onChange,
  disabled,
  className = 'w-[80px]',
  id,
  name,
  center = true,
}: MonthSelectProps) {
  return (
    <>
      <select
        id={id}
        name={name}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'rounded-md border px-3 py-2 text-sm outline-none',
          'border-neutral-300 focus:border-blue-600',
          'disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
          center ? 'text-center [text-align-last:center]' : '',
          className,
        ].join(' ')}
        aria-label="월 선택"
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value} className="text-left">
            {m.label}
          </option>
        ))}
      </select>
    </>
  );
}
