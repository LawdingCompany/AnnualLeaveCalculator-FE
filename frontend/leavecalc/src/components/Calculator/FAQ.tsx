export default function FAQ() {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-sm font-semibold text-gray-800">자주 묻는 질문</h3>
      <div className="space-y-2">
        {[
          {
            q: '공휴일/주말도 특이사항에 넣나요?',
            a: '아니요. 이미 소정근로일 계산에 반영됩니다.',
          },
          {
            q: '병가는 어떻게 처리되나요?',
            a: '회사 내규에 따라 제외 여부가 달라집니다. 인사 규정 참고 바랍니다.',
          },
          {
            q: '예시 값을 볼 수 있나요?',
            a: '상단 도움말 또는 ‘예시 보기’ 버튼을 눌러 상세 예시를 확인하세요.',
          },
          {
            q: '회계연도가 다른 경우는 어떻게 하나요?',
            a: '기본은 1월 1일 기준이며, 회사 설정 회계연도를 입력할 수 있습니다.',
          },
          {
            q: '연차 계산 결과는 법적 효력이 있나요?',
            a: '아니요. 본 계산기는 참고용이며 실제 효력은 회사 규정 및 관계 법령에 따릅니다.',
          },
        ].map((item, idx) => (
          <details key={idx} className="rounded-lg border p-3 text-sm">
            <summary className="cursor-pointer font-medium">{item.q}</summary>
            <div className="mt-2 text-gray-700">{item.a}</div>
          </details>
        ))}
      </div>
      <div className="mt-2 text-right text-xs text-gray-500">
        <a className="underline" href="#" onClick={(e) => e.preventDefault()}>
          FAQ 전체 보기
        </a>
      </div>
    </div>
  );
}
