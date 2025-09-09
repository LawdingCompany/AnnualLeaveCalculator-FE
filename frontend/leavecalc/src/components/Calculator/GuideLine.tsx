// src/components/Calculator/FAQ.tsx
import React, { useState } from 'react';
import HelpDrawer from './HelpDrawer';
import { Info, HelpCircle, ChevronDown, BookOpen } from 'lucide-react';

type FAQItem = { title: string; body: React.ReactNode };

function TypeChip({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700
                 hover:bg-blue-100 focus-visible:outline focus-visible:outline-blue-500/30 align-baseline"
      title="유형 안내 열기"
      aria-label="유형 안내 열기"
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
    setInitialSection(undefined); // 다음 열림 시 기본 섹션으로
  };

  // ✅ 질문/답변 데이터 (번호는 자동으로 붙일 거라 title에 Qn.은 넣지 않음)
  const items: FAQItem[] = [
    {
      title: '특이사항이 있는 기간은 무엇인가요?',
      body: (
        <div className="space-y-2 text-neutral-700">
          <p className="mt-1">
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
      title: '회사 지정 휴일은 무엇인가요?',
      body: (
        <div className="space-y-2 text-neutral-700">
          <p className="mt-1">
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
      {/* 헤더: 이용 가이드 + 아이콘 배지 */}
      <div className="mb-3 flex items-center gap-2">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
          <BookOpen className="h-4 w-4" aria-hidden />
        </div>
        <h3 className="font-medium text-neutral-900">이용 가이드</h3>
      </div>

      {/* 아코디언 리스트: Q 배지 + Chevron 아이콘 회전 */}
      <ul className="space-y-2">
        {items.map((item, idx) => {
          const qLabel = `Q${idx + 1}.`;
          return (
            <li key={item.title} className="rounded-lg border border-neutral-200">
              <details className="group rounded-lg">
                <summary className="flex cursor-pointer select-none items-center gap-3 rounded-lg px-3 py-2 text-neutral-900 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-blue-500/30">
                  {/* Q 배지 */}
                  <span className="inline-flex shrink-0 items-center justify-center rounded-md bg-blue-50 px-2 py-[2px] text-[11px] font-semibold text-blue-700">
                    {qLabel}
                  </span>
                  <span className="font-medium">{item.title}</span>
                  <ChevronDown
                    className="ml-auto h-4 w-4 shrink-0 text-neutral-400 transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <div className="border-t border-neutral-200 px-3 pb-3 pt-2 text-sm">
                  {item.body}
                </div>
              </details>
            </li>
          );
        })}
      </ul>

      {/* HelpDrawer: 섹션 리셋 보장 위해 key 부여 */}
      <HelpDrawer
        key={initialSection ?? 'none'}
        open={drawerOpen}
        onClose={onCloseDrawer}
        initialSection={initialSection}
      />
    </section>
  );
}
