import { Modal, Button, ModalHeader, ModalBody, ModalFooter } from 'flowbite-react';
import React from 'react';
import { ModalProps } from '@interfaces/modal';

export default function ModalWrapper({ show, onClose, title, children }: ModalProps) {
  return (
    <Modal show={show} size="4xl" onClose={onClose}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>닫기</Button>
      </ModalFooter>
    </Modal>
  );
}
