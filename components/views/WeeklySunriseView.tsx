"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Briefcase, Leaf, Sparkles, Sun } from "lucide-react";
import { GlassCard } from "../ui/GlassCard";
import { dayLabels, weeklyOrder, type DayKey } from "@/lib/data";
import { useDayStore } from "@/store/useDayStore";
import type { ScheduleBlock } from "@/types/schedule";
import { useScheduleStore } from "@/store/useScheduleStore";

const iconByType: Record<ScheduleBlock["type"], typeof BookOpen> = {
  class: BookOpen,
  meeting: Briefcase,
  reset: Leaf,
};

const toneByType: Record<ScheduleBlock["type"], string> = {
  class: "bg-rose-100/70",
  meeting: "bg-slate-200/70",
  reset: "bg-emerald-100/70",
};

export function WeeklySunriseView() {
  const router = useRouter();
  const pathname = usePathname();
  const selectedDay = useDayStore((state) => state.selectedDay);
  const setSelectedDay = useDayStore((state) => state.setSelectedDay);
  const sparkOpen = useDayStore((state) => state.sparkOpen);
  const toggleSpark = useDayStore((state) => state.toggleSpark);
  const schedule = useScheduleStore((state) => state.schedule);

  useEffect(() => {
    if (pathname !== "/") return;
    const today = new Date().getDay();
    const map: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const normalized = today === 0 || today === 6 ? "monday" : map[today - 1];
    setSelectedDay(normalized);
  }, [pathname, setSelectedDay]);

  const jumpToToday = () => {
    const today = new Date().getDay();
    const map: DayKey[] = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const normalized = today === 0 || today === 6 ? "monday" : map[today - 1];
    setSelectedDay(normalized);
    router.push(`/${normalized}`);
  };

  return (
    <section className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sunrise-orange/60" />
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">
              TeacherDash
            </p>
            <h1 className="text-2xl font-semibold text-ink">
              Good morning, Mr Jo
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-muted">
          <span className="hidden md:inline">Calm overview of the week</span>
          <button
            type="button"
            onClick={toggleSpark}
            className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft"
          >
            <Sparkles size={14} />
            {sparkOpen ? "Hide Spark" : "Show Spark"}
          </button>
          <button
            type="button"
            onClick={jumpToToday}
            className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft"
          >
            <Sun size={14} />
            Jump to today
          </button>
          <Link
            href="/planner"
            className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft"
          >
            Plan week
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {weeklyOrder.map((day) => {
          const isToday = day === selectedDay;
          const blocks = schedule[day] ?? [];
          return (
            <Link
              key={day}
              href={`/${day}`}
              onClick={() => setSelectedDay(day)}
              className="block"
            >
              <GlassCard
                className={[
                  "p-4 transition-all hover:-translate-y-1 hover:shadow-glow",
                  isToday
                    ? "border-white/80 shadow-glow"
                    : "hover:border-white/80",
                ].join(" ")}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                  {dayLabels[day]}
                </p>
                <div className="mt-4 space-y-3">
                  {blocks.map((block) => (
                    <div
                      key={block.id}
                      className={[
                        "flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-ink",
                        "transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft",
                        toneByType[block.type],
                      ].join(" ")}
                    >
                      <span className="rounded-full bg-white/80 p-2 text-ink">
                        {(() => {
                          const Icon = iconByType[block.type];
                          return <Icon size={14} />;
                        })()}
                      </span>
                      {block.title}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
