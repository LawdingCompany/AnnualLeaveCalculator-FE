import React, { lazy, Suspense } from 'react';
import CalculatorProvider, { useCalculator } from '@contexts/CalculatorContext';
import CalculationType from '@components/CalculationType/CalculationType';
import styles from './CalculatorForm.module.scss';

// 지연 로딩을 통한 성능 최적화
const SpecialPeriodSection = lazy(
  () => import('@components/Section/SpecialPeriodSection/SpecialPeriodSection'),
);
const HolidaySection = lazy(() => import('@components/Section/HolidaySection/HolidaySection'));

// 결과 표시 컴포넌트 - 별도로 분리하여 리렌더링 최적화
const CalculationResult = React.memo(() => {
  const { formData } = useCalculator();

  // 결과가 없으면 렌더링하지 않음
  if (!formData.result) return null;

  return (
    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
      <h2 className="text-lg font-medium text-blue-800 mb-2">계산 결과</h2>
      <p className="text-2xl font-bold text-blue-900">
        총 연차일수: <span className="text-3xl">{formData.result}</span>일
      </p>
    </div>
  );
});

function CalculatorFormContent() {
  const {
    formData,
    setCalculationMethod,
    setHireDate,
    setFiscalYearDate,
    setReferenceDate,
    calculateVacation,
  } = useCalculator();

  return (
    // ✅ h-full 추가: 부모 높이를 모두 사용
    // ✅ flex flex-col: 세로 방향 레이아웃
    <div
      className={`${styles.card} rounded-2xl p-6 shadow-md w-full max-w-lg mx-auto h-full flex flex-col`}
    >
      {/* 헤더 영역 - 고정 크기 */}
      <div className="text-center mb-6 flex-shrink-0">
        <h1 className="text-5xl font-semibold mb-5">연차 계산기</h1>
        <p className="text-xl mb-2">
          당신의 진짜 연차 일수는 얼마일까요?
          <br />
          특이사항까지 고려한 정확한 계산 결과를 지금 바로 확인하세요!
        </p>

        <p className="text-xs text-gray-500 mb-8">
          *연차유급휴가는 상시근로자수가 5인 이상인 경우에만 발생합니다.
        </p>
      </div>

      {/* ✅ 메인 폼 영역 - 남은 공간을 모두 사용하고 스크롤 */}
      {/* flex-1: 남은 공간 모두 차지 */}
      {/* min-h-0: flex 아이템이 축소될 수 있도록 허용 */}
      <div className="bg-white rounded-xl p-5 flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth">
        {/* 내부 콘텐츠를 감싸는 컨테이너 - 좌우 여백 일관성 유지 */}
        <div className="mx-auto w-[95%]">
          {/* 산정 방식 선택 컴포넌트 */}
          <CalculationType
            method={formData.calculationMethod}
            onMethodChange={setCalculationMethod}
            hireDate={formData.hireDate}
            onHireDateChange={setHireDate}
            fiscalYearDate={formData.fiscalYearDate}
            onFiscalYearDateChange={setFiscalYearDate}
            referenceDate={formData.referenceDate}
            onReferenceDateChange={setReferenceDate}
          />

          {/* 구분선 */}
          <hr className="my-5 border-gray-200" />

          {/* 특이사항 섹션 - Suspense로 감싸서 지연 로딩 */}
          <Suspense fallback={<div className="py-4 text-center text-gray-500">로딩 중...</div>}>
            <SpecialPeriodSection />
          </Suspense>

          {/* 휴일 섹션 - Suspense로 감싸서 지연 로딩 */}
          <Suspense fallback={<div className="py-4 text-center text-gray-500">로딩 중...</div>}>
            <HolidaySection />
          </Suspense>

          {/* 계산 결과 표시 */}
          <CalculationResult />

          {/* ✅ 버튼을 하단에 고정하려면 별도 영역으로 분리 */}
        </div>
      </div>

      {/* ✅ 버튼 영역 - 하단 고정 */}
      <div className="flex-shrink-0 bg-white px-5 pb-5 pt-3 rounded-b-xl">
        <div className="mx-auto w-[95%]">
          <button
            type="button"
            onClick={calculateVacation}
            className={`${styles.button} w-full py-2 px-4 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-98`}
          >
            계산하기
          </button>
        </div>
      </div>
    </div>
  );
}

// 메인 컴포넌트 - 불필요한 리렌더링 방지
const CalculatorForm = React.memo(() => {
  return (
    <CalculatorProvider>
      <CalculatorFormContent />
    </CalculatorProvider>
  );
});

CalculatorForm.displayName = 'CalculatorForm';

export default CalculatorForm;
