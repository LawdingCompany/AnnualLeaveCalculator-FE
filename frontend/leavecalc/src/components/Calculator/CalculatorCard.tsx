import {
  Header,
  ApplicationMode,
  HireAndReference,
  SpecialPeriodsSection,
  SubmitBar,
  // FAQ, // 필요 시 활성화
  GuidelineHint,
} from './';
import FooterLinks from '@components/Footer/FooterLinks';
import { useCalcState } from './context';
import { uiPayloadSchema, mapSubtypeToCategory } from './types';
import type { ApiNonWorkingPeriod } from './types';

async function postCalculate(payload: any) {
  const res = await fetch('/api/annual-leave/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export function CalculatorCard() {
  const state = useCalcState();

  const onSubmit = async () => {
    // 1) UI payload (런타임 형식 검증)
    const uiPayload = {
      calculationType: state.calculationType,
      hireDate: state.hireDate,
      referenceDate: state.referenceDate,
      nonWorkingPeriods: state.nonWorkingPeriods, // subtype 유지
      companyHolidays: state.companyHolidays,
      ...(state.calculationType === 2 ? { fiscalYear: state.fiscalYear } : {}),
    };
    const parsed = uiPayloadSchema.safeParse(uiPayload);
    if (!parsed.success) {
      alert('입력값을 확인해주세요. (날짜: YYYY-MM-DD / 회계연도: MM-DD)');
      return;
    }

    // 2) 제출 직전 변환: subtype(1~16) → type(1/2/3)
    const apiPeriods: ApiNonWorkingPeriod[] = parsed.data.nonWorkingPeriods.map((p) => ({
      type: mapSubtypeToCategory(p.subtype),
      startDate: p.startDate,
      endDate: p.endDate,
    }));

    const apiPayload = {
      calculationType: parsed.data.calculationType,
      hireDate: parsed.data.hireDate,
      referenceDate: parsed.data.referenceDate,
      nonWorkingPeriods: apiPeriods, // 서버 스펙 충족
      companyHolidays: parsed.data.companyHolidays,
      ...(parsed.data.calculationType === 2 ? { fiscalYear: parsed.data.fiscalYear } : {}),
    };

    try {
      const result = await postCalculate(apiPayload);
      console.log('RESULT', result);
      alert('계산 완료! 콘솔을 확인하세요.');
      // TODO: 결과 상태/모달/페이지로 표시
    } catch (e) {
      console.error(e);
      alert('서버 통신에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <main className="relative rounded-xl border border-neutral-200 p-8 overflow-y-auto">
      <Header />
      <div className="mt-3">
        <GuidelineHint />
      </div>
      <section className="mt-6 grid gap-5">
        <ApplicationMode />
        <HireAndReference />
        <SpecialPeriodsSection />
        {/* <FAQ /> */}
        <SubmitBar onSubmit={onSubmit} />
        <FooterLinks />
      </section>
    </main>
  );
}
