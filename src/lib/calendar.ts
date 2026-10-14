import {
  endOfMonth,
  parseISO,
  startOfMonth,
  differenceInCalendarDays,
} from "date-fns";
import { DEMO_NOW } from "../data/events";
import type { BrowseState, LibraryEvent } from "../types/event";
import {
  dateRange,
  isoDay,
  overlaps,
  relevantWeek,
  weekEnd,
  weekStart,
} from "./events";

export function calendarGranularity(state: BrowseState): "week" | "month" {
  if (state.scope === "week") return "week";
  if (state.scope === "custom")
    return differenceInCalendarDays(parseISO(state.to), parseISO(state.from)) <
      7
      ? "week"
      : "month";
  return "month";
}
export function overlappingGroups(data: LibraryEvent[]) {
  const groups: LibraryEvent[][] = [];
  let end = "";
  for (const event of [...data].sort((a, b) =>
    a.start.localeCompare(b.start),
  )) {
    if (!groups.length || event.start >= end) {
      groups.push([]);
      end = event.end;
    }
    groups[groups.length - 1].push(event);
    if (event.end > end) end = event.end;
  }
  return groups;
}
export function calendarWindow(state: BrowseState): [Date, Date] {
  const anchor = parseISO(state.calendarDate);
  return calendarGranularity(state) === "month"
    ? [startOfMonth(anchor), endOfMonth(anchor)]
    : [weekStart(anchor), weekEnd(anchor)];
}
export function calendarEvents(
  filteredEvents: LibraryEvent[],
  state: BrowseState,
) {
  return filteredEvents.filter((event) =>
    overlaps(event, ...calendarWindow(state)),
  );
}
export function firstMatchingCalendarDate(
  data: LibraryEvent[],
  state: BrowseState,
) {
  const first = [...data].sort((a, b) => a.start.localeCompare(b.start))[0];
  if (!first) return null;
  const range = dateRange(state);
  const start = parseISO(first.start);
  const anchor = range && start < range[0] ? range[0] : start;
  return isoDay(
    calendarGranularity(state) === "month"
      ? startOfMonth(anchor)
      : weekStart(anchor),
  );
}
export function relevantCalendarDate(
  filteredEvents: LibraryEvent[],
  state: BrowseState,
) {
  if (calendarGranularity(state) === "week")
    return relevantWeek(filteredEvents, state);
  const range = dateRange(state);
  if (range) return isoDay(startOfMonth(range[0]));
  if (
    filteredEvents.some((event) =>
      overlaps(event, startOfMonth(DEMO_NOW), endOfMonth(DEMO_NOW)),
    )
  )
    return isoDay(startOfMonth(DEMO_NOW));
  const first = [...filteredEvents].sort((a, b) =>
    a.start.localeCompare(b.start),
  )[0];
  return isoDay(startOfMonth(first ? parseISO(first.start) : DEMO_NOW));
}
