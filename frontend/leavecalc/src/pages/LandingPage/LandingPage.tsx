import BrandPanel from '@components/BrandPanel/BrandPanel';
import { CalculatorCard } from '@components/Calculator';
import { CalculatorProvider } from '@components/Calculator/context';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-4">
      <div className="w-[1300px] h-[800px] shrink-0 rounded-2xl bg-white shadow-sm p-6 overflow-auto">
        <div className="grid gap-6 grid-cols-[300px_1fr] h-full">
          {/* LEFT: 브랜드 패널 */}
          <BrandPanel />
          <CalculatorProvider>
            <CalculatorCard />
          </CalculatorProvider>
        </div>
      </div>
    </div>
  );
}
