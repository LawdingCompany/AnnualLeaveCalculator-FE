export default function SubmitBar({
  onSubmit,
  disabled,
}: {
  onSubmit: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="pt-2">
      <button
        onClick={onSubmit}
        disabled={disabled}
        className={`w-full rounded-lg px-4 py-3 text-center text-white
          bg-blue-600 hover:bg-blue-700 active:translate-y-[1px]
          font-normal hover:font-semibold
          ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-blue-600 active:translate-y-0 hover:font-normal' : ''}`}
      >
        계산하기
      </button>
    </div>
  );
}
