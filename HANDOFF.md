# HANDOFF (2025-12-29 -- Africa/Johannesburg)

## Goal
Plan and build the next enhancement set (one-by-one with verification), then continue tomorrow from this state.

## Current state (facts only)
- Repo/branch: Teacher-Dashboard / main
- What works: Weekly + Daily views, Spark panel, planner upload, AI auto-fill (Gemini), lesson plan pages, planned badge, pastel block types, hover lift effects, Jump to today button, lesson plan templates (save/apply), quick-add block in Daily view, print view per day, gentle reminders (next block + countdown)
- What fails: No reported runtime errors after latest fixes
- Key constraints: Keep calm aesthetic; offline-first storage; explain in plain language

## Decisions (locked)
- D1: Lesson planning opens on dedicated page `/[day]/[blockId]`
- D2: Offline-first storage with optional Gemini auto-fill (API key typed each time)

## Open questions (need answers)
1) Final order/scope for enhancement list (today focus, templates, quick-add, print, reminders, status tags, export, AI verify)
2) Any priority feature to build first tomorrow?

## Next 3 tasks (ordered)
1) Verify gentle reminders (next block + countdown)
2) Implement export (JSON/CSV) (verify)
3) Implement AI auto-fill verification checkboxes (verify)

## Deferred ideas
- Block status tags (Draft/Ready/Done)
- Assessment planner view
- Term planner view

## Commands to run (exact)
- npm run dev

## Files touched (most important)
- app/page.tsx
- app/[day]/page.tsx
- app/[day]/[blockId]/page.tsx
- app/[day]/print/page.tsx
- app/planner/page.tsx
- app/api/gemini/route.ts
- components/views/WeeklySunriseView.tsx
- components/views/DailyDeepFocusView.tsx
- components/views/DayPrintView.tsx
- components/views/DashboardShell.tsx
- components/views/LessonPlanView.tsx
- components/views/PlannerUploadView.tsx
- components/panels/SparkPanel.tsx
- components/ui/GlassCard.tsx
- store/useScheduleStore.ts
- store/useLessonPlanStore.ts
- store/useDayStore.ts
- hooks/useProgressiveDisclosure.ts
- hooks/useLocalNotes.ts
- lib/data.ts
- types/schedule.ts
