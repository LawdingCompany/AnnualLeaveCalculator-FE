// src/components/Calculator/GuidelineHint.tsx
import { useState } from 'react';
import HelpDrawer from './HelpDrawer';

export default function GuidelineHint() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-[12px] text-neutral-600">
        • 본 계산기는 참고용이며 실제 적용은 회사 규정 및 관계 법령에 따릅니다.{' '}
        <button className="underline" onClick={() => setOpen(true)}>
          자세히 보기
        </button>
      </div>
      <HelpDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
