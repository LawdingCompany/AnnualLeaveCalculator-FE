import CalculatorForm from '@components/Calculator/CalculatorForm';
import styles from './LandingPage.module.scss';
import { Card } from 'flowbite-react';

export default function LandingPage() {
  return (
    <div className={`min-h-screen ${styles.wrapper} flex flex-col md:flex-row p-4 gap-4`}>
      <div className="md:w-1/4"></div>
      <div className="md:w-2/4 mt-4 md:mt-0">
        <CalculatorForm />
      </div>
      <div className="md:w-1/4 mt-4 md:mt-0"></div>
    </div>
  );
}
