import React, { useState } from 'react';
import Modal from '@components/Modal/Modal';
interface InfoTooltipProps {
  title: string;
  content: React.ReactNode;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-bold text-white bg-gray-400 rounded-full hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        aria-label="정보"
      >
        ?
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={title}>
        <div className="p-4">{content}</div>
      </Modal>
    </>
  );
};

export default InfoTooltip;
