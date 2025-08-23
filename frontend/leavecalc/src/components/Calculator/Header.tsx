export default function Header() {
  return (
    <header className="space-y-2">
      <h2 className="text-2xl font-extrabold">연차 계산기</h2>
      <p className="text-[13px] leading-5 text-neutral-500">
        당신의 진짜 연차 일수는 얼마일까요? 특이사항까지 고려한 정확한 계산 결과를 지금 바로
        확인하세요!
      </p>
      <p className="text-[11px] text-neutral-400">
        ※ 계산결과는 참고용이며, 실제 회사 규정과 다를 수 있습니다.
      </p>
    </header>
  );
}
