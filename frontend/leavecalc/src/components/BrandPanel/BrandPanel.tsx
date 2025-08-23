export default function BrandPanel() {
  return (
    <aside className="relative rounded-xl bg-blue-600 text-white">
      <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">LAWDING</h1>
        <p className="text-xl font-semibold opacity-90">연차계산기</p>

        {/* 소개 문구 */}
        <p className="mt-1 max-w-[260px] text-xs leading-5 text-blue-50/90">
          근로기준법에 의거해 여러 특이사항을 고려한 법적 최소 연차를 계산해 본인의 연차 개수를
          확인해 보세요.
          <span className="block opacity-90">(2017년 5월 30일 이후 입사자 기준)</span>
        </p>
      </div>

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] opacity-70">
        All rights reserved
      </p>
    </aside>
  );
}
