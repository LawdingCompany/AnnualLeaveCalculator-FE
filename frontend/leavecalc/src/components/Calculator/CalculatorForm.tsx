import { useState } from 'react';
import { Button, Card, Checkbox, Label, TextInput } from 'flowbite-react';
import SelectButton from '@components/SelectButton/SelectButton';
import styles from './CalculatorForm.module.scss';

export default function AnnualLeaveCalculatorCard() {
  const [showSpecialPeriods, setShowSpecialPeriods] = useState(false);
  const [showCompanyHolidayInput, setShowCompanyHolidayInput] = useState(false);
  const [calculationType, setCalculationType] = useState('standard');

  const handleTypeChange = (type: string) => {
    setCalculationType(type);
  };
  return (
    <div className={`${styles.card} p-4 rounded-xl`}>
      <h1 className="text-xl font-bold text-center mb-4">연차계산기</h1>
      <p className="text-center text-sm mb-6">
        당신의 근무 연차 일수는 얼마일까요?
        <br />
        특이사항까지 고려한 정확한 계산 결과를 지금 바로 확인하세요!
      </p>
      <p className="text-xs text-center text-gray-500 mb-6">
        *연차유급휴가는 상시근로자수가 5인 이상인 경우에만 발생합니다.
      </p>
      <div
        className={`transition-all bg-white rounded-xl duration-300 ${showSpecialPeriods || showCompanyHolidayInput ? 'scale-95 opacity-80' : ''}`}
      >
        <div className="mb-4 flex items-center">
          <legend className="text-sm font-medium mr-4 w-24 ml-6">산정 방식</legend>
          <fieldset className="inline-flex rounded-md shadow-xs" role="group">
            <SelectButton
              label="입사일"
              value="standard"
              isSelected={calculationType == 'standard'}
              onClick={handleTypeChange}
            />
            <SelectButton
              label="회계연도"
              value="fiscal"
              isRight={true}
              isSelected={calculationType == 'fiscal'}
              onClick={handleTypeChange}
            />
          </fieldset>
        </div>

        {calculationType === 'fiscal' && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h3 className="text-sm font-medium mb-2">회계연도 설정</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs mb-1">시작월</label>
                <select className="w-full p-2 border rounded text-sm">
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}월
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1">종료월</label>
                <select className="w-full p-2 border rounded text-sm">
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1}월
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
