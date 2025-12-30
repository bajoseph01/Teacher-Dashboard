"use client";

import { useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { dayLabels, weeklyOrder, type DayKey } from "@/lib/data";
import type { ScheduleBlock, ScheduleBlockType } from "@/types/schedule";
import { useScheduleStore } from "@/store/useScheduleStore";
import Link from "next/link";
import { ImagePlus, Trash2 } from "lucide-react";

const blockTypes: ScheduleBlockType[] = ["class", "meeting", "reset"];

export function PlannerUploadView() {
  const schedule = useScheduleStore((state) => state.schedule);
  const timetableImage = useScheduleStore((state) => state.timetableImage);
  const setSchedule = useScheduleStore((state) => state.setSchedule);
  const addBlock = useScheduleStore((state) => state.addBlock);
  const removeBlock = useScheduleStore((state) => state.removeBlock);
  const setTimetableImage = useScheduleStore((state) => state.setTimetableImage);
  const saveToStorage = useScheduleStore((state) => state.saveToStorage);

  const [day, setDay] = useState<DayKey>("monday");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState<ScheduleBlockType>("class");
  const [resources, setResources] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [aiStatus, setAiStatus] = useState<string | null>(null);

  const blocksForDay = schedule[day] ?? [];

  const canAdd = useMemo(() => title.trim() && time.trim(), [title, time]);

  const onUpload = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setTimetableImage(reader.result);
        saveToStorage();
      }
    };
    reader.readAsDataURL(file);
  };

  const onAddBlock = () => {
    if (!canAdd) return;
    const newBlock: ScheduleBlock = {
      id: `${day}-${Date.now()}`,
      title: title.trim(),
      time: time.trim(),
      location: location.trim() || "TBD",
      topic: topic.trim() || undefined,
      type,
      resources: resources
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .map((label) => ({ label, href: "#" })),
    };
    addBlock(day, newBlock);
    saveToStorage();
    setTitle("");
    setTime("");
    setLocation("");
    setTopic("");
    setResources("");
  };

  const handleAutoFill = async () => {
    if (!timetableImage || !apiKey.trim()) {
      setAiStatus("Upload an image and enter your API key first.");
      return;
    }

    setAiStatus("Asking Gemini to read the image...");

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: apiKey.trim(),
          imageDataUrl: timetableImage,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        setAiStatus(`Gemini error: ${errorText}`);
        return;
      }

      const payload = (await response.json()) as { text?: string };
      const raw = payload.text ?? "";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned) as {
        schedule?: Record<DayKey, Array<Partial<ScheduleBlock>>>;
      };

      if (!parsed.schedule) {
        setAiStatus("Could not read a schedule from the image.");
        return;
      }

      const nextSchedule = weeklyOrder.reduce<Record<DayKey, ScheduleBlock[]>>(
        (acc, value) => {
          const blocks = parsed.schedule?.[value] ?? [];
          acc[value] = blocks.map((block, index) => ({
            id: `${value}-ai-${Date.now()}-${index}`,
            title: block.title ?? "",
            time: block.time ?? "",
            location: block.location ?? "",
            type: (block.type as ScheduleBlockType) ?? "class",
            topic: block.topic,
            resources: block.resources ?? [],
          }));
          return acc;
        },
        {} as Record<DayKey, ScheduleBlock[]>
      );

      setSchedule(nextSchedule);
      saveToStorage();
      setAiStatus("Auto-fill complete. Please review and edit if needed.");
    } catch (error) {
      setAiStatus("Failed to parse the AI response. Try again.");
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-12">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-ink-muted">
          Planner setup
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Upload your timetable and build your week
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          This works fully offline. Upload a picture, then enter blocks manually
          so the schedule is accurate.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <GlassCard className="space-y-4 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">
              Timetable image
            </h2>
            <label className="flex cursor-pointer items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft">
              <ImagePlus size={14} />
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => onUpload(event.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          {timetableImage ? (
            <img
              src={timetableImage}
              alt="Uploaded timetable"
              className="w-full rounded-2xl border border-white/60"
            />
          ) : (
            <div className="flex h-56 items-center justify-center rounded-2xl border border-dashed border-white/60 text-sm text-ink-muted">
              No image uploaded yet.
            </div>
          )}
          <div className="space-y-3 rounded-2xl border border-white/60 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
              Optional: AI auto-fill
            </p>
            <input
              className="w-full rounded-2xl border border-white/60 bg-white/80 px-3 py-2 text-sm text-ink"
              type="password"
              placeholder="Paste Gemini API key"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
            <button
              type="button"
              onClick={handleAutoFill}
              className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft"
            >
              Auto-fill from image
            </button>
            {aiStatus ? (
              <p className="text-xs text-ink-muted">{aiStatus}</p>
            ) : null}
          </div>
        </GlassCard>

        <GlassCard className="space-y-4 p-6">
          <h2 className="text-lg font-semibold text-ink">
            Add a schedule block
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm text-ink-muted">
              Day
              <select
                className="mt-1 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={day}
                onChange={(event) => setDay(event.target.value as DayKey)}
              >
                {weeklyOrder.map((value) => (
                  <option key={value} value={value}>
                    {dayLabels[value]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-ink-muted">
              Time (start - end)
              <input
                className="mt-1 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                placeholder="07:30 AM - 08:50 AM"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Title
              <input
                className="mt-1 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Maths (4S)"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Type
              <select
                className="mt-1 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={type}
                onChange={(event) => setType(event.target.value as ScheduleBlockType)}
              >
                {blockTypes.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-ink-muted">
              Location
              <input
                className="mt-1 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Room 204"
              />
            </label>
            <label className="text-sm text-ink-muted">
              Topic (optional)
              <input
                className="mt-1 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Intro to Algebra"
              />
            </label>
          </div>
          <label className="text-sm text-ink-muted">
            Resources (comma-separated)
            <input
              className="mt-1 w-full rounded-2xl border border-white/60 bg-white/70 px-3 py-2 text-sm text-ink"
              value={resources}
              onChange={(event) => setResources(event.target.value)}
              placeholder="Lesson Plan, Materials, Notes"
            />
          </label>
          <button
            type="button"
            disabled={!canAdd}
            onClick={onAddBlock}
            className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft disabled:opacity-50"
          >
            Add block
          </button>
        </GlassCard>
      </div>

      <GlassCard className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink">
            Your current schedule
          </h2>
          <Link
            href="/"
            onClick={() => saveToStorage()}
            className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft"
          >
            Save plan and return
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weeklyOrder.map((value) => (
            <div key={value} className="rounded-2xl bg-white/60 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-ink-muted">
                {dayLabels[value]}
              </h3>
              <div className="mt-3 space-y-2">
                {(schedule[value] ?? []).map((block) => (
                  <div
                    key={block.id}
                    className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 text-sm text-ink"
                  >
                    <div>
                      <div className="font-semibold">{block.title}</div>
                      <div className="text-xs text-ink-muted">{block.time}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        removeBlock(value, block.id);
                        saveToStorage();
                      }}
                      className="rounded-full bg-white/80 p-2 text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft"
                      aria-label="Remove block"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </main>
  );
}
