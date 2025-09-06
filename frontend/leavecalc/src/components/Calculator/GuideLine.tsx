// src/components/Calculator/FAQ.tsx
import React, { useState } from 'react';
import HelpDrawer from './HelpDrawer';
import { Info } from 'lucide-react';

type FAQItem = { q: React.ReactNode; a: React.ReactNode };

function TypeChip({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-blue-700
                 hover:bg-blue-100 focus-visible:outline focus-visible:outline-blue-500/30 align-baseline"
      title="유형 안내 열기"
    >
      <Info className="h-3.5 w-3.5" aria-hidden="true" />
      유형
    </button>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-sm bg-yellow-200 px-1 font-semibold text-neutral-900">{children}</span>
  );
}

export default function GuideLine() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [initialSection, setInitialSection] = useState<
    'accuracy' | 'types' | 'disclaimer' | undefined
  >(undefined);

  const openDrawerToTypes = () => {
    setInitialSection('types');
    setDrawerOpen(true);
  };

  const onCloseDrawer = () => {
    setDrawerOpen(false);
    // 필요 시 다음 열림에서 기본 섹션으로 돌아가게 초기화
    // setInitialSection(undefined);
  };

  const items: FAQItem[] = [
    {
      q: (
        <span>
          <span className="font-semibold">Q1.</span> 특이사항이 있는 기간은 무엇인가요?
        </span>
      ),
      a: (
        <div className="space-y-2 text-md text-neutral-600">
          <p className="mt-2">
            해당 기간은{' '}
            <Highlight>
              재직 중 일시적으로 근로 제공이 중단된 기간(예: 각종 휴직·징계·쟁의 등)
            </Highlight>
            을 의미합니다.
            <br /> <TypeChip onClick={openDrawerToTypes} />에 따라
            <b className="text-neutral-900"> 출근처리 / 결근처리 / 소정근로제외</b>로 반영되며, 이에
            따라 연차 발생·차감 계산이 달라집니다.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-800">
            <li>입력 범위 : 입사일 ~ 기준일 사이</li>
            <li>서로 기간이 겹치지 않게 등록 (최대 3개)</li>
            <li>
              <span className="underline">주말/공휴일은 자동 반영</span>됩니다.
            </li>
          </ul>
        </div>
      ),
    },
    {
      q: (
        <span>
          <span className="font-semibold">Q2.</span> 회사 지정 휴일은 무엇인가요?
        </span>
      ),
      a: (
        <div className="space-y-2">
          <p className="mt-2">
            회사 휴일은 <Highlight>회사가 별도로 지정·공지한 쉬는 날(예: 창립기념일)</Highlight>을
            의미합니다.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-800">
            <li>입력 방식 : 날짜 한 건씩 등록 (최대 3일)</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <section>
      <h3 className="mb-3 font-medium text-neutral-800">이용 가이드</h3>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx}>
            <details className="group mb-2 rounded-lg border border-neutral-200">
              <summary className="flex cursor-pointer select-none items-center justify-between gap-3 rounded-lg px-3 py-2  text-neutral-800 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-blue-500/30">
                <span className="font-medium">{item.q}</span>
                <svg
                  className="h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <div className="px-3 pb-3 text-sm">{item.a}</div>
            </details>
          </li>
        ))}
      </ul>

      <HelpDrawer open={drawerOpen} onClose={onCloseDrawer} initialSection={initialSection} />
    </section>
  );
}
