export interface ModalProps {
  show: boolean;
  onClose(): void;
  title: string;
  children: React.ReactNode;
}
