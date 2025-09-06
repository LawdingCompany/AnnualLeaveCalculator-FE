// src/components/Calculator/result/detail/ComboDetail.tsx
import { BigSection, Section } from './_shared';
import MonthlyDetail from './MonthlyDetail';
import ProratedDetail from './ProratedDetail';
import type {
  MonthlyDetail as MonthlyDetailModel,
  ProratedDetail as ProratedDetailModel,
  MonthlyAndProratedDetail as MonthlyAndProratedDetailModel,
} from '../../resultTypes';

// ✅ 호출부가 두 가지 형태 중 무엇을 주더라도 받아서 정규화
type ComboDetailInput =
  | { monthly: MonthlyDetailModel; prorated: ProratedDetailModel } // (구) 우리 커스텀 포맷
  | MonthlyAndProratedDetailModel; // (정식) API 포맷

function toPair(detail: ComboDetailInput): {
  monthly: MonthlyDetailModel | undefined;
  prorated: ProratedDetailModel | undefined;
} {
  if ('monthlyDetail' in detail && 'proratedDetail' in detail) {
    return { monthly: detail.monthlyDetail, prorated: detail.proratedDetail };
  }
  // 구 포맷
  return { monthly: (detail as any).monthly, prorated: (detail as any).prorated };
}

export default function ComboDetail({ detail }: { detail: ComboDetailInput }) {
  const { monthly, prorated } = toPair(detail);

  return (
    <div className="p-4 space-y-6">
      <BigSection title="<월차>">
        {/* ✅ 없을 가능성 대비 */}
        {monthly ? (
          <MonthlyDetail detail={monthly} />
        ) : (
          <div className="text-sm text-neutral-500">월차 상세 없음</div>
        )}
      </BigSection>
      <BigSection title="<비례연차>">
        {prorated ? (
          <ProratedDetail detail={prorated} />
        ) : (
          <div className="text-sm text-neutral-500">비례연차 상세 없음</div>
        )}
      </BigSection>
    </div>
  );
}
