import Logo from '../../../public/LawdingLogo_v2.svg';

export default function BrandPanel() {
  return (
    <aside className="relative rounded-xl border text-[var(--first)] border-neutral-200">
      <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center text-[var(--first)]">
        {/* 로고 */}
        <img src={Logo} alt="Lawding Logo" className="w-[110px] h-auto mb-2" />

        {/* 타이틀 */}
        <h1 className="text-5xl font-extrabold tracking-tight normal-case">LawDing</h1>
        <p className="text-xl font-extrabold opacity-90">연차계산기</p>

        {/* 소개 문구 */}
        <p className="opacity-90 mt-1 max-w-[260px] font-bold text-sm leading-5">
          근로기준법 및 행정해석 등을 반영한 <br />
          정확한 연차계산결과를 확인해보세요
        </p>

        {/* iOS 앱 다운로드 링크 (문구 + 아이콘 10px) */}
        <a
          href="https://apps.apple.com/kr/app/lawding-%EC%97%B0%EC%B0%A8%EA%B3%84%EC%82%B0%EA%B8%B0/id6751892414"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-medium text-[var(--second)] underline underline-offset-2 
                     flex items-center gap-[2px] hover:opacity-80 transition"
        >
          아이폰 앱으로 더 편하게 이용해 보세요!
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[11px] w-[11px]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 5h6m0 0v6m0-6L10 14" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5v14h14" />
          </svg>
        </a>
      </div>

      {/* 하단 표시 */}
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-sm opacity-70">
        All rights reserved
      </p>
    </aside>
  );
}
