// src/components/Calculator/guideBus.ts
export type GuideKey = 'q1' | 'q2';
const EVT = 'lawding-open-guide';

export function openGuide(key: GuideKey) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVT, { detail: { key } }));
}

export function onGuideOpen(handler: (key: GuideKey) => void) {
  if (typeof window === 'undefined') return () => {};
  const listener = (e: Event) => {
    const ce = e as CustomEvent<{ key: GuideKey }>;
    if (ce.detail?.key) handler(ce.detail.key);
  };
  window.addEventListener(EVT, listener);
  return () => window.removeEventListener(EVT, listener);
}
