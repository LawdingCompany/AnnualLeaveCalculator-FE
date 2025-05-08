import AnnualLeaveCalculatorCard from '@components/AnnualLeaveCalculatorCard/AnnualLeaveCalculatorCard';
import styles from './LandingPage.module.scss';

export default function LandingPage() {
  return (
    <>
      <div className={`${styles.wrapper} min-h-screen flex justify-center items-center p-5`}>
        <AnnualLeaveCalculatorCard />
      </div>
    </>
  );
}
