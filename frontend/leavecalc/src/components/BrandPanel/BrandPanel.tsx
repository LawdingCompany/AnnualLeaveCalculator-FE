export default function BrandPanel() {
  return (
    <aside className="relative rounded-xl bg-blue-600 text-white">
      <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">LAWDING</h1>
        <p className="text-xl font-semibold opacity-90">연차휴가계산기</p>
      </div>
      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] opacity-70">
        All rights reserved
      </p>
    </aside>
  );
}
