import { z } from 'zod';

// UI에서 고르는 상세 사유 (1~19)
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

/**
 * UI 표시에 쓰이는 사유 라벨
 * - 실제 텍스트는 자유롭게 변경 가능 (도메인 확정시 교체)
 * - SpecialPeriodsSection.tsx 에서 PERIOD_LABELS[code]로 표시
 */
export const PERIOD_LABELS: Record<NonWorkingSubtype, string> = {
  1: '육아휴직',
  2: '출산전후휴가',
  3: '유사산휴가',
  4: '예비군훈련',
  5: '산재기간',
  6: '공민권행사일',
  7: '출산휴가',
  8: '가족돌봄휴가',
  9: '부당해고',
  10: '직장폐쇄(불법)',
  11: '무단결근',
  12: '징계 정·휴직 등',
  13: '불법쟁의행위',
  14: '군 휴직',
  15: '일반휴직(개인사유)',
  16: '개인질병휴직',
};

/** 서버에 보내는 카테고리 (1=출근간주, 2=결근, 3=소정근로제외) */
export type NonWorkingCategory = 1 | 2 | 3;

/** UI 상태에 사용하는 특이기간 아이템 */
export interface UiNonWorkingPeriod {
  subtype: NonWorkingSubtype;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

/** API 전송용 아이템 */
export interface ApiNonWorkingPeriod {
  type: NonWorkingCategory;
  startDate: string;
  endDate: string;
}

/** 요청 페이로드 */
export interface ApiPayload {
  calculationType: 1 | 2; // 1=입사일 기준, 2=회계연도 기준
  hireDate: string; // YYYY-MM-DD
  referenceDate: string; // YYYY-MM-DD
  fiscalYear?: string; // MM-DD (calculationType=2일 때만)
  nonWorkingPeriods?: ApiNonWorkingPeriod[]; // 🔹 선택: 빈 배열이면 생략
  companyHolidays?: string[]; // 🔹 선택: 빈 배열이면 생략
}

// src/components/Calculator/feedbackTypes.ts
export type FeedbackTypeUI = '오류제보' | '개선요청' | '문의' | '이용 후기' | '기타';
export type FeedbackTypeApi =
  | 'ERROR_REPORT'
  | 'IMPROVEMENT'
  | 'QUESTION'
  | 'SATISFACTION'
  | 'OTHER';

export const FeedbackTypeMap: Record<FeedbackTypeUI, FeedbackTypeApi> = {
  오류제보: 'ERROR_REPORT',
  개선요청: 'IMPROVEMENT',
  문의: 'QUESTION',
  '이용 후기': 'SATISFACTION',
  기타: 'OTHER',
};

/** UI용 스키마 검증 */
export const uiPayloadSchema = z.object({
  calculationType: z.union([z.literal(1), z.literal(2)]),
  hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  referenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  fiscalYear: z
    .string()
    .regex(/^\d{2}-\d{2}$/)
    .optional(),
  nonWorkingPeriods: z
    .array(
      z.object({
        // 🔸 정확한 서브타입 리터럴로 제한해서 타입 추론을 NonWorkingSubtype으로 고정
        subtype: z.union([
          z.literal(1),
          z.literal(2),
          z.literal(3),
          z.literal(4),
          z.literal(5),
          z.literal(6),
          z.literal(7),
          z.literal(8),
          z.literal(9),
          z.literal(10),
          z.literal(11),
          z.literal(12),
          z.literal(13),
          z.literal(14),
          z.literal(15),
          z.literal(16),
        ]),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      }),
    )
    .optional(),
  companyHolidays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

/** subtype → category 매핑 (임시 규칙: 기본은 3=소정근로제외) */
export function mapSubtypeToCategory(sub: NonWorkingSubtype): NonWorkingCategory {
  switch (sub) {
    // ✅ 출근 처리(1)
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
    case 10:
      return 1;

    // ✅ 결근 처리(2)
    case 11:
    case 12:
    case 13:
      return 2;

    // ✅ 소정근로제외(3)
    case 14:
    case 15:
    case 16:
      return 3;

    default:
      return 3;
  }
}

/** UI 전역 상태 */
export interface CalculatorState {
  calculationType: 1 | 2;
  fiscalYear: string; // 'MM-DD'
  hireDate: string; // 'YYYY-MM-DD'
  referenceDate: string; // 'YYYY-MM-DD'
  nonWorkingPeriods: UiNonWorkingPeriod[];
  companyHolidays: string[];
  specialPeriodsEnabled: boolean;
  companyHolidaysEnabled: boolean;
}

/** Reducer Action 타입 */
export type Action =
  | { type: 'SET_CALCULATION_TYPE'; payload: 1 | 2 }
  | { type: 'SET_FISCAL_YEAR'; payload: string }
  | { type: 'SET_HIRE_DATE'; payload: string }
  | { type: 'SET_REFERENCE_DATE'; payload: string }
  | { type: 'ADD_PERIOD'; payload: UiNonWorkingPeriod }
  | { type: 'UPDATE_PERIOD'; index: number; payload: Partial<UiNonWorkingPeriod> }
  | { type: 'REMOVE_PERIOD'; index: number }
  | { type: 'CLEAR_PERIODS' }
  | { type: 'SET_SPECIAL_PERIODS_ENABLED'; payload: boolean }
  | { type: 'SET_COMPANY_HOLIDAYS'; payload: string[] }
  | { type: 'SET_COMPANY_HOLIDAYS_ENABLED'; payload: boolean };
