import { create } from "zustand";
import type { ScheduleBlock } from "@/types/schedule";
import { scheduleByDay, weeklyOrder, type DayKey } from "@/lib/data";

type ScheduleState = {
  schedule: Record<DayKey, ScheduleBlock[]>;
  timetableImage: string | null;
  setSchedule: (schedule: Record<DayKey, ScheduleBlock[]>) => void;
  addBlock: (day: DayKey, block: ScheduleBlock) => void;
  updateBlock: (day: DayKey, block: ScheduleBlock) => void;
  removeBlock: (day: DayKey, id: string) => void;
  setTimetableImage: (dataUrl: string | null) => void;
  loadFromStorage: () => void;
  saveToStorage: () => void;
};

const STORAGE_KEY = "teacherdash.schedule";
const IMAGE_KEY = "teacherdash.timetableImage";

const defaultSchedule = weeklyOrder.reduce<Record<DayKey, ScheduleBlock[]>>(
  (acc, day) => {
    acc[day] = scheduleByDay[day].map((block) => ({ ...block }));
    return acc;
  },
  {} as Record<DayKey, ScheduleBlock[]>
);

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedule: defaultSchedule,
  timetableImage: null,
  setSchedule: (schedule) => set({ schedule }),
  addBlock: (day, block) =>
    set((state) => ({
      schedule: {
        ...state.schedule,
        [day]: [...state.schedule[day], block],
      },
    })),
  updateBlock: (day, block) =>
    set((state) => ({
      schedule: {
        ...state.schedule,
        [day]: state.schedule[day].map((item) =>
          item.id === block.id ? block : item
        ),
      },
    })),
  removeBlock: (day, id) =>
    set((state) => ({
      schedule: {
        ...state.schedule,
        [day]: state.schedule[day].filter((item) => item.id !== id),
      },
    })),
  setTimetableImage: (dataUrl) => set({ timetableImage: dataUrl }),
  loadFromStorage: () => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const storedImage = window.localStorage.getItem(IMAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<DayKey, ScheduleBlock[]>;
        if (parsed && typeof parsed === "object") {
          set({ schedule: parsed });
        }
      }
      if (storedImage) {
        set({ timetableImage: storedImage });
      }
    } catch {
      // Ignore malformed storage and keep defaults.
    }
  },
  saveToStorage: () => {
    if (typeof window === "undefined") return;
    const { schedule, timetableImage } = get();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
    if (timetableImage) {
      window.localStorage.setItem(IMAGE_KEY, timetableImage);
    } else {
      window.localStorage.removeItem(IMAGE_KEY);
    }
  },
}));
