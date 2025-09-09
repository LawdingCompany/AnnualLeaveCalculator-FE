// src/components/Calculator/result/detail/AnnualDetail.tsx
import { Section, InfoGrid, RangeText } from './_shared';
import type { AnnualDetail as AnnualDetailModel } from '../../resultTypes';

export default function AnnualDetail({ detail }: { detail: AnnualDetailModel }) {
  return (
    <div className="p-4">
      <Section title="상세 정보">
        <InfoGrid
          rows={[
            {
              kind: 'row',
              label: '연차 산정 기간',
              value: (
                <RangeText
                  start={detail.accrualPeriod?.startDate ?? ''}
                  end={detail.accrualPeriod?.endDate ?? ''}
                />
              ),
            },
            {
              kind: 'row',
              label: '사용 가능 기간',
              value: (
                <RangeText
                  start={detail.availablePeriod?.startDate ?? ''}
                  end={detail.availablePeriod?.endDate ?? ''}
                />
              ),
            },
            {
              kind: 'row',
              label: '근속연수',
              value: detail.serviceYears != null ? `${detail.serviceYears} 년` : '-',
            },
            {
              kind: 'row',
              label: '출근율',
              value:
                detail.attendanceRate != null
                  ? `${(detail.attendanceRate * 100).toFixed(1)}%`
                  : '-',
            },
            {
              kind: 'row',
              label: '소정근로비율',
              value:
                detail.prescribedWorkingRatio != null
                  ? `${(detail.prescribedWorkingRatio * 100).toFixed(1)}%`
                  : '-',
            },

            // ── 하단: 발생 일수 요약
            { kind: 'row', label: '기본 연차', value: `${detail.baseAnnualLeave} 일` },
            { kind: 'row', label: '가산 연차', value: `${detail.additionalLeave} 일` },
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
