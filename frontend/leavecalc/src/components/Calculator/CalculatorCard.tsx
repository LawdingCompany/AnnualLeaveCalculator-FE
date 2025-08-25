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
import { useCalcState, useCalcDispatch } from './context';
import { uiPayloadSchema, mapSubtypeToCategory } from './types';
import type { ApiNonWorkingPeriod } from './types';
import ResultView from './ResultView';

const API_BASE = '/api';

async function postCalculate(payload: any) {
  const url = `${API_BASE}/annual-leaves/calculate`;
  console.groupCollapsed('[AnnualLeave] POST', url);
  console.log('payload', payload);
  console.groupEnd();

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('API error:', res.status, text);
    throw new Error(`API error ${res.status}`);
  }
  const json = await res.json();
  console.log('response', json);
  return json;
}

export function CalculatorCard() {
  const state = useCalcState();
  const dispatch = useCalcDispatch();
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const onSubmit = async () => {
    const uiPeriods = state.specialPeriodsEnabled ? state.nonWorkingPeriods : [];
    const uiHolidays = state.companyHolidaysEnabled ? state.companyHolidays : [];
    const uiPayload = {
      calculationType: state.calculationType,
      hireDate: state.hireDate,
      referenceDate: state.referenceDate,
      nonWorkingPeriods: uiPeriods,
      companyHolidays: uiHolidays,
      ...(state.calculationType === 2 ? { fiscalYear: state.fiscalYear } : {}),
    };
    const parsed = uiPayloadSchema.safeParse(uiPayload);
    if (!parsed.success) {
      alert('입력값을 확인해주세요. (날짜: YYYY-MM-DD / 회계연도: MM-DD)');
      return;
    }

    const apiPeriods: ApiNonWorkingPeriod[] = parsed.data.nonWorkingPeriods.map((p) => ({
      type: mapSubtypeToCategory(p.subtype),
      startDate: p.startDate,
      endDate: p.endDate,
    }));

    const apiPayload = {
      calculationType: parsed.data.calculationType,
      hireDate: parsed.data.hireDate,
      referenceDate: parsed.data.referenceDate,
      nonWorkingPeriods: apiPeriods,
      companyHolidays: parsed.data.companyHolidays,
      ...(parsed.data.calculationType === 2 ? { fiscalYear: parsed.data.fiscalYear } : {}),
    };

    try {
      const result = await postCalculate(apiPayload);
      dispatch({ type: 'SET_RESULT', payload: result });
      dispatch({ type: 'SET_VIEW', payload: 'result' });
    } catch (e) {
      console.error(e);
      alert('서버 통신에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const isResult = state.view === 'result' && state.result;

  return (
    <main className="relative rounded-xl border border-neutral-200 p-8 overflow-y-auto">
      <Header />

      {isResult ? (
        // ✅ 결과 페이지일 때
        <div className="mt-6 grid gap-5">
          <ResultView />
          <hr className="h-px border-0 bg-[#e2e8f0]" />
          {/* ⚠️ 여기서는 Footer를 아예 안 넣음 */}
        </div>
      ) : (
        // ✅ 입력 폼일 때
        <>
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
            <FooterLinks /> {/* 폼 단계에서만 표시 */}
          </section>
        </>
      )}

      {/* 피드백 버튼은 그대로 */}
      <button
        className="fixed bottom-6 right-6 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg hover:bg-blue-700"
        onClick={() => setFeedbackOpen(true)}
      >
        피드백
      </button>
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </main>
  );
}
