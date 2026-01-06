type Props = {
  open: boolean;
  mode: 'create' | 'edit';
  categories: { id: number; name: string }[];
  categoryId: number | '';
  question: string;
  content: string;
  onChangeCategory: (v: number | '') => void;
  onChangeQuestion: (v: string) => void;
  onChangeContent: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const QUESTION_MAX = 200;
const CONTENT_MAX = 500;

export default function DictionaryFormModal({
  open,
  mode,
  categories,
  categoryId,
  question,
  content,
  onChangeCategory,
  onChangeQuestion,
  onChangeContent,
  onSubmit,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="w-full max-w-lg rounded-xl bg-neutral-50 p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-sm font-semibold text-neutral-800">
          {mode === 'create' ? '사전 항목 등록' : '사전 항목 수정'}
        </h3>

        {/* ---------- Category ---------- */}
        <div className="mb-3">
          <label className="mb-1 block text-xs text-neutral-500">카테고리</label>
          <select
            value={categoryId}
            onChange={(e) => onChangeCategory(Number(e.target.value))}
            className="w-full rounded-md border border-neutral-200 bg-white px-2 py-2 text-xs focus:border-blue-400 focus:outline-none"
          >
            <option value="">선택하세요</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* ---------- Question ---------- */}
        <div className="mb-3">
          <label className="mb-1 block text-xs text-neutral-500">
            질문 (최대 {QUESTION_MAX}자)
          </label>
          <textarea
            value={question}
            onChange={(e) => onChangeQuestion(e.target.value)}
            maxLength={QUESTION_MAX}
            rows={3}
            className="w-full resize-none rounded-md border border-neutral-200 bg-white px-2 py-2 text-xs focus:border-blue-400 focus:outline-none"
          />
          <div className="mt-1 text-right text-[10px] text-neutral-400">
            {question.length} / {QUESTION_MAX}
          </div>
        </div>

        {/* ---------- Content ---------- */}
        <div className="mb-4">
          <label className="mb-1 block text-xs text-neutral-500">답변 (최대 {CONTENT_MAX}자)</label>
          <textarea
            value={content}
            onChange={(e) => onChangeContent(e.target.value)}
            maxLength={CONTENT_MAX}
            rows={5}
            className="w-full resize-none rounded-md border border-neutral-200 bg-white px-2 py-2 text-xs focus:border-blue-400 focus:outline-none"
          />
          <div className="mt-1 text-right text-[10px] text-neutral-400">
            {content.length} / {CONTENT_MAX}
          </div>
        </div>

        {/* ---------- Actions ---------- */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-200"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
          >
            {mode === 'create' ? '등록' : '수정'}
          </button>
        </div>
      </div>
    </div>
  );
}
