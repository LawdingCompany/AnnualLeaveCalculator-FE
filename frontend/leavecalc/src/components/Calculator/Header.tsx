// Header.tsx
import { useCalcState } from './context';

export default function Header() {
  const s = useCalcState();
  const isResult = s.view === 'result' && s.result;

  if (!isResult) {
    // 기존 폼 헤더
    return (
      <header className="space-y-2">
        <h2 className="text-3xl font-bold">연차 계산기</h2>
        <p className="text-md font-medium leading-5 text-neutral-500">
          당신의 진짜 연차 일수는 얼마일까요? 특이사항까지 고려한 연차 일수를 지금 바로 확인하세요!
        </p>
      </header>
    );
  }

  return (
    <header className="space-y-2">
      <h2 className="text-3xl font-bold">연차 계산 결과</h2>
      <p className="text-sm text-neutral-400">
        ※ 계산 결과는 참고용이며, 실제 회사 규정과 다를 수 있습니다.
      </p>
    </header>
  );
}
