export const statuses = [
  "Scheduled",
  "Draft",
  "Completed",
  "Cancelled",
] as const;
export const eventTypes = [
  "Story hour",
  "Workshop",
  "Author talk",
  "Community meeting",
] as const;
export type EventStatus = (typeof statuses)[number];
export type EventType = (typeof eventTypes)[number];
export interface EventNote {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}
export interface LibraryEvent {
  id: string;
  title: string;
  description: string;
  branchId: string;
  type: EventType;
  status: EventStatus;
  start: string;
  end: string;
  room: string;
  createdBy: string;
  notes: EventNote[];
}
export type DateScope = "week" | "month" | "all" | "custom";
export type EventSort = "relevance" | "date-asc" | "date-desc";
export interface BrowseState {
  branches: string[];
  scope: DateScope;
  from: string;
  to: string;
  query: string;
  statuses: EventStatus[];
  types: EventType[];
  view: "table" | "calendar";
  calendarDate: string;
  page: number;
  sort: EventSort;
  summary: "all" | "now" | "upcoming" | "drafts";
}
