type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  variant?: 'alert' | 'confirm';
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'blue' | 'red';
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  variant = 'confirm',
  confirmText = '확인',
  cancelText = '취소',
  confirmColor = 'blue',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  const confirmColorClass =
    confirmColor === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-2 text-sm font-semibold text-neutral-900">{title}</h3>
        <p className="mb-4 text-sm text-neutral-600">{message}</p>

        <div className="flex justify-end gap-2">
          {variant === 'confirm' && (
            <button
              onClick={onCancel}
              className="rounded-md border border-blue-200 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50"
            >
              {cancelText}
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`rounded-md px-3 py-1.5 text-xs text-white ${confirmColorClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
