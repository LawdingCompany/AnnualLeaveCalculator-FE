import React from 'react';
import InfoTooltip from '@components/InfoTooltip/InfoTooltip';

interface OptionCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  tooltipTitle: string;
  tooltipContent: React.ReactNode;
}

const OptionCheckbox: React.FC<OptionCheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  tooltipTitle,
  tooltipContent,
}) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
      />
      <label htmlFor={id} className="ml-2 text-sm font-medium text-gray-700">
        {label}
      </label>
      <InfoTooltip title={tooltipTitle} content={tooltipContent} />
    </div>
  );
};

export default OptionCheckbox;
