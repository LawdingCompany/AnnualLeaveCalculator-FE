import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface MonthSelectProps {
  value: string; // "01" ~ "12"
  onChange: (mm: string) => void;
  disabled?: boolean;
  className?: string; // ← 폭은 래퍼(div)에 적용 (예: "w-[80px]")
  id?: string;
  name?: string;
  center?: boolean; // 텍스트 가운데 정렬 (기본 true)
}

const MONTHS = Array.from({ length: 12 }, (_, i) => {
  const mm = String(i + 1).padStart(2, '0');
  const label = String(i + 1); // 표시: 1~12
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
    // ✅ 폭/배치는 래퍼에, select는 w-full로
    <div className={['relative', className].join(' ')}>
      <select
        id={id}
        name={name}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'w-full appearance-none', // 커스텀 화살표 사용을 위해
          'rounded-md border px-3 py-2 text-md outline-none',
          'border-[#e2e8f0]', // ✅ DatePicker와 동일 테두리색
          'focus:border-blue-600',
          'focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]', // ✅ 동일 포커스 섀도
          'disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed',
          center ? 'text-center [text-align-last:center] [&>option]:text-center' : '',
        ].join(' ')}
        aria-label="월 선택"
      >
        {MONTHS.map((m) => (
          <option key={m.value} value={m.value} className="text-center">
            {m.label}
          </option>
        ))}
      </select>

      {/* (선택) 네이티브 화살표 대신 동일 톤의 아이콘 */}
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500"
        aria-hidden
      />
    </div>
  );
}
