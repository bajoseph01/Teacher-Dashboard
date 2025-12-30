"use client";

import { GlassCard } from "../ui/GlassCard";
import type { ScheduleBlock } from "@/types/schedule";
import { useProgressiveDisclosure } from "@/hooks/useProgressiveDisclosure";
import { dayLabels, type DayKey } from "@/lib/data";
import {
  BookOpen,
  Briefcase,
  Leaf,
  MapPin,
  NotebookPen,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useLessonPlanStore } from "@/store/useLessonPlanStore";
import Link from "next/link";

const toneByType: Record<ScheduleBlock["type"], string> = {
  class: "bg-rose-100/70",
  meeting: "bg-slate-200/70",
  reset: "bg-emerald-100/70",
};

const iconByType: Record<ScheduleBlock["type"], typeof BookOpen> = {
  class: BookOpen,
  meeting: Briefcase,
  reset: Leaf,
};

const parseStartMinutes = (timeRange: string) => {
  const start = timeRange.split("-")[0]?.trim() ?? timeRange;
  const ampmMatch = start.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (ampmMatch) {
    let hour = Number(ampmMatch[1]);
    const minutes = Number(ampmMatch[2]);
    const period = ampmMatch[3].toUpperCase();
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour * 60 + minutes;
  }

  const twentyFourMatch = start.match(/(\d{1,2}):(\d{2})/);
  if (twentyFourMatch) {
    const hour = Number(twentyFourMatch[1]);
    const minutes = Number(twentyFourMatch[2]);
    return hour * 60 + minutes;
  }

  return null;
};

type DailyDeepFocusViewProps = {
  day: DayKey;
};

