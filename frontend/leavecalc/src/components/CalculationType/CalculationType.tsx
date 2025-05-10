// CalculationType.tsx
import { useEffect } from 'react';
import { CalculationMethod } from '@interfaces/calculator';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';
import MonthDayInput from '@components/MonthDayInput/MonthDayInput';
import styles from './CalculationType.module.scss';

interface CalculationTypeProps {
  method: CalculationMethod;
  onMethodChange: (method: CalculationMethod) => void;
  hireDate: Date | null;
  onHireDateChange: (date: Date | null) => void;
  fiscalYearDate: Date | null;
  onFiscalYearDateChange: (date: Date | null) => void;
  referenceDate: Date | null;
  onReferenceDateChange: (date: Date | null) => void;
}

export default function CalculationType({
  method,
  onMethodChange,
  hireDate,
  onHireDateChange,
  fiscalYearDate,
  onFiscalYearDateChange,
  referenceDate,
  onReferenceDateChange,
}: Readonly<CalculationTypeProps>) {
  // 입사일 변경 핸들러 래퍼 함수
  const handleHireDateChange = (date: Date | null) => {
    // 새로운 입사일을 상태에 업데이트
    onHireDateChange(date);

    // 만약 새 입사일이 현재 계산 기준일보다 뒤라면 계산 기준일 초기화
    if (date && referenceDate && date > referenceDate) {
      onReferenceDateChange(null);
    }
  };

  // 계산 기준일 변경 핸들러 래퍼 함수
  const handleReferenceDateChange = (date: Date | null) => {
    // 만약 새 계산 기준일이 현재 입사일보다 앞이면 저장하지 않음
    if (date && hireDate && date < hireDate) {
      return;
    }

    // 유효한 계산 기준일을 상태에 업데이트
    onReferenceDateChange(date);
  };

  // 사용자가 산정 방식을 변경할 때도 날짜 유효성 검증
  useEffect(() => {
    // 입사일과 계산 기준일이 모두 있고, 입사일이 계산 기준일보다 뒤라면
    if (hireDate && referenceDate && hireDate > referenceDate) {
      // 계산 기준일 초기화
      onReferenceDateChange(null);
    }
  }, [method, hireDate, referenceDate, onReferenceDateChange]);

  return (
    <div className="mb-6">
      {/* 첫 번째 행: 산정 방식 + 버튼 (왼쪽) / 회계연도 (오른쪽) */}
      <div className="grid grid-cols-2 gap-4 mt-5 mb-11">
        {/* 왼쪽: 산정 방식 버튼 - gap-3 추가로 간격 조절 */}
        <div className="flex items-center gap-3">
          <div className="w-20 text-right text-sm font-medium text-gray-700">산정 방식</div>
          <div className="ml-1 inline-flex rounded-md border border-gray-300 overflow-hidden">
            <button
              type="button"
              onClick={() => onMethodChange('hireDate')}
              className={`py-2.5 w-24 text-sm ${
                method === 'hireDate'
                  ? styles.activeButton
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              입사일
            </button>
            <button
              type="button"
              onClick={() => onMethodChange('fiscalYear')}
              className={`py-2.5 w-24 text-sm border-l border-gray-300 ${
                method === 'fiscalYear'
                  ? styles.activeButton
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              회계연도
            </button>
          </div>
        </div>

        {/* 오른쪽: 회계연도 필드 (조건부 표시) - gap-3 추가로 간격 조절 */}
        {method === 'fiscalYear' && (
          <div className="flex items-center gap-3 ">
            <div className="w-20 text-right text-sm font-medium text-gray-700">회계연도</div>
            <div className="w-27">
              <MonthDayInput
                selected={fiscalYearDate}
                onChange={onFiscalYearDateChange}
                placeholderText="MM.DD"
              />
            </div>
          </div>
        )}
      </div>

      {/* 두 번째 행: 입사일 (왼쪽) / 계산 기준일 (오른쪽) */}
      <div className="grid grid-cols-2 gap-4 mb-11">
        {/* 왼쪽: 입사일 필드 - gap-3 추가로 간격 조절 */}
        <div className="flex items-center gap-3">
          <div className="w-20 text-right text-sm font-medium text-gray-700">입사일</div>
          <div className="w-36">
            <CustomDatePicker
              selected={hireDate}
              onChange={handleHireDateChange} // 새로운 핸들러 사용
              placeholderText="YYYY.MM.DD"
              minDate={new Date(2017, 4, 31)} // 2017년 5월 31일 이후만 선택 가능
            />
          </div>
        </div>

        {/* 오른쪽: 계산 기준일 필드 - gap-3 추가로 간격 조절 */}
        <div className="flex items-center gap-3">
          <div className="w-20 text-right text-sm font-medium text-gray-700">계산 기준일</div>
          <div className="w-36">
            <CustomDatePicker
              selected={referenceDate}
              onChange={handleReferenceDateChange} // 새로운 핸들러 사용
              placeholderText="YYYY.MM.DD"
              minDate={hireDate} // 입사일 이후만 선택 가능
            />
          </div>
        </div>
      </div>
    </div>
  );
}
