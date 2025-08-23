// UI에서 고르는 상세 사유 (1~16)
export type NonWorkingSubtype =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16;

// 서버에 보내는 카테고리 (1=출근처리, 2=결근처리, 3=소정근로제외)
export type NonWorkingCategory = 1 | 2 | 3;

// UI 상태에 사용하는 특이기간 아이템
export interface UiNonWorkingPeriod {
  subtype: NonWorkingSubtype;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

// API 전송용 아이템
export interface ApiNonWorkingPeriod {
  type: NonWorkingCategory;
  startDate: string;
  endDate: string;
}

export interface CalculatorState {
  calculationType: 1 | 2; // 1=입사일, 2=회계연도
  fiscalYear: string; // MM-DD (calculationType=2일 때 사용)
  hireDate: string; // YYYY-MM-DD
  referenceDate: string; // YYYY-MM-DD
  nonWorkingPeriods: UiNonWorkingPeriod[];
  companyHolidays: string[]; // YYYY-MM-DD[]
}

export type Action =
  | { type: 'SET_CALCULATION_TYPE'; payload: 1 | 2 }
  | { type: 'SET_FISCAL_YEAR'; payload: string }
  | { type: 'SET_HIRE_DATE'; payload: string }
  | { type: 'SET_REFERENCE_DATE'; payload: string }
  | { type: 'ADD_PERIOD'; payload?: Partial<UiNonWorkingPeriod> }
  | { type: 'UPDATE_PERIOD'; index: number; payload: Partial<UiNonWorkingPeriod> }
  | { type: 'REMOVE_PERIOD'; index: number }
  | { type: 'SET_COMPANY_HOLIDAYS'; payload: string[] };

// 1~16 → 1/2/3 매핑 규칙 (제출 시 사용)
export function mapSubtypeToCategory(subtype: number): NonWorkingCategory {
  if (subtype >= 1 && subtype <= 10) return 1; // 출근처리
  if (subtype >= 11 && subtype <= 13) return 2; // 결근처리
  return 3; // 14~16 소정근로제외
}

// (옵션) 라벨 맵 - 실제 명칭으로 채워 사용
export const PERIOD_LABELS: Record<NonWorkingSubtype, string> = {
  1: '육아휴직',
  2: '출산전휴휴가',
  3: '유산・사산휴가',
  4: '예비군훈련',
  5: '업무상 부상 또는 질병(산재인정)',
  6: '공민권 행사를 위한 휴무일',
  7: '배우자 출산휴가',
  8: '가족돌봄휴가',
  9: '부당해고',
  10: '불법직장폐쇄',
  11: '무단결근',
  12: '징계로 인한 정직, 강제휴직, 직위해제',
  13: '불법쟁의행위',
  14: '병역의무 이행을 위한 휴직',
  15: '개인사유로 인한 휴직',
  16: '개인질병(업무상질병X)으로 인한 휴직',
};

// ----- (옵션) Zod 런타임 형식 검증 -----
import { z } from 'zod';

export const uiPeriodSchema = z.object({
  subtype: z.number().int().min(1).max(16),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const uiPayloadSchema = z.object({
  calculationType: z.union([z.literal(1), z.literal(2)]),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  referenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nonWorkingPeriods: z.array(uiPeriodSchema),
  companyHolidays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).default([]),
  fiscalYear: z
    .string()
    .regex(/^\d{2}-\d{2}$/)
    .optional(),
});
export type UiPayload = z.infer<typeof uiPayloadSchema>;
