export default function SubmitBar({ onSubmit }: { onSubmit: () => void }) {
  return (
    <div className="pt-2">
      <button
        onClick={onSubmit}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 active:translate-y-[1px]"
      >
        계산하기
      </button>
    </div>
  );
}
