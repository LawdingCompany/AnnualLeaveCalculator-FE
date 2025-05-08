import React from 'react';
import { Accordion, AccordionContent, AccordionPanel, AccordionTitle } from 'flowbite-react';

export default function CalculationPage() {
  return (
    <div className="space-y-4">
      <Accordion>
        <AccordionPanel>
          <AccordionTitle>1. 기본 연차 계산 방식</AccordionTitle>
          <AccordionContent>
            <p>
              입사일로부터 1년 미만 근로자는 월별 1일씩(최대 11일), 1년 이상 근로자는 연 15일을
              부여합니다.
            </p>
          </AccordionContent>
        </AccordionPanel>
        <AccordionPanel>
          <AccordionTitle>2. 출근율 보정</AccordionTitle>
          <AccordionContent>
            <p>
              결근·제외 기간이 있는 경우 실제 출근율에 따라 최대 80%까지 연차 일수를 보정합니다.
            </p>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </div>
  );
}
