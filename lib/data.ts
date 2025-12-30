import type { DailyQuote, ScheduleBlock } from "@/types/schedule";

export const weeklyOrder = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
] as const;

export type DayKey = (typeof weeklyOrder)[number];

export const dayLabels: Record<DayKey, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

export const scheduleByDay: Record<DayKey, ScheduleBlock[]> = {
  monday: [
    {
      id: "mon-math",
      title: "Math Block",
      time: "8:00 AM - 9:30 AM",
      location: "Room 204",
      topic: "Intro to Algebra",
      type: "class",
      resources: [
        { label: "Materials", href: "#" },
        { label: "Lesson Plan", href: "#" },
        { label: "Student Notes", href: "#" },
      ],
    },
    {
      id: "mon-english",
      title: "English Literature",
      time: "10:00 AM - 11:00 AM",
      location: "Room 101",
      topic: "Short Stories",
      type: "class",
      resources: [
        { label: "Reading List", href: "#" },
        { label: "Discussion Guide", href: "#" },
      ],
    },
    {
      id: "mon-pe",
      title: "Physical Education",
      time: "1:00 PM - 2:00 PM",
      location: "Gym",
      topic: "Team Challenges",
      type: "class",
    },
  ],
  tuesday: [
    {
      id: "tue-science",
      title: "Science Lab",
      time: "9:00 AM - 10:30 AM",
      location: "Lab 1",
      topic: "Photosynthesis Experiment",
      type: "class",
      resources: [
        { label: "Lab Prep", href: "#" },
        { label: "Data Sheet", href: "#" },
      ],
    },
    {
      id: "tue-art",
      title: "Art Class",
      time: "11:00 AM - 12:00 PM",
      location: "Art Studio",
      topic: "Color Theory",
      type: "class",
    },
    {
      id: "tue-parent",
      title: "Parent Meeting",
      time: "2:30 PM - 3:30 PM",
      location: "Office",
      topic: "Progress Updates",
      type: "meeting",
    },
  ],
  wednesday: [
    {
      id: "wed-math",
      title: "Math Block",
      time: "8:00 AM - 9:30 AM",
      location: "Room 204",
      topic: "Problem Solving",
      type: "class",
      resources: [
        { label: "Materials", href: "#" },
        { label: "Lesson Plan", href: "#" },
      ],
    },
    {
      id: "wed-science",
      title: "Science Lab",
      time: "10:30 AM - 11:30 AM",
      location: "Lab 1",
      topic: "Plant Cells",
      type: "class",
      resources: [
        { label: "Lab Prep", href: "#" },
        { label: "Data Sheet", href: "#" },
      ],
    },
    {
      id: "wed-reset",
      title: "Mindful Reset",
      time: "1:00 PM - 1:20 PM",
      location: "Quiet Space",
      topic: "Breathe. The best way to predict the future is to create it.",
      type: "reset",
    },
    {
      id: "wed-meeting",
      title: "Staff Meeting",
      time: "2:00 PM - 3:00 PM",
      location: "Conference Room A",
      topic: "Curriculum Review",
      type: "meeting",
    },
  ],
  thursday: [
    {
      id: "thu-history",
      title: "History Class",
      time: "9:00 AM - 10:30 AM",
      location: "Room 110",
      topic: "Primary Sources",
      type: "class",
    },
    {
      id: "thu-music",
      title: "Music Theory",
      time: "11:00 AM - 12:00 PM",
      location: "Music Room",
      topic: "Rhythm & Tempo",
      type: "class",
    },
    {
      id: "thu-plan",
      title: "Lesson Planning",
      time: "2:00 PM - 3:00 PM",
      location: "Desk",
      topic: "Next Week Outline",
      type: "meeting",
    },
  ],
  friday: [
    {
      id: "fri-quiz",
      title: "Quiz Review",
      time: "8:30 AM - 9:30 AM",
      location: "Room 204",
      topic: "Weekly Check-in",
      type: "class",
    },
    {
      id: "fri-bio",
      title: "Biology",
      time: "10:00 AM - 11:00 AM",
      location: "Lab 2",
      topic: "Ecosystems",
      type: "class",
    },
    {
      id: "fri-project",
      title: "Class Project",
      time: "1:00 PM - 2:00 PM",
      location: "Room 204",
      topic: "Presentation Prep",
      type: "class",
    },
  ],
};

export function isDayKey(value: string): value is DayKey {
  return weeklyOrder.includes(value as DayKey);
}

export const dailyQuote: DailyQuote = {
  id: "quote-1",
  quote:
    "Teaching is not about answering questions but about raising questions - opening doors for them in places they could not imagine.",
  author: "Y.B. Yeats",
};
