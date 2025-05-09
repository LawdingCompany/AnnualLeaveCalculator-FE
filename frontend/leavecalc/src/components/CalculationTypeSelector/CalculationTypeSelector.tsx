import React from 'react';
import SelectButton from '@components/SelectButton/SelectButton';
import { FormStyle } from '@components/CalculatorForm/CalculatorForm';

interface CalculationTypeSelectorProps {
  calculationType: string;
  setCalculationType: (type: string) => void;
  formStyle: FormStyle;
}

export default function CalculationTypeSelector({
  calculationType,
  setCalculationType,
  formStyle,
}: CalculationTypeSelectorProps) {
  const handleTypeChange = (type: string) => {
    setCalculationType(type);
  };

  return (
    <div className="grid grid-cols-12 gap-6 mb-6">
      <div className="col-span-3 text-right self-center">
        <span className={`${formStyle.labelSize} whitespace-nowrap`}>산정 방식</span>
      </div>
      <div className="col-span-9 self-center relative z-10">
        <div
          className={`inline-flex ${formStyle.inputScale} transform-gpu transition-transform duration-300`}
        >
          <SelectButton
            label="입사일"
            value="hireDate"
            isSelected={calculationType === 'hireDate'}
            onClick={handleTypeChange}
          />
          <SelectButton
            label="회계연도"
            value="fiscalYear"
            isRight={true}
            isSelected={calculationType === 'fiscalYear'}
            onClick={handleTypeChange}
          />
        </div>
      </div>
    </div>
  );
}
