import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

type FeedbackType = '개선요청' | '버그제보' | '문의';

const FIELD_CLS =
  'w-full rounded-md border px-3 py-2 text-sm outline-none ' +
  'border-[#e2e8f0] focus:border-blue-600 ' +
  'focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]';

async function postFeedback(payload: { type: FeedbackType; content: string }) {
  // 필요한 파라미터: type(유형), content(내용)
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send feedback');
  return res.json();
}

export default function FeedbackModal({ open, onClose, onSubmitted }: FeedbackModalProps) {
  const [type, setType] = useState<FeedbackType>('개선요청');
  const [content, setContent] = useState('');
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => !pending && content.trim().length >= 5, [pending, content]);
  const firstFieldRef = useRef<HTMLSelectElement | null>(null);

  // 열릴 때 초기화 + 포커스
  useEffect(() => {
    if (open) {
      setPending(false);
      setDone(false);
      setError(null);
      // 첫 필드 포커스
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [open]);

  // ESC로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError(null);
    try {
      await postFeedback({ type, content: content.trim() });
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setPending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Centered Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="absolute left-1/2 top-1/2 w-[560px] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl"
      >
        <form onSubmit={handleSubmit}>
          <header className="flex items-center justify-between border-b border-neutral-200 p-4">
            <h3 id="feedback-title" className="text-base font-semibold">
              피드백 보내기
            </h3>
            <button
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="text-neutral-500 hover:text-neutral-800"
            >
              ✕
            </button>
          </header>

          <div className="p-5 space-y-4">
            {done ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                감사합니다! 피드백이 제출되었습니다. 🙌
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-neutral-700">유형</label>
                  <select
                    ref={firstFieldRef}
                    className={FIELD_CLS}
                    value={type}
                    onChange={(e) => setType(e.target.value as FeedbackType)}
                  >
                    <option>개선요청</option>
                    <option>버그제보</option>
                    <option>문의</option>
                  </select>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-700">내용</label>
                    <span className="text-[11px] text-neutral-500">{content.length}/1000</span>
                  </div>
                  <textarea
                    className={`${FIELD_CLS} min-h-[140px] resize-vertical`}
                    placeholder="무엇이 불편했는지/개선되면 좋을 점을 구체적으로 알려주세요. (최소 5자)"
                    maxLength={1000}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {error && <div className="text-sm text-red-600">{error}</div>}
              </>
            )}
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-neutral-200 p-4">
            {done ? (
              <button
                type="button"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={onClose}
              >
                닫기
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50"
                  onClick={onClose}
                  disabled={pending}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-neutral-300"
                  disabled={!canSubmit}
                >
                  {pending ? '제출 중…' : '제출'}
                </button>
              </>
            )}
          </footer>
        </form>
      </div>
    </div>
  );
}
