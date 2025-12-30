"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { DailyDeepFocusView } from "@/components/views/DailyDeepFocusView";
import { WeeklySunriseView } from "@/components/views/WeeklySunriseView";
import { SparkPanel } from "@/components/panels/SparkPanel";
import { useDayStore } from "@/store/useDayStore";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useLessonPlanStore } from "@/store/useLessonPlanStore";
import type { DayKey } from "@/lib/data";

type DashboardShellProps = {
  day: DayKey;
};

export function DashboardShell({ day }: DashboardShellProps) {
  const sparkOpen = useDayStore((state) => state.sparkOpen);
  const setSparkOpen = useDayStore((state) => state.setSparkOpen);
  const setSelectedDay = useDayStore((state) => state.setSelectedDay);
  const loadFromStorage = useScheduleStore((state) => state.loadFromStorage);
  const loadLessonPlans = useLessonPlanStore((state) => state.loadFromStorage);

  useEffect(() => {
    setSelectedDay(day);
  }, [day, setSelectedDay]);

  useEffect(() => {
    loadFromStorage();
    loadLessonPlans();
  }, [loadFromStorage, loadLessonPlans]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-10 md:px-12">
      <WeeklySunriseView />
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <DailyDeepFocusView day={day} />
        <div className="relative hidden lg:block">
          <AnimatePresence>
            {sparkOpen && (
              <motion.div
                key="spark-panel"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 30, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <SparkPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {sparkOpen && (
          <motion.div
            key="spark-panel-mobile"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 60, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm lg:hidden"
          >
            <div className="h-full w-[85%] max-w-sm p-4">
              <SparkPanel onClose={() => setSparkOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
