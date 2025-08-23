import React, { createContext, useContext, useReducer } from 'react';
import type { CalculatorState, Action, UiNonWorkingPeriod, NonWorkingSubtype } from './types';

const initialState: CalculatorState = {
  calculationType: 1,
  fiscalYear: '01-01',
  hireDate: '',
  referenceDate: '',
  nonWorkingPeriods: [{ subtype: 1, startDate: '', endDate: '' }],
  companyHolidays: [],
};

function reducer(state: CalculatorState, action: Action): CalculatorState {
  switch (action.type) {
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
        subtype: (action.payload?.subtype as NonWorkingSubtype) ?? 1,
        startDate: action.payload?.startDate ?? '',
        endDate: action.payload?.endDate ?? '',
      };
      return { ...state, nonWorkingPeriods: [...state.nonWorkingPeriods, p] };
    }
    case 'UPDATE_PERIOD': {
      const next = state.nonWorkingPeriods.map((p, i) =>
        i === action.index ? { ...p, ...action.payload } : p,
      );
      return { ...state, nonWorkingPeriods: next };
    }
    case 'REMOVE_PERIOD': {
      const next = state.nonWorkingPeriods.filter((_, i) => i !== action.index);
      return {
        ...state,
        nonWorkingPeriods: next.length ? next : [{ subtype: 1, startDate: '', endDate: '' }],
      };
    }
    case 'SET_COMPANY_HOLIDAYS':
      return { ...state, companyHolidays: action.payload };
    default:
      return state;
  }
}

const StateCtx = createContext<CalculatorState | undefined>(undefined);
const DispatchCtx = createContext<React.Dispatch<Action> | undefined>(undefined);

export function CalculatorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useCalcState() {
  const v = useContext(StateCtx);
  if (!v) throw new Error('useCalcState must be used within CalculatorProvider');
  return v;
}

export function useCalcDispatch() {
  const v = useContext(DispatchCtx);
  if (!v) throw new Error('useCalcDispatch must be used within CalculatorProvider');
  return v;
}
