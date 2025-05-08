import ModalWrapper from '@components/ModalWrapper/ModalWrapper';
import { useModal } from '@hooks/useModal';
import { Button } from 'flowbite-react';

export default function Dashboard() {
  const modal = useModal();
  return (
    <>
      <Button onClick={modal.open}>모달 열기</Button>
      <ModalWrapper show={modal.show} onClose={modal.close} title="안녕하세요">
        <p>안녕</p>
      </ModalWrapper>
    </>
  );
}
