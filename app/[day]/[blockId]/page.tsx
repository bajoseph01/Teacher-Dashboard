import { LessonPlanView } from "@/components/views/LessonPlanView";
import { isDayKey } from "@/lib/data";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ day: string; blockId: string }>;
};

export default async function LessonPlanPage({ params }: PageProps) {
  const { day, blockId } = await params;

  if (!isDayKey(day)) {
    notFound();
  }

  return <LessonPlanView day={day} blockId={blockId} />;
}
