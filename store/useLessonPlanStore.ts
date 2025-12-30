import { create } from "zustand";

export type LessonPlan = {
  blockId: string;
  objective: string;
  materials: string;
  activities: string;
  notes: string;
};

export type LessonTemplate = {
  id: string;
  name: string;
  objective: string;
  materials: string;
  activities: string;
  notes: string;
};

type LessonPlanState = {
  plans: Record<string, LessonPlan>;
  templates: LessonTemplate[];
  setPlan: (plan: LessonPlan) => void;
  addTemplate: (template: LessonTemplate) => void;
  removeTemplate: (id: string) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
};

const STORAGE_KEY = "teacherdash.lessonPlans";

export const useLessonPlanStore = create<LessonPlanState>((set, get) => ({
  plans: {},
  templates: [],
  setPlan: (plan) =>
    set((state) => ({
      plans: {
        ...state.plans,
        [plan.blockId]: plan,
      },
    })),
  addTemplate: (template) =>
    set((state) => ({
      templates: [...state.templates, template],
    })),
  removeTemplate: (id) =>
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
    })),
  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as
          | { plans?: Record<string, LessonPlan>; templates?: LessonTemplate[] }
          | Record<string, LessonPlan>;
        if (parsed && typeof parsed === "object") {
          if ("plans" in parsed || "templates" in parsed) {
            set({
              plans: parsed.plans ?? {},
              templates: parsed.templates ?? [],
            });
          } else {
            set({ plans: parsed });
          }
        }
      }
    } catch {
      // Ignore malformed storage and keep defaults.
    }
  },
  saveToStorage: () => {
    if (typeof window === "undefined") return;
    const { plans, templates } = get();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ plans, templates })
    );
  },
}));
