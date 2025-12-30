import { create } from "zustand";
import type { DayKey } from "@/lib/data";

type DayState = {
  selectedDay: DayKey;
  sparkOpen: boolean;
  setSelectedDay: (day: DayKey) => void;
  toggleSpark: () => void;
  setSparkOpen: (open: boolean) => void;
};

export const useDayStore = create<DayState>((set) => ({
  selectedDay: "wednesday",
  sparkOpen: true,
  setSelectedDay: (day) => set({ selectedDay: day }),
  toggleSpark: () => set((state) => ({ sparkOpen: !state.sparkOpen })),
  setSparkOpen: (open) => set({ sparkOpen: open }),
}));
