import { DayPrintView } from "@/components/views/DayPrintView";
import { isDayKey } from "@/lib/data";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ day: string }>;
};

export default async function DayPrintPage({ params }: PageProps) {
  const { day } = await params;

  if (!isDayKey(day)) {
    notFound();
  }

  return <DayPrintView day={day} />;
}
