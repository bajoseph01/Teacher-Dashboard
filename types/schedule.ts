export type ScheduleBlockType = "class" | "meeting" | "reset";

export type ResourceLink = {
  label: string;
  href: string;
};

export type ScheduleBlock = {
  id: string;
  title: string;
  time: string;
  location: string;
  type: ScheduleBlockType;
  topic?: string;
  resources?: ResourceLink[];
};

export type DailyQuote = {
  id: string;
  quote: string;
  author: string;
};

export type TeacherNote = {
  id: string;
  content: string;
  createdAt: string;
};
