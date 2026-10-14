import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { branches, DEMO_NOW } from "../data/events";
import type { BrowseState, LibraryEvent } from "../types/event";

export const weekStart = (date: Date) => startOfWeek(date, { weekStartsOn: 1 });
export const weekEnd = (date: Date) => endOfWeek(date, { weekStartsOn: 1 });
export const isoDay = (date: Date) => format(date, "yyyy-MM-dd");
export const initialState: BrowseState = {
  branches: branches.map((b) => b.id),
  scope: "week",
  from: "2026-10-05",
  to: "2026-10-11",
  query: "",
  statuses: [],
  types: [],
  view: "table",
  calendarDate: isoDay(weekStart(DEMO_NOW)),
  page: 1,
  sort: "relevance",
  summary: "all",
};
export function dateRange(state: BrowseState): [Date, Date] | null {
  if (state.scope === "all") return null;
  if (state.scope === "week") return [weekStart(DEMO_NOW), weekEnd(DEMO_NOW)];
  if (state.scope === "month")
    return [startOfMonth(DEMO_NOW), endOfMonth(DEMO_NOW)];
  return [parseISO(state.from), endOfDay(parseISO(state.to))];
}
// End is exclusive: an event ending at midnight does not occupy the next day.
export function overlaps(event: LibraryEvent, start: Date, end: Date) {
  return parseISO(event.start) <= end && parseISO(event.end) > start;
}
export function filterEvents(data: LibraryEvent[], state: BrowseState) {
  const range = dateRange(state);
  const query = state.query.trim().toLocaleLowerCase();
  return data.filter(
    (e) =>
      state.branches.includes(e.branchId) &&
      (!range || overlaps(e, ...range)) &&
      (!query ||
        `${e.title} ${e.description}`.toLocaleLowerCase().includes(query)) &&
      (!state.statuses.length || state.statuses.includes(e.status)) &&
      (!state.types.length || state.types.includes(e.type)) &&
      (state.summary === "all" ||
        (state.summary === "now" && eventGroup(e) === "Happening now") ||
        (state.summary === "upcoming" && eventGroup(e) === "Coming up") ||
        (state.summary === "drafts" && e.status === "Draft")),
  );
}
export type EventGroup =
  "Happening now" | "Coming up" | "Earlier" | "Cancelled";
export function eventGroup(event: LibraryEvent): EventGroup {
  if (event.status === "Cancelled") return "Cancelled";
  if (event.status === "Completed" || parseISO(event.end) <= DEMO_NOW)
    return "Earlier";
  if (parseISO(event.start) <= DEMO_NOW) return "Happening now";
  return "Coming up";
}
export function timingLabel(event: LibraryEvent) {
  const group = eventGroup(event);
  if (group === "Happening now") return "Happening now";
  if (group !== "Coming up") return null;
  const start = parseISO(event.start);
  if (isSameDay(start, DEMO_NOW)) return "Today";
  if (isSameDay(start, addDays(DEMO_NOW, 1))) return "Tomorrow";
  return null;
}
export function sortEvents(data: LibraryEvent[], state: BrowseState) {
  if (state.sort !== "relevance") {
    const direction = state.sort === "date-desc" ? -1 : 1;
    return [...data].sort(
      (a, b) =>
        direction * a.start.localeCompare(b.start) ||
        a.title.localeCompare(b.title),
    );
  }
  const range = dateRange(state);
  const historyOnly = range && range[1] < DEMO_NOW;
  const groups: EventGroup[] = [
    "Happening now",
    "Coming up",
    "Earlier",
    "Cancelled",
  ];
  return [...data].sort(
    (a, b) =>
      (!historyOnly
        ? groups.indexOf(eventGroup(a)) - groups.indexOf(eventGroup(b))
        : 0) ||
      a.start.localeCompare(b.start) ||
      a.title.localeCompare(b.title),
  );
}
export function relevantWeek(data: LibraryEvent[], state: BrowseState) {
  if (data.some((e) => overlaps(e, weekStart(DEMO_NOW), weekEnd(DEMO_NOW))))
    return isoDay(weekStart(DEMO_NOW));
  const earliest = [...data].sort((a, b) => a.start.localeCompare(b.start))[0];
  const range = dateRange(state);
  return isoDay(
    weekStart(earliest ? parseISO(earliest.start) : (range?.[0] ?? DEMO_NOW)),
  );
}
export function timeRange(event: LibraryEvent) {
  const start = parseISO(event.start);
  const end = parseISO(event.end);
  const startFormat =
    format(start, "a") === format(end, "a") ? "h:mm" : "h:mm a";
  return `${format(start, startFormat)}–${format(end, "h:mm a")}`;
}
export function scopeLabel(state: BrowseState) {
  const range = dateRange(state);
  if (!range) return "Past, present & upcoming";
  return `${format(range[0], "MMM d")} – ${format(range[1], "MMM d, yyyy")}`;
}
