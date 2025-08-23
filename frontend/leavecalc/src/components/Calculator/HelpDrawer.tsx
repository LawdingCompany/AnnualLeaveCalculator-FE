// src/components/Calculator/HelpDrawer.tsx
export default function HelpDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div className={`fixed inset-0 z-30 ${open ? '' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-[420px] max-w-[90vw] bg-white shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="font-semibold">연차 산정 가이드 (요약)</h3>
          <button onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </div>
        <div className="h-[calc(100%-56px)] overflow-y-auto p-4 text-sm text-neutral-700 space-y-3">
          <p className="text-xs text-neutral-500">Last updated: 2025-07-15</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <b>적용 범위</b>: 근로기준법/회사 규정 우선순위
            </li>
            <li>
              <b>산정 단위</b>: 입사일 기준 / 회계연도 기준
            </li>
            <li>
              <b>제외 기간</b>: 육아휴직/산전·산후휴가 전부 제외, 병가·경조는 내규
            </li>
            <li>
              <b>소정근로일</b>: 주말/공휴일 반영, 법정공휴일 DB 기준
            </li>
          </ol>
          <a className="inline-flex items-center gap-1 text-blue-600 underline" href="/guidelines">
            전체 가이드 보기 →
          </a>
        </div>
      </aside>
    </div>
  );
}
