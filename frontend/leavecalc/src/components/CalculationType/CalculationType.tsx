// CalculationType.tsx
import { CalculationMethod } from '@interfaces/calculator';
import CustomDatePicker from '@components/CustomDatePicker/CustomDatePicker';
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
  return (
    <div className="mb-6">
      {/* 첫 번째 행: 산정 방식 + 버튼 (왼쪽) / 회계연도 (오른쪽) */}
      <div className="grid grid-cols-2 gap-4 mb-4">
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
          <div className="flex items-center gap-3">
            <div className="w-20 text-right text-sm font-medium text-gray-700">회계연도</div>
            <div className="w-27">
              <CustomDatePicker
                selected={fiscalYearDate}
                onChange={onFiscalYearDateChange}
                monthYearOnly={true}
                dateFormat="MM.dd"
                placeholderText="MM.DD"
              />
            </div>
          </div>
        )}
      </div>

      {/* 두 번째 행: 입사일 (왼쪽) / 계산 기준일 (오른쪽) */}
      <div className="grid grid-cols-2 gap-4">
        {/* 왼쪽: 입사일 필드 - gap-3 추가로 간격 조절 */}
        <div className="flex items-center gap-3">
          <div className="w-20 text-right text-sm font-medium text-gray-700">입사일</div>
          <div className="w-36">
            <CustomDatePicker
              selected={hireDate}
              onChange={onHireDateChange}
              placeholderText="YYYY.MM.DD"
            />
          </div>
        </div>

        {/* 오른쪽: 계산 기준일 필드 - gap-3 추가로 간격 조절 */}
        <div className="flex items-center gap-3">
          <div className="w-20 text-right text-sm font-medium text-gray-700">계산 기준일</div>
          <div className="w-36">
            <CustomDatePicker
              selected={hireDate}
              onChange={onHireDateChange}
              placeholderText="YYYY.MM.DD"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
