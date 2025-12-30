import { DashboardShell } from "@/components/views/DashboardShell";
import { isDayKey } from "@/lib/data";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ day: string }>;
};

export default async function DayPage({ params }: PageProps) {
  const { day } = await params;

  if (!isDayKey(day)) {
    notFound();
  }

  return <DashboardShell day={day} />;
}
