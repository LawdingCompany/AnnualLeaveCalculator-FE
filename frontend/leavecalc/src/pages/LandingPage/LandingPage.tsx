import CalculatorForm from '@components/CalculatorForm/CalculatorForm';
import styles from './LandingPage.module.scss';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-4">
      <div className="w-[1200px] h-[800px] shrink-0 rounded-2xl bg-white shadow-sm p-6 overflow-auto">
        <div className="grid gap-6 grid-cols-[300px_1fr] h-full">
          {/* LEFT: 브랜드 패널 */}
          <aside className="relative rounded-xl bg-blue-600 text-white">
            <div className="flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
              <h1 className="text-5xl font-extrabold tracking-tight">LAWDING</h1>
              <p className="text-xl font-semibold opacity-90">연차휴가계산기</p>
            </div>
            <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] opacity-70">
              All rights reserved
            </p>
          </aside>

          {/* RIGHT: 계산 폼 카드 */}
          <main className="relative rounded-xl border border-neutral-200 p-8 overflow-y-auto">
            {/* 헤더 */}
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

            {/* 컨트롤들 */}
            <section className="mt-6 grid gap-5">
              {/* 신청 방식 탭스 */}
              <div className="grid grid-cols-[100px_1fr_100px_1fr] items-center gap-3">
                <label className="text-sm font-medium text-neutral-700">신청 방식</label>
                <div className="col-span-3 flex gap-2">
                  <button
                    className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 data-[active=true]:border-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
                    data-active
                  >
                    입사일
                  </button>
                  <button className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                    회계연도
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-sm text-neutral-600">회계연도</span>
                    <input
                      placeholder="MM.DD"
                      className="w-[90px] rounded-md border border-neutral-300 px-3 py-2 text-center text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
                      defaultValue="01.01"
                    />
                  </div>
                </div>
              </div>

              {/* 입사일 / 기준일 */}
              <div className="grid grid-cols-[100px_1fr_100px_1fr] items-center gap-3">
                <label className="text-sm font-medium text-neutral-700">입사일</label>
                <input
                  placeholder="YYYY.MM.DD"
                  className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
                />
                <span className="text-sm font-medium text-neutral-700">기준 기준일</span>
                <input
                  placeholder="YYYY.MM.DD"
                  className="rounded-md border border-blue-500 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
                />
              </div>

              {/* 특이사항 여부 */}
              <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                  <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                  특이사항이 있는 기간
                </div>
                <div className="grid gap-3 rounded-lg border border-neutral-200 p-3">
                  {/* 사유 1 */}
                  <div className="grid grid-cols-[50px_1fr_80px_1fr_80px_1fr] items-center gap-2">
                    <span className="text-sm text-neutral-600">사유</span>
                    <select className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-blue-600">
                      <option>육아휴직</option>
                      <option>산재휴업</option>
                      <option>무급휴직</option>
                    </select>
                    <span className="text-sm text-neutral-600">시작일</span>
                    <input
                      placeholder="YYYY.MM.DD"
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
                    />
                    <span className="text-sm text-neutral-600">종료일</span>
                    <input
                      placeholder="YYYY.MM.DD"
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
                    />
                  </div>

                  {/* 사유 2 (예시) */}
                  <div className="grid grid-cols-[50px_1fr_80px_1fr_80px_1fr] items-center gap-2">
                    <span className="text-sm text-neutral-600">사유</span>
                    <select className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm outline-none focus:border-blue-600">
                      <option>산전·산후휴가</option>
                      <option>질병휴직</option>
                      <option>국가근로</option>
                    </select>
                    <span className="text-sm text-neutral-600">시작일</span>
                    <input
                      placeholder="YYYY.MM.DD"
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
                    />
                    <span className="text-sm text-neutral-600">종료일</span>
                    <input
                      placeholder="YYYY.MM.DD"
                      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-blue-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-[12px] text-neutral-500">
                    <input type="checkbox" className="h-4 w-4 rounded border-neutral-300" />
                    <span>공휴일/주말/병가·경조 등은 제외 / 회사 규정에 따라 처리해주세요</span>
                  </div>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="pt-2">
                <button className="w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700 active:translate-y-[1px]">
                  계산하기
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
