import CalculatorProvider, { useCalculator } from '@contexts/CalculatorContext';
import InfoTooltip from '@components/InfoTooltip/InfoTooltip';
import CustomDatePicker from '@components/DatePicker/CustomDatePicker';
import styles from './CalculatorForm.module.scss';

function CalculatorFormContent() {
  const {
    formData,
    setCalculationMethod,
    setHireDate,
    setFiscalYearDate,
    setReferenceDate,
    toggleSpecialPeriod,
    toggleHolidays,
    calculateVacation,
  } = useCalculator();

  return (
    <div className={`${styles.card} rounded-2xl p-6 shadow-md w-full max-w-lg mx-auto`}>
      <div className="text-center mb-6">
        <h1 className="text-5xl font-semibold mb-5">연차 계산기</h1>
        <p className="text-xl mb-2">
          당신의 진짜 연차 일수는 얼마일까요?
          <br />
          특이사항까지 고려한 정확한 계산 결과를 지금 바로 확인하세요!
        </p>

        <p className="text-xs text-gray-500 mb-8">
          *연차유급휴가는 상시근로자수가 5인 이상인 경우에만 발생합니다.
        </p>
      </div>

      {/* 흰색 폼 영역에 고정 높이와 스크롤 추가 */}
      <div className="bg-white rounded-xl p-5 max-h-[450px] overflow-y-auto">
        {/* 내부 콘텐츠를 감싸는 컨테이너 - 좌우 여백 일관성 유지 */}
        <div className="mx-auto w-[95%]">
          {/* 산정 방식 */}
          <div className="flex space-x-2 mb-5">
            <button
              type="button"
              onClick={() => setCalculationMethod('hireDate')}
              className={`flex-1 py-2 px-4 text-sm border rounded-md transition-colors ${
                formData.calculationMethod === 'hireDate'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              입사일
            </button>
            <button
              type="button"
              onClick={() => setCalculationMethod('fiscalYear')}
              className={`flex-1 py-2 px-4 text-sm border rounded-md transition-colors ${
                formData.calculationMethod === 'fiscalYear'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              회계연도
            </button>
          </div>

          {/* 입사일 */}
          {formData.calculationMethod === 'hireDate' && (
            <div className="grid grid-cols-3 items-center mb-4">
              <div className="text-right pr-4">
                <span className="text-sm font-medium text-gray-700">입사일</span>
              </div>
              <div className="col-span-2">
                <CustomDatePicker
                  selected={formData.hireDate}
                  onChange={setHireDate}
                  placeholderText="YYYY.MM.DD"
                />
              </div>
            </div>
          )}

          {/* 회계연도 */}
          {formData.calculationMethod === 'fiscalYear' && (
            <div className="grid grid-cols-3 items-center mb-4">
              <div className="text-right pr-4">
                <span className="text-sm font-medium text-gray-700">회계연도</span>
              </div>
              <div className="col-span-2">
                <CustomDatePicker
                  selected={formData.fiscalYearDate}
                  onChange={setFiscalYearDate}
                  monthYearOnly={true}
                  dateFormat="MM.dd"
                  placeholderText="MM.DD"
                />
              </div>
            </div>
          )}

          {/* 계산 기준일 */}
          <div className="grid grid-cols-3 items-center mb-4">
            <div className="text-right pr-4">
              <span className="text-sm font-medium text-gray-700">계산 기준일</span>
            </div>
            <div className="col-span-2">
              <CustomDatePicker
                selected={formData.referenceDate}
                onChange={setReferenceDate}
                placeholderText="YYYY.MM.DD"
              />
            </div>
          </div>

          {/* 특이사항이 있는 기간 체크박스 */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="specialPeriod"
              checked={formData.hasSpecialPeriod}
              onChange={toggleSpecialPeriod}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="specialPeriod" className="ml-2 text-sm font-medium text-gray-700">
              특이사항이 있는 기간
            </label>
            <InfoTooltip
              title="특이사항 안내"
              content={
                <div>
                  <p>특이사항이 있는 기간에 대한 자세한 설명</p>
                  <ul className="list-disc pl-5 mt-2">
                    <li>출근 처리</li>
                    <li>출산전후휴가</li>
                    <li>유산전후휴가</li>
                    <li>배우자출산</li>
                    <li>기타 특이사항</li>
                  </ul>
                </div>
              }
            />
          </div>

          {/* 여기에 특이사항 추가 목록이 들어갑니다 - 필요시 스크롤될 부분 */}
          {formData.hasSpecialPeriod && (
            <div className="mb-4">
              <div className="border border-gray-200 rounded-md p-3 space-y-3">
                <h3 className="text-sm font-medium text-gray-700">특이사항 목록</h3>

                {/* 예시 특이사항 항목들 - 실제 구현 시 동적으로 생성 */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <select className="w-full text-sm border border-gray-300 rounded-md p-1">
                      <option>출근 처리</option>
                      <option>출산전후휴가</option>
                      <option>유산전후휴가</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex space-x-2">
                    <CustomDatePicker
                      selected={null}
                      onChange={() => {}}
                      placeholderText="시작일"
                    />
                    <CustomDatePicker
                      selected={null}
                      onChange={() => {}}
                      placeholderText="종료일"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <select className="w-full text-sm border border-gray-300 rounded-md p-1">
                      <option>배우자출산</option>
                      <option>연장계약</option>
                      <option>공가</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex space-x-2">
                    <CustomDatePicker
                      selected={null}
                      onChange={() => {}}
                      placeholderText="시작일"
                    />
                    <CustomDatePicker
                      selected={null}
                      onChange={() => {}}
                      placeholderText="종료일"
                    />
                  </div>
                </div>

                <button type="button" className="text-xs text-blue-600 hover:text-blue-800">
                  + 특이사항 추가
                </button>
              </div>
            </div>
          )}

          {/* 휴일 체크박스 */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="holidays"
              checked={formData.includeHolidays}
              onChange={toggleHolidays}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="holidays" className="ml-2 text-sm font-medium text-gray-700">
              휴일(휴가, 법정 공휴일 外)
            </label>
            <InfoTooltip
              title="휴일 안내"
              content={
                <div>
                  <p>휴일에 대한 자세한 설명</p>
                  <p className="mt-2">
                    법정공휴일을 제외하고, 회사규정, 징계규정 등에서 정한 의무 휴일에 한함.
                  </p>
                </div>
              }
            />
          </div>

          {/* 휴일 추가 목록 - 필요시 스크롤될 부분 */}
          {formData.includeHolidays && (
            <div className="mb-4">
              <div className="border border-gray-200 rounded-md p-3 space-y-3">
                <h3 className="text-sm font-medium text-gray-700">휴일 목록</h3>

                {/* 예시 휴일 항목들 - 실제 구현 시 동적으로 생성 */}
                <div className="flex space-x-2 items-center">
                  <CustomDatePicker
                    selected={null}
                    onChange={() => {}}
                    placeholderText="휴일 날짜"
                  />
                  <input
                    type="text"
                    placeholder="설명"
                    className="flex-1 text-sm border border-gray-300 rounded-md p-1"
                  />
                </div>

                <div className="flex space-x-2 items-center">
                  <CustomDatePicker
                    selected={null}
                    onChange={() => {}}
                    placeholderText="휴일 날짜"
                  />
                  <input
                    type="text"
                    placeholder="설명"
                    className="flex-1 text-sm border border-gray-300 rounded-md p-1"
                  />
                </div>

                <button type="button" className="text-xs text-blue-600 hover:text-blue-800">
                  + 휴일 추가
                </button>
              </div>
            </div>
          )}

          {/* 계산하기 버튼 */}
          <button
            type="button"
            onClick={calculateVacation}
            className={`${styles.button} w-full py-2 px-4 mt-4 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            계산하기
          </button>
        </div>
      </div>
    </div>
  );
}

// 외부로 노출되는 메인 컴포넌트 - Provider를 내장
export default function CalculatorForm() {
  return (
    <CalculatorProvider>
      <CalculatorFormContent />
    </CalculatorProvider>
  );
}
