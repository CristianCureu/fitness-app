import { create } from 'zustand';
import type { ValidateInviteResponse } from '../types/api';

export interface OnboardingData {
  // Step 1: Invite Code
  inviteCode: string;
  inviteValidationData?: ValidateInviteResponse;

  // Step 2: Personal Info
  firstName: string;
  lastName: string;
  age?: number;

  // Step 3: Body Metrics
  height?: number; // cm
  weight?: number; // kg

  // Step 4: Fitness Goals
  goalDescription?: string;
  preferredSessionsPerWeek?: number;
}

interface OnboardingState {
  currentStep: number;
  data: OnboardingData;

  // Actions
  setInviteCode: (code: string, validationData?: ValidateInviteResponse) => void;
  setPersonalInfo: (firstName: string, lastName: string, age?: number) => void;
  setBodyMetrics: (height?: number, weight?: number) => void;
  setFitnessGoals: (goalDescription?: string, preferredSessionsPerWeek?: number) => void;

  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const initialData: OnboardingData = {
  inviteCode: '',
  firstName: '',
  lastName: '',
  age: undefined,
  height: undefined,
  weight: undefined,
  goalDescription: '',
  preferredSessionsPerWeek: undefined,
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  currentStep: 1,
  data: initialData,

  setInviteCode: (code, validationData) =>
    set((state) => ({
      data: {
        ...state.data,
        inviteCode: code,
        inviteValidationData: validationData,
        // Prefill data if available
        firstName: validationData?.prefillData?.clientFirstName || state.data.firstName,
        lastName: validationData?.prefillData?.clientLastName || state.data.lastName,
      },
    })),

  setPersonalInfo: (firstName, lastName, age) =>
    set((state) => ({
      data: { ...state.data, firstName, lastName, age },
    })),

  setBodyMetrics: (height, weight) =>
    set((state) => ({
      data: { ...state.data, height, weight },
    })),

  setFitnessGoals: (goalDescription, preferredSessionsPerWeek) =>
    set((state) => ({
      data: { ...state.data, goalDescription, preferredSessionsPerWeek },
    })),

  nextStep: () =>
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 5),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    })),

  goToStep: (step) =>
    set(() => ({
      currentStep: Math.max(1, Math.min(step, 5)),
    })),

  reset: () =>
    set(() => ({
      currentStep: 1,
      data: initialData,
    })),
}));
