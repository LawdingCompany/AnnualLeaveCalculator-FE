import CalculatorForm from '@components/CalculatorForm/CalculatorForm';
import styles from './LandingPage.module.scss';

export default function LandingPage() {
  return (
    <div className={`min-h-screen ${styles.wrapper} flex justify-center p-4 overflow-x-auto`}>
      <div className="min-w-[1400px] w-full max-w-[1400px] mx-auto">
        <div className="flex">
          <div className="w-1/4 p-2"></div>

          <div className="w-2/4 p-2">
            <CalculatorForm />
          </div>

          <div className="w-1/4 p-2"></div>
        </div>
      </div>
    </div>
  );
}
