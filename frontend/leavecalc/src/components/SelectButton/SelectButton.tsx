import React from 'react';

interface SelectButtonProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const SelectButton: React.FC<SelectButtonProps> = ({ isSelected, onClick, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-2 px-4 rounded-md transition-colors ${
        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
};

export default SelectButton;
