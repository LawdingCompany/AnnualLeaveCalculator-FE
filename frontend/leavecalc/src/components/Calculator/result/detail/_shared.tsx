// src/components/Calculator/result/detail/_shared.tsx
import React from 'react';

export function Section({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mb-6 ${className}`}>
      <h3 className="font-semibold text-neutral-800 mb-3">{title}</h3>
      <div className="rounded-lg border border-neutral-200 p-3 bg-white">{children}</div>
    </section>
  );
}

export function BigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">{title}</h2>
      <div className="rounded-lg border border-neutral-200 p-3 bg-white">{children}</div>
    </section>
  );
}

// InfoGrid: 분기식별자(discriminated union)로 안전하게 타이핑
type InfoRow = { kind: 'row'; label: string; value: React.ReactNode } | { kind: 'divider' };

export function InfoGrid({ rows, labelWidth = 160 }: { rows: InfoRow[]; labelWidth?: number }) {
  return (
    <div className="space-y-2">
      {rows.map((r, i) => {
        if (r.kind === 'divider') {
          // 디바이더: 두 컬럼을 가로질러 선
          return (
            <div
              key={`div-${i}`}
              className="grid"
              style={{ gridTemplateColumns: `${labelWidth}px 1fr` }}
            >
              <div className="col-span-2 mx-0">
                <hr className="border-neutral-200" />
              </div>
            </div>
          );
        }

        // 일반 행
        return (
          <div key={i} className="grid" style={{ gridTemplateColumns: `${labelWidth}px 1fr` }}>
            <div className="text-sm leading-[20px] text-neutral-500">{r.label}</div>
            <div className="text-sm leading-[20px] text-neutral-900">{r.value}</div>
          </div>
        );
      })}
    </div>
  );
}

export function RangeText({
  start,
  end,
  placeholder = '-',
}: {
  start?: string | null;
  end?: string | null;
  placeholder?: string;
}) {
  if (!start || !end) return <span>{placeholder}</span>;
  return (
    <span className="tabular-nums">
      {start} ~ {end}
    </span>
  );
}

export function KeyValue({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm leading-[20px]">
      <span className="text-neutral-500">{k}</span>
      <span className="text-neutral-900 tabular-nums">{v}</span>
    </div>
  );
}

export function SimpleTable({
  columns,
  rows,
  numClass = 'tabular-nums',
}: {
  columns: {
    key: string;
    header: string;
    width?: number | string;
    align?: 'left' | 'right' | 'center';
  }[];
  rows: Record<string, React.ReactNode>[];
  numClass?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200">
            {columns.map((c) => (
              <th
                key={c.key}
                className={`py-2 text-neutral-500 font-medium ${
                  c.align === 'right'
                    ? 'text-right'
                    : c.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                }`}
                style={{ width: c.width }}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-neutral-100">
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`py-2 ${
                    c.align === 'right'
                      ? 'text-right'
                      : c.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                  } ${numClass}`}
                >
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// default export가 ExplanationSection이라면 그대로 유지
export default function ExplanationSection({
  explanations,
  nonWorkingExplanations,
}: {
  explanations: string[];
  nonWorkingExplanations?: string[];
}) {
  if (
    (!explanations || explanations.length === 0) &&
    (!nonWorkingExplanations || nonWorkingExplanations.length === 0)
  )
    return null;

  return (
    <div className="space-y-6">
      {explanations?.length > 0 && (
        <section>
          <h4 className="ml-4 mb-2 font-semibold text-neutral-800">계산 기준 설명</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
            {explanations.map((txt, i) => (
              <li key={i}>{txt}</li>
            ))}
          </ul>
        </section>
      )}
      {nonWorkingExplanations?.length ? (
        <section>
          <h4 className="ml-4 mb-2 font-semibold text-neutral-800">특이사항 관련 설명</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-700">
            {nonWorkingExplanations.map((txt, i) => (
              <li key={i}>{txt}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
