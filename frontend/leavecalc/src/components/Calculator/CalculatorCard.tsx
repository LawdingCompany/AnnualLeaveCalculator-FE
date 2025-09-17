import {
  Header,
  ApplicationMode,
  HireAndReference,
  SpecialPeriodsSection,
  SubmitBar,
  GuideLine,
  GuidelineHint,
  CompanyHolidaysSection,
  FeedbackModal,
} from './';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import FooterLinks from '@components/Footer/FooterLinks';
import { useCalcState, useCalcDispatch } from './context';
import { uiPayloadSchema, mapSubtypeToCategory } from './types';
import type { ApiNonWorkingPeriod, ApiPayload } from './types';
import FAQModal from './FAQModal';
import HelpDrawer from './HelpDrawer';
import ResultView from './ResultView';

const API_BASE = import.meta.env.VITE_API_BASE;

const nextFrame = () => new Promise<void>((res) => requestAnimationFrame(() => res()));

// ---------- API ----------
async function postCalculate(payload: ApiPayload) {
  const url = `${API_BASE}/annual-leaves/calculate`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  const json = await res.json();
  return json;
}

export function CalculatorCard() {
  const state = useCalcState();
  const dispatch = useCalcDispatch();

  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideInitial, setGuideInitial] = useState<
    'accuracy' | 'glossary' | 'disclaimer' | undefined
  >(undefined);
  const [faqOpen, setFaqOpen] = useState(false);

  // ✅ 계산 로딩 상태
  const [calculating, setCalculating] = useState(false);

  // ✅ 카드 DOM 참조 (카드 영역만 덮기 위해 좌표/반경 필요)
  const cardRef = useRef<HTMLElement | null>(null);
  const [overlayRect, setOverlayRect] = useState<DOMRect | null>(null);
  const [overlayRadius, setOverlayRadius] = useState<string>('12px'); // 기본값: rounded-xl 대략

  const openGuide = (section?: 'accuracy' | 'glossary' | 'disclaimer') => {
    setGuideInitial(section);
    setGuideOpen(true);
  };

  // ✅ 로딩 중 카드 박스 좌표 + border-radius 추적
  useEffect(() => {
    if (!calculating) {
      setOverlayRect(null);
      return;
    }
    const update = () => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setOverlayRect(rect);

        // 카드의 실제 border-radius를 읽어 동일 적용
        const br = getComputedStyle(cardRef.current).borderRadius;
        if (br) setOverlayRadius(br);
      }
    };

    update(); // 최초 1회
    const onScroll = () => update();
    const onResize = () => update();

    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    const raf = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [calculating]);

  const onSubmit = async () => {
    setCalculating(true);

    // 스피너가 실제로 한 번은 그려지도록 브라우저에 한 프레임 양보
    await nextFrame();

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
      setCalculating(false);
      return;
    }

    // UI → API 변환
    const apiPeriods: ApiNonWorkingPeriod[] | undefined = parsed.data.nonWorkingPeriods?.map(
      (p) => ({
        type: mapSubtypeToCategory(p.subtype),
        startDate: p.startDate,
        endDate: p.endDate,
      }),
    );

    const apiPayload: ApiPayload = {
      calculationType: parsed.data.calculationType,
      hireDate: parsed.data.hireDate,
      referenceDate: parsed.data.referenceDate,
      ...(parsed.data.fiscalYear ? { fiscalYear: parsed.data.fiscalYear } : {}),
      ...(apiPeriods && apiPeriods.length > 0 ? { nonWorkingPeriods: apiPeriods } : {}),
      ...(parsed.data.companyHolidays && parsed.data.companyHolidays.length > 0
        ? { companyHolidays: parsed.data.companyHolidays }
        : {}),
    };

    try {
      const result = await postCalculate(apiPayload);

      // 결과 반영은 한 번에
      dispatch({ type: 'SET_RESULT', payload: result });
      dispatch({ type: 'SET_VIEW', payload: 'result' });
    } catch (e) {
      console.error(e);
      alert('서버 통신에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setCalculating(false);
    }
  };

  const isResult = state.view === 'result' && state.result;

  // ✅ 카드만 덮는 포털 오버레이 (흐림 제거 + 테두리 둥글게 적용)
  const overlayPortal = useMemo(() => {
    if (!calculating || !overlayRect) return null;
    const style: React.CSSProperties = {
      position: 'fixed',
      top: overlayRect.top,
      left: overlayRect.left,
      width: overlayRect.width,
      height: overlayRect.height,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '12px',
      background: 'rgba(23,23,23,0.30)', // neutral-900/30
      borderRadius: overlayRadius, // ✅ 카드의 radius 그대로
    };
    return createPortal(
      <div style={style} role="status" aria-live="polite" aria-label="연차 계산 진행 중">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-white border-t-transparent"
          aria-hidden="true"
        />
        <p className="text font-medium text-white">계산 중입니다…</p>
        <p className="text font-medium text-white">
          잠시만 기다려주세요. 정확한 연차 계산을 위해 정보를 확인하고 있습니다.
        </p>
      </div>,
      document.body,
    );
  }, [calculating, overlayRect, overlayRadius]);

  return (
    <main
      ref={cardRef}
      className={`relative h-full flex flex-col rounded-xl border border-neutral-200 p-8 ${
        calculating ? 'overflow-hidden' : 'overflow-y-auto'
      }`}
      aria-busy={calculating}
    >
      <Header />

      {isResult ? (
        <div className="mt-6 grid gap-5">
          <ResultView />
        </div>
      ) : (
        <>
          <div className="mt-3">
            <GuidelineHint />
          </div>
          <section className="mt-6 grid gap-5">
            <ApplicationMode />
            <HireAndReference />
            <SpecialPeriodsSection />
            <CompanyHolidaysSection />
            <SubmitBar
              onSubmit={onSubmit}
              disabled={!state.hireDate || !state.referenceDate || calculating}
            />
            <hr className="h-px border-0 bg-[#e2e8f0]" />
            <GuideLine />
            <FooterLinks
              onOpenGuide={(section) => openGuide(section)}
              onOpenFAQ={() => setFaqOpen(true)}
            />
          </section>
        </>
      )}

      {/* 카드만 덮는 포털 오버레이 */}
      {overlayPortal}

      {/* 피드백 버튼 + 모달 */}
      <button
        className="fixed bottom-6 right-6 rounded-full bg-[var(--first)] px-4 py-3 text-white shadow-lg hover:bg-blue-700 disabled:opacity-60"
        onClick={() => setFeedbackOpen(true)}
        disabled={calculating}
      >
        피드백
      </button>
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />

      {/* 도움말/FAQ */}
      <HelpDrawer
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        initialSection={guideInitial}
      />
      <FAQModal open={faqOpen} onClose={() => setFaqOpen(false)} />
    </main>
  );
}
