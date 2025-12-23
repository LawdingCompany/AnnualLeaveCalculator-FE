import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, Loader2, X, Sparkles, Star } from 'lucide-react';
import { FeedbackTypeUI, FeedbackTypeMap } from './types';

export interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  /** 백엔드가 내려주는 현재 계산 요청의 식별자 (UUID 등) */
  calculationId?: string;
}

const FIELD_CLS =
  'w-full rounded-lg border px-3 py-2.5 text-sm outline-none ' +
  'border-neutral-200 focus:border-blue-600 ' +
  'focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12)] bg-white';

const API_BASE = import.meta.env.VITE_API_BASE;

async function postFeedback(payload: {
  type: string; // ✅ API에 보내는 건 Enum 문자열
  content: string;
  calculationId?: string;
  email?: string;
  rating?: number; // 1~5
}) {
  const url = `${API_BASE}/v1/feedback`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Platform': 'web' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to send feedback');
  return res.json();
}

/** ───────────────────────────────────────────────────────────
 *  세그먼트 버튼 (유형)
 *  ─────────────────────────────────────────────────────────── */
function Segmented({
  value,
  onChange,
  disabled,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  options: { value: FeedbackTypeUI; label: string }[];
}) {
  return (
    <div
      role="tablist"
      aria-label="문의 유형"
      className="inline-flex rounded-lg border border-neutral-200 bg-neutral-50 p-1"
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(opt.value)}
            className={[
              'px-3 py-1.5 text-sm rounded-md transition',
              active
                ? 'bg-white text-blue-700 shadow-sm border border-blue-100'
                : 'text-neutral-600 hover:bg-white/80',
              disabled ? 'opacity-60 cursor-not-allowed' : '',
            ].join(' ')}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** ───────────────────────────────────────────────────────────
 *  만족도 바(5단계)
 *  ─────────────────────────────────────────────────────────── */
function RatingBar({
  value,
  onChange,
  disabled,
}: {
  value: number; // 0~5
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const steps = [1, 2, 3, 4, 5];

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      onChange(Math.max(0, (value || 0) - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      onChange(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onChange(5);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div
        role="radiogroup"
        aria-label="만족도 평가"
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded-md"
      >
        {steps.map((n) => {
          const active = value >= n;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n}점`}
              disabled={disabled}
              onClick={() => !disabled && onChange(n)}
              className={[
                'p-0.5 transition-colors',
                disabled ? 'opacity-50 cursor-not-allowed' : '',
              ].join(' ')}
            >
              <Star
                className={`h-6 w-6 ${
                  active
                    ? 'fill-amber-500 stroke-amber-500'
                    : 'stroke-neutral-300 hover:stroke-amber-400'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** ───────────────────────────────────────────────────────────
 *  본문 길이 프로그레스바
 *  ─────────────────────────────────────────────────────────── */
function LengthGauge({ length, max = 1000 }: { length: number; max?: number }) {
  const ratio = Math.min(1, length / max);
  return (
    <div className="mt-1.5 flex items-center justify-between">
      <div className="h-1.5 w-full rounded-full bg-neutral-100">
        <div
          className="h-1.5 rounded-full bg-blue-500 transition-[width]"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
      <span className="ml-2 shrink-0 text-[11px] text-neutral-500 tabular-nums">
        {length}/{max}
      </span>
    </div>
  );
}

export default function FeedbackModal({
  open,
  onClose,
  onSubmitted,
  calculationId,
}: FeedbackModalProps) {
  if (!open) return null;

  // ✅ 훅은 컴포넌트 안에서 선언
  const [type, setType] = useState<FeedbackTypeUI>('오류제보');
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeReqId, setIncludeReqId] = useState<boolean>(!!calculationId);

  const invalidEmail = useMemo(() => {
    if (!email.trim()) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !re.test(email.trim());
  }, [email]);

  const canSubmit = useMemo(
    () =>
      !pending &&
      type.trim().length > 0 && // ✅ 유형 선택됨
      rating > 0 && // ✅ 만족도 선택됨
      content.trim().length >= 5 && // ✅ 내용 5자 이상
      !invalidEmail,
    [pending, type, rating, content, invalidEmail],
  );
  const firstFocusRef = useRef<HTMLButtonElement | null>(null);

  // 모달 초기화
  useEffect(() => {
    setPending(false);
    setDone(false);
    setError(null);
    setIncludeReqId(!!calculationId);
    setRating(0);
    setType('오류제보');
    const t = setTimeout(() => firstFocusRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [calculationId]);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!canSubmit) return;
    setPending(true);
    setError(null);
    try {
      await postFeedback({
        type: FeedbackTypeMap[type], // ✅ 매핑된 Enum 전송
        content: content.trim(),
        calculationId: includeReqId && calculationId ? calculationId : undefined,
        email: email.trim() ? email.trim() : undefined,
        rating: rating > 0 ? rating : undefined,
      });
      setDone(true);
      onSubmitted?.();
    } catch {
      setError('전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        className="absolute left-1/2 top-1/2 w-[600px] max-w-[95vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
      >
        <form onSubmit={handleSubmit} className="relative">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Sparkles className="h-4 w-4" aria-hidden />
              </div>
              <h3 id="feedback-title" className="text-[15px] font-semibold text-neutral-900">
                피드백 보내기
              </h3>
            </div>
            <button
              ref={firstFocusRef}
              type="button"
              onClick={onClose}
              aria-label="닫기"
              className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* Body */}
          <div className="max-h-[68vh] overflow-y-auto px-5 py-4">
            {done ? (
              <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                <CheckCircle2 className="mt-[2px] h-5 w-5" />
                <div>
                  <p className="font-medium">감사합니다! 피드백이 제출되었습니다. 🙌</p>
                  <p className="mt-1 text-[13px] text-green-800/90">
                    더 나은 서비스를 위해 소중한 의견을 반영하겠습니다.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* 유형 */}
                <section className="grid gap-2">
                  <label className="text-sm font-medium text-neutral-800">유형</label>
                  <Segmented
                    value={type}
                    onChange={(v) => setType(v as FeedbackTypeUI)}
                    disabled={pending}
                    options={[
                      { value: '오류제보', label: '오류 제보' },
                      { value: '문의', label: '서비스 문의' },
                      { value: '개선요청', label: '개선 요청' },
                      { value: '이용 후기', label: '이용 후기' },
                      { value: '기타', label: '기타' },
                    ]}
                  />
                </section>

                {/* 만족도 */}
                <section className="grid gap-1.5">
                  <label className="text-sm font-medium text-neutral-800">만족도</label>
                  <RatingBar value={rating} onChange={setRating} disabled={pending} />
                </section>

                {/* 내용 */}
                <section className="grid gap-2">
                  <label className="text-sm font-medium text-neutral-800">내용</label>
                  <textarea
                    className={`${FIELD_CLS} min-h-[140px] resize-vertical`}
                    placeholder="여러분들의 소중한 의견을 남겨주세요.🙏 (최소 5자)"
                    maxLength={1000}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={pending}
                  />
                  <LengthGauge length={content.length} max={1000} />
                </section>

                {/* 이메일 */}
                <section className="grid gap-1.5">
                  <label className="text-sm font-medium text-neutral-800">
                    답변 받을 이메일(선택)
                  </label>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className={FIELD_CLS}
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={pending}
                  />
                  {invalidEmail ? (
                    <span className="text-xs text-red-600">
                      올바른 이메일 주소를 입력해 주세요.
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-500">
                      * 비워두면 익명으로 접수돼요. 확인 후 최대한 빠르게 답변드릴게요.
                    </span>
                  )}
                </section>

                {/* 계산 정보 체크 */}
                {calculationId && (
                  <section className="flex items-center gap-2">
                    <input
                      id="include-reqid"
                      type="checkbox"
                      className="h-4 w-4 rounded border-neutral-300"
                      checked={includeReqId}
                      disabled={pending}
                      onChange={(e) => setIncludeReqId(e.target.checked)}
                    />
                    <label htmlFor="include-reqid" className="text-sm text-neutral-800">
                      현재 계산 정보와 함께 문의 보내기
                    </label>
                  </section>
                )}

                {error && <div className="text-sm text-red-600">{error}</div>}
              </div>
            )}
          </div>

          {/* Footer */}
          <footer className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-neutral-200 bg-white/95 px-5 py-4 backdrop-blur">
            {done ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-neutral-300"
                  disabled={!canSubmit}
                >
                  {pending && <Loader2 className="h-4 w-4 animate-spin" />}
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
