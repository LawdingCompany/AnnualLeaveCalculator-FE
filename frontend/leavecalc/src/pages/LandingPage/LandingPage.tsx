import { useLayoutEffect, useRef } from 'react';
import BrandPanel from '@components/BrandPanel/BrandPanel';
import { CalculatorCard } from '@components/Calculator';
import { CalculatorProvider } from '@components/Calculator/context';

export default function LandingPage() {
  // 가로 스크롤 담당 컨테이너
  const containerRef = useRef<HTMLDivElement>(null);
  // CalculatorCard 래퍼
  const calcRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    const target = calcRef.current;
    if (!el || !target) return;

    // 모바일(예: < 1024px)에서만 오른쪽 칼럼부터 보이기
    const isMobile = window.innerWidth < 1024;
    if (isMobile) {
      // 카드의 왼쪽 위치만큼 가로 스크롤 이동
      el.scrollLeft = target.offsetLeft;
    }
  }, []);

  return (
    // ⚠️ 가로 스크롤 컨테이너에는 가로 padding 넣지 말기!
    <div
      ref={containerRef}
      className="min-h-dvh bg-neutral-100 flex lg:items-center justify-start lg:justify-center overflow-x-auto overflow-y-hidden"
    >
      {/* 고정 1300x800 캔버스 (모바일: 왼쪽 정렬, 데스크탑: 중앙 정렬) */}
      <div className="w-[1300px] h-[800px] mx-0 lg:mx-auto shrink-0 rounded-2xl bg-white shadow-sm">
        {/* 내부 여백은 여기서 */}
        <div className="p-6 h-full">
          {/* 300px + gap만큼 오른쪽에 있는 칼럼을 가리킴 */}
          <div className="grid gap-6 grid-cols-[300px_1fr] h-full">
            {/* LEFT */}
            <BrandPanel />
            {/* RIGHT: 여기를 초기 뷰로 보이게 */}
            <div ref={calcRef}>
              <CalculatorProvider>
                <CalculatorCard />
              </CalculatorProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
