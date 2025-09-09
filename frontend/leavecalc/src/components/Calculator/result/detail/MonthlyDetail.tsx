// src/components/Calculator/result/detail/MonthlyDetail.tsx
import React, { useMemo } from 'react';
import { Section, InfoGrid, RangeText, SimpleTable } from './_shared';
import type { MonthlyDetail as MonthlyDetailModel } from '../../resultTypes';

export default function MonthlyDetail({ detail }: { detail: MonthlyDetailModel }) {
  // ✅ detail이 비어있거나 records가 없을 때 안전 처리
  const rows = useMemo(
    () =>
      (detail?.records ?? []).map((r) => ({
        month: <RangeText start={r?.period?.startDate ?? ''} end={r?.period?.endDate ?? ''} />,
        days: r?.monthlyLeave ?? 0,
      })),
    [detail],
  );

  return (
    <div className="p-4">
      <Section title="월별 발생 현황">
        <SimpleTable
          columns={[
            { key: 'month', header: '기간', align: 'left' },
            { key: 'days', header: '발생 일수', align: 'right', width: 120 },
          ]}
          rows={rows}
        />
        <div className="mt-3 flex items-center justify-end text-sm text-neutral-700">
          총 합계 :<span className="ml-1 font-semibold">{detail?.totalLeaveDays ?? 0}</span>
        </div>
      </Section>

      <Section title="상세 정보">
        <InfoGrid
          rows={[
            {
              kind: 'row',
              label: '연차 산정 기간',
              value: (
                <RangeText
                  start={detail?.accrualPeriod?.startDate ?? ''}
                  end={detail?.accrualPeriod?.endDate ?? ''}
                />
              ),
            },
            {
              kind: 'row',
              label: '사용 가능 기간',
              value: (
                <RangeText
                  start={detail?.availablePeriod?.startDate ?? ''}
                  end={detail?.availablePeriod?.endDate ?? ''}
                />
              ),
            },
            {
              kind: 'row',
              label: '근속연수',
              value: typeof detail?.serviceYears === 'number' ? `${detail.serviceYears} 년` : '-',
            },
            {
              kind: 'row',
              label: '출근율',
              value:
                detail?.attendanceRate != null
                  ? `${(detail.attendanceRate * 100).toFixed(1)}%`
                  : '-',
            },
            {
              kind: 'row',
              label: '소정근로비율',
              value:
                detail?.prescribedWorkingRatio != null
                  ? `${(detail.prescribedWorkingRatio * 100).toFixed(1)}%`
                  : '-',
            },
            { kind: 'divider' },
            {
              kind: 'row',
              label: '총 발생 연차',
              value: <span className="font-semibold">{detail.totalLeaveDays} 일</span>,
            },
          ]}
        />
      </Section>
    </div>
  );
}
