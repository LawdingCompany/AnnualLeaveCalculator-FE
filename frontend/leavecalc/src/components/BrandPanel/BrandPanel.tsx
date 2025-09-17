export default function BrandPanel() {
  return (
    <aside className="relative rounded-xl bg-[var(--first)] text-white">
      <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">LAWDING</h1>
        <p className="text-xl font-semibold opacity-90">연차계산기</p>

        {/* 소개 문구 */}
        <p className="opacity-90 mt-1 max-w-[260px] text-sm leading-5 text-blue-50/90">
          근로기준법 및 행정해석 등을 반영한 <br />
          정확한 연차계산결과를 확인해보세요
        </p>
      </div>

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-sm opacity-70">
        All rights reserved
      </p>
    </aside>
  );
}
