import styles from './SelectButton.module.scss';

interface SelectButtonProps {
  label: string;
  value: string;
  isRight?: boolean;
  isSelected: boolean;
  onClick: (value: string) => void;
}

export default function SelectButton({
  label,
  value,
  isRight = false,
  isSelected,
  onClick,
}: Readonly<SelectButtonProps>) {
  return (
    <button
      type="button"
      className={`${styles.button} ${isSelected ? styles.selected : ''} ${isRight ? styles.rightButton : ''}`}
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
}
