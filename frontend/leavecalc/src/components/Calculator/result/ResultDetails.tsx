// src/components/Calculator/result/ResultDetails.tsx
import type { CalcApiResult } from '../resultTypes';
import { fmtDays } from './resultUtils';

export default function ResultDetails({ result }: { result: CalcApiResult }) {
  switch (result.leaveType) {
    case 'ANNUAL': {
      const cd = result.calculationDetail;
      return (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="col-span-2">
            <span className="mr-2 text-neutral-500">산정기간</span>
            <span className="font-medium">
              {cd.accrualPeriod.startDate} ~ {cd.accrualPeriod.endDate}
            </span>
          </div>
          <div>
            <span className="mr-2 text-neutral-500">기본 연차</span>
            <span className="font-medium">{cd.baseAnnualLeave}일</span>
          </div>
          <div>
            <span className="mr-2 text-neutral-500">근속연수</span>
            <span className="font-medium">{cd.serviceYears}년</span>
          </div>
          <div>
            <span className="mr-2 text-neutral-500">가산휴가</span>
            <span className="font-medium">{cd.additionalLeave}일</span>
          </div>
          <div>
            <span className="mr-2 text-neutral-500">총 발생</span>
            <span className="font-semibold">{fmtDays(cd.totalLeaveDays)}일</span>
          </div>
        </div>
      );
    }

    case 'MONTHLY': {
      const cd = result.calculationDetail;
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500">
                <th className="py-2 pr-3">기간</th>
                <th className="py-2">발생</th>
              </tr>
            </thead>
            <tbody>
              {cd.records.map((rec, i) => (
                <tr key={i} className="border-t">
                  <td className="py-2 pr-3">
                    {rec.period.startDate} ~ {rec.period.endDate}
                  </td>
                  <td className="py-2">{fmtDays(rec.monthlyLeave)}일</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t font-semibold">
                <td className="py-2 pr-3">합계</td>
                <td className="py-2">{fmtDays(cd.totalLeaveDays)}일</td>
              </tr>
            </tfoot>
          </table>
        </div>
      );
    }

    case 'PRORATED': {
      const cd = result.calculationDetail;
      return (
        <div className="grid gap-2 text-sm">
          <div>
            <span className="mr-2 text-neutral-500">산정기간</span>
            <span className="font-medium">
              {cd.accrualPeriod.startDate} ~ {cd.accrualPeriod.endDate}
            </span>
          </div>
          <div>
            <span className="mr-2 text-neutral-500">총 발생</span>
            <span className="font-semibold">{fmtDays(cd.totalLeaveDays)}일</span>
          </div>
        </div>
      );
    }

    case 'MONTHLY_AND_PRORATED': {
      const cd = result.calculationDetail;
      return (
        <div className="grid gap-2 text-sm">
          <div>
            <span className="mr-2 text-neutral-500">월차 산정</span>
            <span className="font-medium">
              {cd.monthlyDetail.accrualPeriod.startDate} ~ {cd.monthlyDetail.accrualPeriod.endDate}
            </span>
            <span className="ml-2 text-neutral-500">
              ({fmtDays(cd.monthlyDetail.totalLeaveDays)}일)
            </span>
          </div>
          <div>
            <span className="mr-2 text-neutral-500">비례연차 산정</span>
            <span className="font-medium">
              {cd.proratedDetail.accrualPeriod.startDate} ~{' '}
              {cd.proratedDetail.accrualPeriod.endDate}
            </span>
            <span className="ml-2 text-neutral-500">
              ({fmtDays(cd.proratedDetail.totalLeaveDays)}일)
            </span>
          </div>
          <div>
            <span className="mr-2 text-neutral-500">총 발생</span>
            <span className="font-semibold">{fmtDays(cd.totalLeaveDays)}일</span>
          </div>
        </div>
      );
    }
  }
}
