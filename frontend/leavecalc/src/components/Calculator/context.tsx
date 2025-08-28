// src/components/Calculator/context.tsx
import React, { createContext, useContext, useReducer } from 'react';
import type { CalculatorState, Action, UiNonWorkingPeriod } from './types';
import type { CalcApiResult } from './resultTypes';

/** 화면 모드 */
type ViewMode = 'form' | 'result';

/** 기존 폼 상태 + UI 전환/결과 상태 */
type ExtState = CalculatorState & {
  view: ViewMode;
  result: CalcApiResult | null;
};

/** 기존 액션 + 추가 액션(뷰/결과) */
type ExtAction =
  | Action
  | { type: 'SET_VIEW'; payload: ViewMode }
  | { type: 'SET_RESULT'; payload: CalcApiResult | null };

/** 초기값 */
const initialState: ExtState = {
  calculationType: 1, // 1: 입사일 기준, 2: 회계연도 기준 (프로젝트 컨벤션에 맞춰 사용)
  fiscalYear: '01-01',
  hireDate: '',
  referenceDate: '',
  nonWorkingPeriods: [],
  companyHolidays: [],
  specialPeriodsEnabled: false,
  companyHolidaysEnabled: false,

  // UI 전환/결과
  view: 'form',
  result: null,
};

/** 리듀서 */
function reducer(state: ExtState, action: ExtAction): ExtState {
  switch (action.type) {
    // ===== 기본 폼 액션들 =====
    case 'SET_CALCULATION_TYPE':
      return { ...state, calculationType: action.payload };

    case 'SET_FISCAL_YEAR':
      return { ...state, fiscalYear: action.payload };

    case 'SET_HIRE_DATE':
      return { ...state, hireDate: action.payload };

    case 'SET_REFERENCE_DATE':
      return { ...state, referenceDate: action.payload };

    case 'ADD_PERIOD': {
      const p: UiNonWorkingPeriod = {
        subtype: (action as any).payload?.subtype ?? 1,
        startDate: (action as any).payload?.startDate ?? '',
        endDate: (action as any).payload?.endDate ?? '',
      };
      return { ...state, nonWorkingPeriods: [...state.nonWorkingPeriods, p] };
    }

    case 'UPDATE_PERIOD': {
      const idx = (action as any).index as number;
      const next = state.nonWorkingPeriods.map((p, i) =>
        i === idx ? { ...p, ...(action as any).payload } : p,
      );
      return { ...state, nonWorkingPeriods: next };
    }

    case 'REMOVE_PERIOD': {
      const idx = (action as any).index as number;
      const next = state.nonWorkingPeriods.filter((_, i) => i !== idx);
      return { ...state, nonWorkingPeriods: next };
    }

    case 'CLEAR_PERIODS':
      return { ...state, nonWorkingPeriods: [] };

    case 'SET_SPECIAL_PERIODS_ENABLED':
      return { ...state, specialPeriodsEnabled: action.payload };

    case 'SET_COMPANY_HOLIDAYS':
      return { ...state, companyHolidays: action.payload };

    case 'SET_COMPANY_HOLIDAYS_ENABLED':
      return { ...state, companyHolidaysEnabled: action.payload };

    // ===== 결과 화면/전환 =====
    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'SET_RESULT':
      return { ...state, result: action.payload };

    default:
      return state;
  }
}

/** Context 분리: 읽기(State) / 쓰기(Dispatch) */
const StateCtx = createContext<ExtState | undefined>(undefined);
const DispatchCtx = createContext<React.Dispatch<ExtAction> | undefined>(undefined);

/** Provider */
export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

/** 읽기 훅 */
export function useCalcState() {
  const v = useContext(StateCtx);
  if (!v) throw new Error('useCalcState must be used within CalculatorProvider');
  return v;
}

/** 쓰기 훅 */
export function useCalcDispatch() {
  const v = useContext(DispatchCtx);
  if (!v) throw new Error('useCalcDispatch must be used within CalculatorProvider');
  return v;
}
