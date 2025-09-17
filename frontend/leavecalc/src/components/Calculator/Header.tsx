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
          육아휴직·휴직·징계 등 다양한 상황을 고려한 정확한 연차휴가 발생일을 확인하세요!
        </p>
      </header>
    );
  }

  return (
    <header className="space-y-2">
      <h2 className="text-3xl font-bold">연차 계산 결과</h2>
      <p className="text-sm text-neutral-400">
        ※ 본 계산기는 참고용이며, 실제 발생일수는 회사 규정 및 관계 법령에 따라 상이할 수 있습니다.
      </p>
    </header>
  );
}
