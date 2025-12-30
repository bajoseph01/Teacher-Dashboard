"use client";

import { useEffect, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { dayLabels, type DayKey } from "@/lib/data";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useLessonPlanStore } from "@/store/useLessonPlanStore";
import Link from "next/link";

type LessonPlanViewProps = {
  day: DayKey;
  blockId: string;
};

export function LessonPlanView({ day, blockId }: LessonPlanViewProps) {
  const schedule = useScheduleStore((state) => state.schedule[day] ?? []);
  const block = useMemo(
    () => schedule.find((item) => item.id === blockId),
    [schedule, blockId]
  );

  const plans = useLessonPlanStore((state) => state.plans);
  const setPlan = useLessonPlanStore((state) => state.setPlan);
  const saveToStorage = useLessonPlanStore((state) => state.saveToStorage);
  const templates = useLessonPlanStore((state) => state.templates);
  const addTemplate = useLessonPlanStore((state) => state.addTemplate);
  const removeTemplate = useLessonPlanStore((state) => state.removeTemplate);

  const [objective, setObjective] = useState("");
  const [materials, setMaterials] = useState("");
  const [activities, setActivities] = useState("");
  const [notes, setNotes] = useState("");
  const [templateName, setTemplateName] = useState("");

  useEffect(() => {
    const existing = plans[blockId];
    if (existing) {
      setObjective(existing.objective);
      setMaterials(existing.materials);
      setActivities(existing.activities);
      setNotes(existing.notes);
    }
  }, [plans, blockId]);

  if (!block) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10 md:px-12">
        <GlassCard className="p-6">
          <h1 className="text-xl font-semibold text-ink">Lesson not found</h1>
          <p className="mt-2 text-sm text-ink-muted">
            This lesson block does not exist yet.
          </p>
          <Link
            href={`/${day}`}
            className="mt-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Back to day
          </Link>
        </GlassCard>
      </main>
    );
  }

  const handleSave = () => {
    setPlan({
      blockId,
      objective,
      materials,
      activities,
      notes,
    });
    saveToStorage();
  };

  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    addTemplate({
      id: `template-${Date.now()}`,
      name: templateName.trim(),
      objective,
      materials,
      activities,
      notes,
    });
    saveToStorage();
    setTemplateName("");
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;
    setObjective(template.objective);
    setMaterials(template.materials);
    setActivities(template.activities);
    setNotes(template.notes);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-10 md:px-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">
            {dayLabels[day]}
          </p>
          <h1 className="text-2xl font-semibold text-ink">
            {block.title} lesson plan
          </h1>
          <p className="mt-1 text-sm text-ink-muted">{block.time}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Back to week
          </Link>
          <Link
            href={`/${day}`}
            className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Back to day
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Save lesson
          </button>
        </div>
      </div>

      <GlassCard className="space-y-5 p-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
            Lesson templates
          </p>
          <div className="flex flex-wrap gap-2">
            {templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs text-ink"
              >
                <button
                  type="button"
                  onClick={() => handleApplyTemplate(template.id)}
                  className="font-semibold uppercase tracking-widest text-ink"
                >
                  {template.name}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeTemplate(template.id);
                    saveToStorage();
                  }}
                  className="text-ink-muted"
                  aria-label={`Remove ${template.name}`}
                >
                  ×
                </button>
              </div>
            ))}
            {templates.length === 0 ? (
              <span className="text-xs text-ink-muted">
                No templates yet.
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              className="min-w-[220px] flex-1 rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
              value={templateName}
              onChange={(event) => setTemplateName(event.target.value)}
              placeholder="Template name (e.g., Lecture)"
            />
            <button
              type="button"
              onClick={handleSaveTemplate}
              className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              Save as template
            </button>
          </div>
        </div>
        <label className="text-sm text-ink-muted">
          Objective
          <textarea
            className="mt-2 h-24 w-full resize-none rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-ink outline-none transition-shadow duration-200 ease-out focus:shadow-soft"
            value={objective}
            onChange={(event) => setObjective(event.target.value)}
            placeholder="What should learners understand or achieve?"
          />
        </label>
        <label className="text-sm text-ink-muted">
          Materials
          <textarea
            className="mt-2 h-24 w-full resize-none rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-ink outline-none transition-shadow duration-200 ease-out focus:shadow-soft"
            value={materials}
            onChange={(event) => setMaterials(event.target.value)}
            placeholder="Books, worksheets, devices, slides..."
          />
        </label>
        <label className="text-sm text-ink-muted">
          Activities
          <textarea
            className="mt-2 h-32 w-full resize-none rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-ink outline-none transition-shadow duration-200 ease-out focus:shadow-soft"
            value={activities}
            onChange={(event) => setActivities(event.target.value)}
            placeholder="Warm-up, main task, group work, wrap-up..."
          />
        </label>
        <label className="text-sm text-ink-muted">
          Notes
          <textarea
            className="mt-2 h-24 w-full resize-none rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-ink outline-none transition-shadow duration-200 ease-out focus:shadow-soft"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Anything to remember for next time."
          />
        </label>
      </GlassCard>
    </main>
  );
}
