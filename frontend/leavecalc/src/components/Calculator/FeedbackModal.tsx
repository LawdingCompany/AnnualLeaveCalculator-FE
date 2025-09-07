// FeedbackModal.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  /** 백엔드가 내려주는 현재 계산 요청의 식별자 (UUID 등) */
  requestId?: string;
}

type FeedbackType = '개선요청' | '버그제보' | '문의';

const FIELD_CLS =
  'w-full rounded-md border px-3 py-2 text-sm outline-none ' +
  'border-[#e2e8f0] focus:border-blue-600 ' +
  'focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]';

// ⬇️ email 포함하도록 페이로드 확장
async function postFeedback(payload: {
  type: FeedbackType;
  content: string;
  requestId?: string;
  email?: string;
}) {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send feedback');
  return res.json();
}

export default function FeedbackModal({
  open,
  onClose,
  onSubmitted,
  requestId,
}: FeedbackModalProps) {
  const [type, setType] = useState<FeedbackType>('개선요청');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState(''); // ⬅️ 추가
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 요청 ID 포함 여부
  const [includeReqId, setIncludeReqId] = useState<boolean>(!!requestId);

  // 이메일 형식 검증(입력 시에만 검사)
  const invalidEmail = useMemo(() => {
    if (!email.trim()) return false; // 비어있으면 OK(선택)
    // 간단 검증 (HTML5 email과 유사한 수준)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !re.test(email.trim());
  }, [email]);

  const canSubmit = useMemo(
    () => !pending && content.trim().length >= 5 && !invalidEmail,
    [pending, content, invalidEmail],
  );

  const firstFieldRef = useRef<HTMLSelectElement | null>(null);

  // 열릴 때 초기화 + 포커스
  useEffect(() => {
    if (open) {
      setPending(false);
      setDone(false);
      setError(null);
      setIncludeReqId(!!requestId);
      // 이메일은 직전 값 유지해도 되고(반복 문의 편의), 항상 초기화하고 싶으면 아래 라인 주석 해제
      // setEmail('');
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [open, requestId]);

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
      await postFeedback({
        type,
        content: content.trim(),
        requestId: includeReqId && requestId ? requestId : undefined,
        email: email.trim() ? email.trim() : undefined, // ⬅️ 입력 시에만 포함
      });
      setDone(true);
      onSubmitted?.();
    } catch (err) {
      setError('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setPending(false);
    }
  };

  const shortId =
    requestId && requestId.length > 12
      ? `${requestId.slice(0, 8)}…${requestId.slice(-4)}`
      : (requestId ?? '');

  const copyId = async () => {
    if (!requestId) return;
    try {
      await navigator.clipboard.writeText(requestId);
    } catch {
      // ignore
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
                {/* 유형 */}
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

                {/* 내용 */}
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

                {/* 이메일 (선택) */}
                <div className="grid gap-1">
                  <label className="text-sm font-medium text-neutral-700">
                    답변 받을 이메일 (선택)
                  </label>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className={FIELD_CLS}
                    placeholder="example@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    {invalidEmail ? (
                      <span className="text-xs text-red-600">
                        올바른 이메일 주소를 입력해 주세요.
                      </span>
                    ) : (
                      <span className="text-xs text-neutral-500">
                        * 입력 시 이 주소로 답변 드립니다. 비워두면 익명으로 접수돼요.
                      </span>
                    )}
                  </div>
                </div>

                {/* 현재 계산 정보(요청 ID) 함께 보내기 */}
                <div className="flex items-center gap-2">
                  <input
                    id="include-reqid"
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300"
                    checked={!!requestId && includeReqId}
                    disabled={!requestId}
                    onChange={(e) => setIncludeReqId(e.target.checked)}
                  />
                  <label htmlFor="include-reqid" className="text-sm text-neutral-700">
                    현재 계산 정보와 함께 문의 보내기
                  </label>

                  {/* 요청 ID 표시 & 복사 */}
                  <div className="ml-auto flex items-center gap-2">
                    {requestId ? (
                      <>
                        <code className="rounded bg-neutral-50 px-2 py-[3px] text-xs text-neutral-700 border border-neutral-200">
                          {shortId}
                        </code>
                        <button
                          type="button"
                          onClick={copyId}
                          className="rounded-md border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-50"
                          title="요청 ID 복사"
                        >
                          복사
                        </button>
                      </>
                    ) : (
                      <small className="text-xs text-neutral-500">
                        요청 ID가 없어 포함할 수 없습니다
                      </small>
                    )}
                  </div>
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
