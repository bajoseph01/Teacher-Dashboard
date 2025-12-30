"use client";

import { useEffect } from "react";
import { dayLabels, type DayKey } from "@/lib/data";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useLessonPlanStore } from "@/store/useLessonPlanStore";

type DayPrintViewProps = {
  day: DayKey;
};

export function DayPrintView({ day }: DayPrintViewProps) {
  const schedule = useScheduleStore((state) => state.schedule[day] ?? []);
  const loadSchedule = useScheduleStore((state) => state.loadFromStorage);
  const plans = useLessonPlanStore((state) => state.plans);
  const loadPlans = useLessonPlanStore((state) => state.loadFromStorage);

  useEffect(() => {
    loadSchedule();
    loadPlans();
  }, [loadSchedule, loadPlans]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10 md:px-12">
      <div className="print-hidden flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">
            {dayLabels[day]}
          </p>
          <h1 className="text-2xl font-semibold text-ink">
            Daily Plan - {dayLabels[day]}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/"
            className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Back to week
          </a>
          <a
            href={`/${day}`}
            className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Back to day
          </a>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Print
          </button>
        </div>
      </div>

      <section className="space-y-4">
        {schedule.map((block) => {
          const plan = plans[block.id];
          return (
            <div
              key={block.id}
              className="rounded-2xl border border-white/60 bg-white/70 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-ink">
                    {block.title}
                  </h2>
                  <p className="text-sm text-ink-muted">
                    {block.time} | {block.location}
                  </p>
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink">
                  {block.type}
                </span>
              </div>
              {block.topic ? (
                <p className="mt-2 text-sm text-ink">
                  <span className="font-semibold">Topic:</span> {block.topic}
                </p>
              ) : null}

              {plan ? (
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Objective
                    </p>
                    <p className="text-sm text-ink">{plan.objective || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Materials
                    </p>
                    <p className="text-sm text-ink">{plan.materials || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Activities
                    </p>
                    <p className="text-sm text-ink">{plan.activities || "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      Notes
                    </p>
                    <p className="text-sm text-ink">{plan.notes || "-"}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">
                  No lesson plan yet.
                </p>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}
