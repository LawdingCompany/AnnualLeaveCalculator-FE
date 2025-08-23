import {
  Header,
  ApplicationMode,
  HireAndReference,
  SpecialPeriodsSection,
  SubmitBar,
  FAQ,
  GuidelineHint,
  CompanyHolidaysSection,
  FeedbackModal,
} from './';
import React, { useState } from 'react';
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
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const onSubmit = async () => {
    const uiPeriods = state.specialPeriodsEnabled ? state.nonWorkingPeriods : [];
    const uiHolidays = state.companyHolidaysEnabled ? state.companyHolidays : [];
    // 1) UI payload (런타임 형식 검증)
    const uiPayload = {
      calculationType: state.calculationType,
      hireDate: state.hireDate,
      referenceDate: state.referenceDate,
      nonWorkingPeriods: uiPeriods, // subtype 유지
      companyHolidays: uiHolidays,
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
        <CompanyHolidaysSection />
        <SubmitBar onSubmit={onSubmit} />
        <hr className="h-px border-0 bg-[#e2e8f0]" />
        <FAQ />
        <FooterLinks />
      </section>
      {/* 🔵 우측 하단 고정 ‘피드백’ 버튼 */}
      <button
        className="fixed bottom-6 right-6 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg hover:bg-blue-700"
        onClick={() => setFeedbackOpen(true)}
      >
        피드백
      </button>

      <FeedbackModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
        onSubmitted={() => {
          // 제출 완료 후 추가 액션 필요하면 여기에
        }}
      />
    </main>
  );
}
