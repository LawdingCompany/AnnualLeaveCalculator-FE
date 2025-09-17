import React, { useEffect, useMemo, useRef } from 'react';
import { BookOpen, Info, ListChecks, BookText, ShieldAlert, AlertCircle, X } from 'lucide-react';

export default function HelpDrawer({
  open,
  onClose,
  initialSection,
}: {
  open: boolean;
  onClose: () => void;
  initialSection?: 'accuracy' | 'types' | 'glossary' | 'notice' | 'disclaimer';
}) {
  if (!open) return null;

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // 섹션 ref
  const secAccuracyRef = useRef<HTMLElement | null>(null);
  const secTypesRef = useRef<HTMLElement | null>(null);
  const secGlossaryRef = useRef<HTMLElement | null>(null);
  const secNoticeRef = useRef<HTMLElement | null>(null); // ✅ 유의사항
  const secDisclaimerRef = useRef<HTMLElement | null>(null);

  // ✅ ESC 닫기 + 최초 포커스
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [onClose]);

  // ✅ 첫 mount 시 initialSection으로 스크롤
  useEffect(() => {
    const target =
      initialSection === 'types'
        ? secTypesRef
        : initialSection === 'glossary'
          ? secGlossaryRef
          : initialSection === 'notice'
            ? secNoticeRef
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
  }, [initialSection]);

  const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="helpdrawer-title"
        className="absolute right-0 top-0 h-full w-[450px] max-w-[92vw] translate-x-0 rounded-l-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-transform"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-neutral-200 p-5">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <BookOpen className="h-4 w-4" aria-hidden />
            </div>
            <div className="flex items-baseline gap-2">
              <h3 id="helpdrawer-title" className="text-xl font-semibold text-neutral-900">
                서비스 가이드
              </h3>
              <span className="text-sm text-neutral-400">v1.0.0</span>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-neutral-500 hover:bg-neutral-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="relative h-[calc(100%-56px)] overflow-y-auto">
          {/* 목차(Sticky) */}
          <nav className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
            <div className="flex flex-wrap gap-2 px-4 py-3">
              <TocButton
                label="서비스 설명"
                onClick={() => scrollTo(secAccuracyRef)}
                icon={<Info className="h-3.5 w-3.5" aria-hidden />}
              />
              <TocButton
                label="특이사항 유형"
                onClick={() => scrollTo(secTypesRef)}
                icon={<ListChecks className="h-3.5 w-3.5" aria-hidden />}
              />
              <TocButton
                label="용어 설명"
                onClick={() => scrollTo(secGlossaryRef)}
                icon={<BookText className="h-3.5 w-3.5" aria-hidden />}
              />
              {/* ✅ 유의사항 버튼 추가 */}
              <TocButton
                label="유의사항"
                onClick={() => scrollTo(secNoticeRef)}
                icon={<AlertCircle className="h-3.5 w-3.5" aria-hidden />}
              />
              <TocButton
                label="법적 고지"
                onClick={() => scrollTo(secDisclaimerRef)}
                icon={<ShieldAlert className="h-3.5 w-3.5" aria-hidden />}
              />
            </div>
          </nav>

          {/* Content */}
          <div className="space-y-8 p-4">
            {/* 1) 서비스 설명 */}
            <section ref={secAccuracyRef} aria-labelledby="sec-accuracy">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                  <Info className="h-3.5 w-3.5" aria-hidden />
                </div>
                <h4 id="sec-accuracy" className="font-semibold">
                  서비스 설명
                </h4>
              </div>
              <ol className="list-decimal mt-2 pl-5 space-y-2 text-sm leading-6 text-neutral-800">
                <li>
                  <b>법적으로 정확한 연차 계산</b>
                  <ul className="list-disc pl-5 mt-1 text-neutral-800">
                    <li>
                      입사일 기준 / 회계연도 기준을 선택하면,{' '}
                      <b>
                        입사일부터 <br />
                        산정 기준일까지의 기간을 자동 계산
                      </b>
                      합니다.
                    </li>
                    <li>
                      근로기준법 제60조에 따른 산정 방식을 충실히 반영하여,
                      <br />
                      <b> 법적 기준에 맞는 정확한 연차 산정</b>을 도와드립니다.
                    </li>
                  </ul>
                </li>
                <li>
                  <b>소정근로일수 기준의 정밀한 계산</b>
                  <ul className="list-disc pl-5 mt-1 text-neutral-800">
                    <li>
                      연차 계산의 핵심은 단순히 365일이 아니라, <b>소정근로일수</b>입니다.
                    </li>
                    <li>
                      본 계산기는 실제 근무의무가 없는 날(예: 법정공휴일, 토요일, <br />
                      회사 창립기념일, 노동조합 창립기념일 등)을 <b>자동으로 제외</b>합니다.
                    </li>
                    <li>
                      이를 통해 <b>출근율·연차일수 모두 현실과 일치하는 정밀한 결과</b>를 <br />
                      제공합니다.
                    </li>
                  </ul>
                </li>
                <li>
                  <b>최신 법령·행정해석 반영</b>
                  <ul className="list-disc pl-5 mt-1 text-neutral-800">
                    <li>
                      최근 개정된 법령과 <b>고용노동부 행정해석, 법제처 유권해석</b>을
                      <br />
                      반영했습니다.
                    </li>
                    <li>
                      판례와 행정해석이 바뀌어도 업데이트를 통해 즉시 반영하여,
                      <br />
                      <b>최신 기준에 맞는 연차 산정</b>을 보장합니다.
                    </li>
                  </ul>
                </li>
              </ol>

              <Note>
                본 서비스는 법령·행정해석을 기술적으로 구현해{' '}
                <span className="underline">연차휴가를 정확하게 산정합니다</span>.<br /> 다만, 개별
                회사 규정에 따라 <span className="underline">부여되는 연차휴가</span>가 달라질 수
                있으므로 결과 비교 시 기준 차이를 확인하세요
              </Note>
            </section>

            <Divider />

            {/* 2) 특이사항 유형 */}
            <section ref={secTypesRef} aria-labelledby="sec-types" className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                  <ListChecks className="h-3.5 w-3.5" aria-hidden />
                </div>
                <h4 id="sec-types" className="font-semibold">
                  특이사항 유형
                </h4>
              </div>
              <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-800">
                <li>
                  특이기간은 <b>출근처리 / 결근처리 / 소정근로제외</b> 세 범주로 나뉘며, <br />각
                  범주에 따라 출근율/연차 산정에 다르게 반영됩니다.
                </li>
              </ul>
              <LeaveTypeTable />
            </section>

            <Divider />

            {/* 3) 용어 설명 */}
            <section ref={secGlossaryRef} aria-labelledby="sec-glossary" className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                  <BookText className="h-3.5 w-3.5" aria-hidden />
                </div>
                <h4 id="sec-glossary" className="font-semibold">
                  용어 설명
                </h4>
              </div>
              <div className="space-y-3 text-sm leading-6 text-neutral-800">
                <GlossaryItem term="월차">
                  근로기준법 제60조 제1항에 따라 <b>근무기간이 1년 미만</b>이거나 <br />
                  <b>출근율이 80% 미만</b>인 근로자에게 발생하는 연차를 의미합니다.
                </GlossaryItem>

                <GlossaryItem term="연차">
                  근로기준법 제60조 제2항에 따라 <b>근무기간 1년 이상</b>이고 <br />
                  전년도 연차산정기간 동안 <b>출근율 80% 이상</b>인 경우 지급되는 연차를 <br />
                  말합니다.
                </GlossaryItem>

                <GlossaryItem term="비례연차">
                  <b>회계연도 기준</b>으로 연차를 운영하는 회사에서, 입사연도에 대해
                  <br />
                  <b>회계연도 시작일에 입사연도 출근일수(혹은 재직일수)에 비례</b>하여 <br />
                  부여되는 연차입니다.
                </GlossaryItem>

                <GlossaryItem term="소정근로일">
                  <b>근로를 제공하기로 정한 날(근무일)</b>을 의미합니다.
                  <br /> 휴일·휴직기간·휴업기간 등은 소정근로일에서 제외합니다.
                </GlossaryItem>

                <GlossaryItem term="출근율">
                  소정근로일 중 실제로 <b>출근한 비율</b>을 의미합니다. <br />
                  소정근로 제외기간이 있다면 그 기간은 출근율 산정에서 제외됩니다.
                  <div className="mt-2 rounded-md bg-neutral-50 px-3 py-2 text-[12px] text-neutral-600">
                    예) 2025.01.01 ~ 2025.12.31 결근 없이 근무, <br />
                    다만 2025.03.01 ~ 2025.04.30 이 소정근로제외기간이라면 <br />
                    해당 기간을 제외하고 계산하므로 <b>출근율은 100%</b>로 산정됩니다.
                  </div>
                </GlossaryItem>

                <GlossaryItem term="비례율">
                  비례연차를 산정할 때 적용하는 <b>비율</b>을 의미합니다.
                  <br /> 입사연도 동안의 <b>실제 재직일수 ÷ 회계연도 전체 일수</b>로 계산하며,{' '}
                  <br />이 비례율을 곱해 연차일수를 산출합니다.
                  <div className="mt-2 rounded-md bg-neutral-50 px-3 py-2 text-[12px] text-neutral-600">
                    예) 회계연도 365일 중 100일 재직 → 비례율 = 100 ÷ 365 ≈ 0.27 <br />→ 해당
                    비율만큼 연차가 부여됨
                  </div>
                </GlossaryItem>
              </div>
            </section>

            <Divider />

            {/* ✅ 4) 유의사항 (신규, 용어설명과 법적고지 사이) */}
            <section ref={secNoticeRef} aria-labelledby="sec-notice" className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-50 text-amber-700">
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden />
                </div>
                <h4 id="sec-notice" className="font-semibold">
                  유의사항
                </h4>
              </div>

              <div className="space-y-2 text-sm leading-6 text-neutral-800">
                <p className="font-medium">사장님·인사담당자님들을 위한 유의사항</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    소수점 단위 연차유급휴가는 <b>“반올림”</b>하는 경우 <b>법 위반</b>이 될 수{' '}
                    <br />
                    있어요.
                  </li>
                </ul>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-neutral-50 px-2 py-1 text-[12px] text-neutral-700">
                    13.4일 → 13일 <b>(X)</b>
                  </span>
                  <span className="rounded-md bg-green-50 px-2 py-1 text-[12px] text-green-800">
                    13.4일 → 13.5일 <b>or</b> 14일
                  </span>
                </div>

                <p className="text-[13px] text-neutral-700">
                  법 기준 이상으로 주는 건 괜찮지만, 법 기준 이하로 연차를 지급할 경우
                  <br />
                  <b>2년 이하의 징역 또는 2천만원 이하의 벌금</b>(<b>근로기준법 제110조</b>)이
                  부과될 수 <br />
                  있으며 적법한 연차유급휴가 수당 청구를 거부할 경우 <b>
                    임금체불로 형사상 책임
                  </b>을 <br />질 수 있습니다.
                </p>
              </div>
            </section>

            <Divider />

            {/* 5) 법적 고지 (맨 아래) */}
            <section ref={secDisclaimerRef} aria-labelledby="sec-disclaimer" className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-50 text-blue-600">
                  <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
                </div>
                <h4 id="sec-disclaimer" className="font-semibold">
                  법적 고지
                </h4>
              </div>
              <div className="space-y-2 text-[13px] leading-6 text-neutral-700">
                <p>
                  이 웹사이트에서 산출된 내역은 연차유급휴가 산정에 <b>참고 목적으로 제공</b>된{' '}
                  <br />
                  것입니다. 법률적 자문이나 해석을 위한 자료가 아니며, 제작자는 그 결과에 대해{' '}
                  <br />
                  어떠한 책임도 지지 않습니다.
                </p>
                <p>
                  구체적인 사안이나 사건과 관련해서는 본 사이트 내용을 근거로 어떠한 행위(작위 또는
                  부작위)도 하지 마시기 바랍니다. 어떠한 행위라도{' '}
                  <b>
                    본 제작자는 민·형사상 <br /> 책임을 지지 않습니다.
                  </b>
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

function TocButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] font-medium text-blue-700 hover:bg-blue-100 focus-visible:outline focus-visible:outline-blue-500/30"
      aria-label={`${label} 섹션으로 이동`}
    >
      {icon}
      {label}
    </button>
  );
}

function Divider() {
  return <hr className="border-neutral-200" />;
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-md bg-blue-50/60 p-3 text-[12px] font-light leading-5 text-[var(--first)]">
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
          '산재기간',
          '공민권행사일',
          '출산휴가',
          '가족돌봄휴가',
          '부당해고',
          '직장폐쇄(불법)',
        ],
      },
      {
        title: '결근처리',
        tone: 'red' as const,
        items: ['무단결근', '징계 정·휴직 등', '불법쟁의행위'],
      },
      {
        title: '소정근로제외',
        tone: 'yellow' as const,
        items: ['군 휴직', '일반휴직(개인사유)', '개인질병휴직'],
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
