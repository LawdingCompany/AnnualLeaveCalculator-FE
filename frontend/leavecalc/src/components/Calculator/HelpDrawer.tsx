import React, { useEffect, useMemo, useRef } from 'react';

export default function HelpDrawer({
  open,
  onClose,
  initialSection,
}: {
  open: boolean;
  onClose: () => void;
  initialSection?: 'accuracy' | 'types' | 'glossary' | 'disclaimer';
}) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // 섹션 ref
  const secAccuracyRef = useRef<HTMLElement | null>(null);
  const secTypesRef = useRef<HTMLElement | null>(null);
  const secGlossaryRef = useRef<HTMLElement | null>(null);
  const secDisclaimerRef = useRef<HTMLElement | null>(null);

  // ESC 닫기 + 최초 포커스
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  // 열릴 때 원하는 섹션으로 스크롤
  useEffect(() => {
    if (!open) return;
    const target =
      initialSection === 'types'
        ? secTypesRef
        : initialSection === 'glossary'
          ? secGlossaryRef
          : initialSection === 'disclaimer'
            ? secDisclaimerRef
            : initialSection === 'accuracy'
              ? secAccuracyRef
              : null;
    if (!target) return;
    const t = setTimeout(() => {
      target.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(t);
  }, [open, initialSection]);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="helpdrawer-title"
        className="absolute right-0 top-0 h-full w-[460px] max-w-[92vw] translate-x-0 rounded-l-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-transform"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 p-5">
          <h3 id="helpdrawer-title" className="text-xl font-semibold text-neutral-900">
            참고 가이드
          </h3>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100"
          >
            ✕
          </button>
        </header>

        {/* Body */}
        <div className="relative h-[calc(100%-56px)] overflow-y-auto">
          {/* 목차(Sticky, 불투명) */}
          <nav className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
            <div className="flex flex-wrap gap-2 px-4 py-3">
              <TocButton label="서비스 설명" onClick={() => scrollTo(secAccuracyRef)} />
              <TocButton label="특이사항 유형" onClick={() => scrollTo(secTypesRef)} />
              <TocButton label="용어 설명" onClick={() => scrollTo(secGlossaryRef)} />
              <TocButton label="법적 고지" onClick={() => scrollTo(secDisclaimerRef)} />
            </div>
          </nav>

          {/* Content */}
          <div className="space-y-8 p-4">
            {/* 1) 서비스 설명 */}
            <section ref={secAccuracyRef} aria-labelledby="sec-accuracy">
              <h4 id="sec-accuracy" className="font-semibold">
                서비스 설명
              </h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-neutral-700">
                <li>
                  <b>근로기준법 제60조 준수 : </b>입사일/회계연도 기준 선택 시{' '}
                  <b>입사일부터 기준일까지</b> 자동 계산.
                </li>
                <li>
                  <b>소정근로일·출근율 반영 : </b>주말/법정공휴일/회사휴일 등{' '}
                  <b>근무의무 없는 날을 자동 제외</b>하여 현실과 일치.
                </li>
                <li>
                  <b>최신 행정해석·판례/유권해석 추적 : </b>고용노동부 및 법제처 해석 변경 시
                  업데이트 반영.
                </li>
              </ul>
              <Note>
                본 서비스는 법령·행정해석을 기술적으로 구현해 산정의 일관성을 지향합니다. 개별 회사
                규정에 따라 결과가 달라질 수 있으므로 결과 비교 시 기준 차이를 확인하세요.
              </Note>
            </section>

            <Divider />

            {/* 2) 특이사항 유형 */}
            <section ref={secTypesRef} aria-labelledby="sec-types" className="space-y-3">
              <h4 id="sec-types" className="font-semibold">
                특이사항 유형
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-500">
                <li>
                  특이기간은 <b>출근처리 / 결근처리 / 소정근로제외</b> 세 범주로 나뉘며, 각 범주에
                  따라 출근율/연차 산정에 다르게 반영됩니다.
                </li>
              </ul>
              <LeaveTypeTable />
            </section>

            <Divider />

            {/* 3) 용어 설명 */}
            <section ref={secGlossaryRef} aria-labelledby="sec-glossary" className="space-y-3">
              <h4 id="sec-glossary" className="font-semibold">
                용어 설명
              </h4>

              <div className="space-y-3 text-sm leading-6 text-neutral-800">
                <GlossaryItem term="월차">
                  근로기준법 제60조 제1항에 따라 <b>근무기간이 1년 미만</b>이거나{' '}
                  <b>출근율이 80% 미만</b>인 근로자에게 발생하는 연차를 의미합니다.
                </GlossaryItem>

                <GlossaryItem term="연차">
                  근로기준법 제60조 제2항에 따라 <b>근무기간 1년 이상</b>이고 전년도 연차산정기간
                  동안 <b>출근율 80% 이상</b>인 경우 지급되는 연차를 말합니다.
                </GlossaryItem>

                <GlossaryItem term="비례연차">
                  <b>회계연도 기준</b>으로 연차를 운영하는 회사에서, 입사연도에 대해{' '}
                  <b>회계연도 시작일에 입사연도 출근일수(혹은 재직일수)에 비례</b>하여 부여되는
                  연차입니다.
                </GlossaryItem>

                <GlossaryItem term="소정근로일">
                  <b>근로를 제공하기로 정한 날(근무일)</b>을 의미합니다. 휴일·휴직기간·휴업기간 등은
                  소정근로일에서 제외합니다.
                </GlossaryItem>

                <GlossaryItem term="출근율">
                  소정근로일 중 실제로 <b>출근한 비율</b>을 의미합니다. 소정근로 제외기간이 있다면
                  그 기간은 출근율 산정에서 제외됩니다.
                  <div className="mt-2 rounded-md bg-neutral-50 px-3 py-2 text-[12px] text-neutral-600">
                    예) 2025.01.01 ~ 2025.12.31 결근 없이 근무, <br />
                    다만 2025.03.01 ~ 2025.04.30 이 소정근로제외기간이라면 해당 기간을 제외하고
                    계산하므로 <b>출근율은 100%</b>로 산정됩니다.
                  </div>
                </GlossaryItem>
              </div>
            </section>

            <Divider />

            {/* 4) 법적 고지 (맨 아래) */}
            <section ref={secDisclaimerRef} aria-labelledby="sec-disclaimer" className="space-y-2">
              <h4 id="sec-disclaimer" className="font-semibold">
                법적 고지
              </h4>
              <div className="space-y-2 text-[13px] leading-6 text-neutral-700">
                <p>
                  이 웹사이트에서 산출된 내역은 연차유급휴가 산정에 <b>참고 목적으로 제공</b>된
                  것입니다. 법률적 자문이나 해석을 위한 자료가 아니며, 제작자는 그 결과에 대해
                  어떠한 책임도 지지 않습니다.
                </p>
                <p>
                  구체적인 사안이나 사건과 관련해서는 본 사이트 내용을 근거로 어떠한 행위(작위 또는
                  부작위)도 하지 마시기 바랍니다. 어떠한 행위라도{' '}
                  <b>본 제작자는 민·형사상 책임을 지지 않습니다.</b>
                </p>
                <div className="rounded-md bg-neutral-50 p-3 text-[12px] text-neutral-600">
                  * 최종 해석 및 적용은 회사 규정과 관계 법령에 따릅니다.
                </div>
              </div>
            </section>
          </div>
        </div>
      </aside>
    </div>
  );
}

function TocButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] font-medium text-blue-700 hover:bg-blue-100"
    >
      {label}
    </button>
  );
}

function Divider() {
  return <hr className="border-neutral-200" />;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-md bg-blue-50/60 p-3 text-[12px] font-light leading-5 text-blue-700">
      {children}
    </div>
  );
}

function GlossaryItem({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-3">
      <div className="mb-1 font-semibold text-neutral-900">{term}</div>
      <div className="text-[13px] text-neutral-800">{children}</div>
    </div>
  );
}

function LeaveTypeTable() {
  const groups = useMemo(
    () => [
      {
        title: '출근처리',
        tone: 'green' as const,
        items: [
          '육아휴직',
          '출산전후휴가',
          '유사산휴가',
          '예비군훈련',
          '업무상 부상 또는 질병(산재인정)',
          '공민권 행사를 위한 휴무일',
          '배우자 출산휴가',
          '가족돌봄휴가',
          '부당해고',
          '불법직장폐쇄',
        ],
      },
      {
        title: '결근처리',
        tone: 'red' as const,
        items: ['무단결근', '징계로 인한 정직·강제휴직·직위해제', '불법쟁의행위'],
      },
      {
        title: '소정근로제외',
        tone: 'yellow' as const, // 노란색
        items: ['병역의무 이행 휴직', '개인사유 휴직', '개인질병(업무상 질병 X) 휴직'],
      },
    ],
    [],
  );

  return (
    <section className="grid gap-4">
      {groups.map((g) => (
        <Group key={g.title} title={g.title} items={g.items} tone={g.tone} />
      ))}
    </section>
  );
}

function Group({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'green' | 'red' | 'yellow';
}) {
  const toneBtn =
    tone === 'green'
      ? 'border-green-200 bg-green-50 text-green-800 hover:bg-green-100'
      : tone === 'red'
        ? 'border-red-200 bg-red-50 text-red-800 hover:bg-red-100'
        : 'border-yellow-200 bg-yellow-50 text-yellow-800 hover:bg-yellow-100';

  return (
    <div className="space-y-2">
      {/* 버튼 스타일 헤더 */}
      <button
        type="button"
        disabled
        className={`w-full cursor-default rounded-md border px-3 py-1.5 text-left text-sm font-semibold ${toneBtn}`}
      >
        {title}
      </button>

      {/* 항목 리스트: 행으로 */}
      <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
