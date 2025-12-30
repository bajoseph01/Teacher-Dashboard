"use client";

import { GlassCard } from "../ui/GlassCard";
import { dailyQuote } from "@/lib/data";
import { useLocalNotes } from "@/hooks/useLocalNotes";
import { X } from "lucide-react";

type SparkPanelProps = {
  onClose?: () => void;
};

export function SparkPanel({ onClose }: SparkPanelProps) {
  const { note, setNote } = useLocalNotes();

  return (
    <aside className="w-full max-w-sm">
      <GlassCard className="space-y-6 p-6">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-ink">
              Quick Notes & Ideas
            </h3>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/70 p-2 text-ink transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-soft"
                aria-label="Close Spark panel"
              >
                <X size={16} />
              </button>
            ) : null}
          </div>
          <p className="text-sm text-ink-muted">
            Jot down a thought, observation, or to-do.
          </p>
          <textarea
            className="mt-4 h-28 w-full resize-none rounded-2xl border border-white/60 bg-white/70 p-4 text-sm text-ink outline-none transition-shadow duration-200 ease-out focus:shadow-soft"
            placeholder="Start typing your note here..."
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <div className="mt-3 text-right text-xs font-semibold uppercase tracking-widest text-ink-muted">
            Autosaved
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-ink">Daily Spark</h3>
          <GlassCard className="mt-3 border-white/60 bg-white/70 p-4">
            <p className="text-sm italic text-ink">
              "{dailyQuote.quote}"
            </p>
            <p className="mt-3 text-xs text-ink-muted">- {dailyQuote.author}</p>
          </GlassCard>
        </div>
      </GlassCard>
    </aside>
  );
}
