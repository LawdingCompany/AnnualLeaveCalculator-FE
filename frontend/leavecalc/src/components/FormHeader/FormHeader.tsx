export default function FormHeader() {
  return (
    <>
      <h1 className="text-5xl font-semibold text-center mb-4 mt-6">연차계산기</h1>
      <p className="text-center text-xl mb-3">
        당신의 근무 연차 일수는 얼마일까요?
        <br />
        특이사항까지 고려한 정확한 계산 결과를 지금 바로 확인하세요!
      </p>
      <p className="text-xs text-center text-gray-500 mb-10">
        *연차유급휴가는 상시근로자수가 5인 이상인 경우에만 발생합니다.
      </p>
    </>
  );
}