export function DailyDeepFocusView({ day }: DailyDeepFocusViewProps) {
  const blocks = useScheduleStore((state) => state.schedule[day] ?? []);
  const addBlock = useScheduleStore((state) => state.addBlock);
  const saveSchedule = useScheduleStore((state) => state.saveToStorage);
  const { items } = useProgressiveDisclosure(blocks);
  const plans = useLessonPlanStore((state) => state.plans);
  const plannedCount = useMemo(
    () => blocks.filter((block) => plans[block.id]).length,
    [blocks, plans]
  );
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newType, setNewType] = useState<ScheduleBlock["type"]>("class");
  const [newTopic, setNewTopic] = useState("");

  const canAdd = newTitle.trim() && newTime.trim();

  const handleQuickAdd = () => {
    if (!canAdd) return;
    addBlock(day, {
      id: `${day}-${Date.now()}`,
      title: newTitle.trim(),
      time: newTime.trim(),
      location: newLocation.trim() || "TBD",
      type: newType,
      topic: newTopic.trim() || undefined,
    });
    saveSchedule();
    setNewTitle("");
    setNewTime("");
    setNewLocation("");
    setNewTopic("");
    setShowQuickAdd(false);
  };
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const indicatorTop = useMemo(() => {
    const startTimes = blocks
      .map((block) => parseStartMinutes(block.time))
      .filter((value): value is number => value !== null);
    const minTime = Math.min(...startTimes);
    const maxTime = Math.max(...startTimes);
    if (!Number.isFinite(minTime) || !Number.isFinite(maxTime) || minTime === maxTime) {
      return "0%";
    }

    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const percent = Math.min(1, Math.max(0, (nowMinutes - minTime) / (maxTime - minTime)));
    return `${Math.round(percent * 100)}%`;
  }, [blocks, now]);

  const nextBlock = useMemo(() => {
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const candidates = blocks
      .map((block) => ({
        block,
        start: parseStartMinutes(block.time),
      }))
      .filter((item): item is { block: ScheduleBlock; start: number } => item.start !== null)
      .filter((item) => item.start >= nowMinutes)
      .sort((a, b) => a.start - b.start);
    return candidates[0] ?? null;
  }, [blocks, now]);

  const countdown = useMemo(() => {
    if (!nextBlock) return null;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const diff = Math.max(0, nextBlock.start - nowMinutes);
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, [nextBlock, now]);

  return (
    <section className="relative mt-12 w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">
            {dayLabels[day]}
          </p>
          <h2 className="text-2xl font-semibold text-ink">Daily Deep Focus</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
          <span>Time-blocked clarity</span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink">
            {plannedCount}/{blocks.length} planned
          </span>
          {nextBlock && countdown ? (
            <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink">
              Next: {nextBlock.block.title} in {countdown}
            </span>
          ) : null}
          <Link
            href={`/${day}/print`}
            className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            Print day
          </Link>
          <button
            type="button"
            onClick={() => setShowQuickAdd((prev) => !prev)}
            className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <Plus size={14} />
            Add block
          </button>
        </div>
      </div>

      {showQuickAdd ? (
        <GlassCard className="mb-6 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-ink-muted">
              Title
              <input
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="Maths (4S)"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Time (start - end)
              <input
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={newTime}
                onChange={(event) => setNewTime(event.target.value)}
                placeholder="07:30 AM - 08:50 AM"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Location
              <input
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={newLocation}
                onChange={(event) => setNewLocation(event.target.value)}
                placeholder="Room 204"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Type
              <select
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={newType}
                onChange={(event) =>
                  setNewType(event.target.value as ScheduleBlock["type"])
                }
              >
                <option value="class">class</option>
                <option value="meeting">meeting</option>
                <option value="reset">reset</option>
              </select>
            </label>
          </div>
          <label className="mt-3 text-sm text-ink-muted">
            Topic (optional)
            <input
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
              value={newTopic}
              onChange={(event) => setNewTopic(event.target.value)}
              placeholder="Short description or focus."
            />
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={!canAdd}
              className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft disabled:opacity-50"
            >
              Save block
            </button>
            <button
              type="button"
              onClick={() => setShowQuickAdd(false)}
              className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              Cancel
            </button>
          </div>
        </GlassCard>
      ) : null}

      <div className="relative grid gap-6 md:grid-cols-[110px_1fr]">
        <div className="pointer-events-none absolute left-[66px] top-0 hidden h-full w-20 md:block">
          <div className="absolute left-[18px]" style={{ top: `calc(${indicatorTop} - 8px)` }}>
            <div className="h-px w-14 bg-ink/40" />
            <div className="mt-[-10px] h-5 w-5 rounded-full border-2 border-white bg-sunrise-cream shadow-soft" />
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-6 top-2 h-full w-px bg-white/60" />
          <div className="sticky top-24 space-y-12 text-sm text-ink-muted">
            {items.map((block) => (
              <div key={block.id} className="h-20">
                {block.time}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {items.map((block) => {
            const Icon = iconByType[block.type];
            const isNext = nextBlock?.block.id === block.id;
            return (
              <GlassCard
                key={block.id}
                className={[
                  "relative overflow-hidden transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-glow",
                  isNext ? "ring-2 ring-white/80" : "",
                ].join(" ")}
              >
                <div className={`absolute inset-0 ${toneByType[block.type]}`} />
                <div
                  className="relative space-y-2 p-5"
                  onMouseEnter={block.activate}
                  onMouseLeave={block.deactivate}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/70 p-2 text-ink">
                        <Icon size={16} />
                      </span>
                      <h3 className="text-lg font-semibold text-ink">
                        {block.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                      {block.time}
                    </span>
                  </div>
                  {block.topic && (
                    <p className="text-sm text-ink">
                      <span className="font-semibold">Topic:</span>{" "}
                      {block.topic}
                    </p>
                  )}
                  <p className="text-sm text-ink">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <MapPin size={14} />
                      Location:
                    </span>{" "}
                    {block.location}
                  </p>
                  {block.type === "reset" && (
                    <p className="text-sm italic text-ink-muted">
                      Mindful moment for well-being.
                    </p>
                  )}
                  {block.isActive && block.resources?.length ? (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {block.resources.map((resource) => (
                        <a
                          key={resource.label}
                          href={resource.href}
                          className="rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs text-ink transition hover:-translate-y-0.5 hover:bg-white hover:shadow-soft"
                        >
                          {resource.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/${day}/${block.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ink transition hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      <NotebookPen size={14} />
                      Plan lesson
                    </Link>
                    {plans[block.id] ? (
                      <span className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
                        Planned
                      </span>
                    ) : null}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

    </section>
  );
}
