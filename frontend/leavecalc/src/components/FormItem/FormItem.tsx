// components/FormItem.tsx 수정
import React, { ReactNode } from 'react';
import { FormStyle } from '@components/CalculatorForm/CalculatorForm';

interface FormItemProps {
  label: string;
  formStyle: FormStyle;
  children: ReactNode;
}

export default function FormItem({ label, formStyle, children }: FormItemProps) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-6">
      <div className="col-span-3 text-right self-center">
        <span className={`${formStyle.labelSize} whitespace-nowrap`}>{label}</span>
      </div>
      <div className="col-span-9 self-center relative z-10">{children}</div>
    </div>
  );
}
