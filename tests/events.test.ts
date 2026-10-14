import { describe, expect, it } from "vitest";
import { parseISO } from "date-fns";
import { events, branches } from "../src/data/events";
import {
  dateRange,
  eventGroup,
  filterEvents,
  initialState,
  overlaps,
  relevantWeek,
  sortEvents,
  timingLabel,
  timeRange,
} from "../src/lib/events";
import {
  calendarEvents,
  calendarGranularity,
  calendarWindow,
  firstMatchingCalendarDate,
  overlappingGroups,
} from "../src/lib/calendar";
import type { BrowseState } from "../src/types/event";

describe("Core event browsing", () => {
  it("filters summary selections across the full scoped dataset and preserves other filters", () => {
    const base = { ...initialState, scope: "month" as const };
    const matching = filterEvents(events, base);
    for (const summary of ["now", "upcoming", "drafts"] as const) {
      const expected = matching.filter((event) => summary === "drafts"
        ? event.status === "Draft"
        : eventGroup(event) === (summary === "now" ? "Happening now" : "Coming up"));
      expect(filterEvents(events, { ...base, summary })).toEqual(expected);
    }
    const scoped = { ...base, summary: "upcoming" as const, branches: [branches[0].id], query: "watercolors" };
    expect(filterEvents(events, scoped)).toEqual(matching.filter((event) =>
      eventGroup(event) === "Coming up" && event.branchId === branches[0].id &&
      `${event.title} ${event.description}`.toLowerCase().includes("watercolors")));
    expect(filterEvents(events, { ...base, summary: "all" })).toEqual(matching);
  });
  it("groups simultaneous events while keeping back-to-back events separate", () => {
    const first = {
      ...events[0],
      id: "a",
      start: "2026-10-06T10:00:00",
      end: "2026-10-06T11:00:00",
    };
    const overlap = {
      ...first,
      id: "b",
      start: "2026-10-06T10:30:00",
      end: "2026-10-06T11:30:00",
    };
    const adjacent = {
      ...first,
      id: "c",
      start: "2026-10-06T11:30:00",
      end: "2026-10-06T12:30:00",
    };
    expect(
      overlappingGroups([adjacent, overlap, first]).map((group) =>
        group.map((e) => e.id),
      ),
    ).toEqual([["a", "b"], ["c"]]);
  });
  it("starts with every branch and only the review week", () => {
    expect(initialState.view).toBe("table");
    const matches = filterEvents(events, initialState);
    expect(matches).toHaveLength(22);
    expect(new Set(matches.map((e) => e.branchId)).size).toBe(12);
    expect(matches.some((e) => e.status === "Cancelled")).toBe(true);
  });
  it("intersects scope, search, status and type; unions selections within a filter", () => {
    const state: BrowseState = {
      ...initialState,
      branches: ["central", "riverside"],
      query: "stories",
      types: ["Story hour", "Workshop"],
      statuses: ["Scheduled"],
    };
    const matches = filterEvents(events, state);
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.every(
        (e) =>
          state.branches.includes(e.branchId) &&
          state.types.includes(e.type) &&
          e.status === "Scheduled",
      ),
    ).toBe(true);
    expect(filterEvents(events, { ...state, types: ["Author talk"] })).toEqual(
      [],
    );
  });
  it("keeps the result dataset unchanged between Table and Calendar", () => {
    const state: BrowseState = {
      ...initialState,
      branches: ["central"],
      types: ["Story hour"],
      query: "stories",
    };
    expect(
      filterEvents(events, {
        ...state,
        view: "calendar",
        calendarDate: "2026-11-02",
      }),
    ).toEqual(filterEvents(events, state));
  });
  it("retrieves completed and cancelled history without changing branch or query", () => {
    const matches = filterEvents(events, {
      ...initialState,
      scope: "all",
      branches: ["central"],
      query: "stories",
      statuses: ["Completed", "Cancelled"],
    });
    expect(matches.length).toBeGreaterThan(0);
    expect(
      matches.every(
        (e) =>
          e.branchId === "central" &&
          ["Completed", "Cancelled"].includes(e.status),
      ),
    ).toBe(true);
  });
  it("includes boundary-spanning events, excluding an event ending exactly at the start", () => {
    const e = {
      ...events[0],
      start: "2026-10-04T23:00:00",
      end: "2026-10-05T01:00:00",
    };
    const range = dateRange(initialState)!;
    expect(overlaps(e, ...range)).toBe(true);
    expect(overlaps({ ...e, end: "2026-10-05T00:00:00" }, ...range)).toBe(
      false,
    );
    expect(
      overlaps(
        { ...e, start: "2026-10-11T23:30:00", end: "2026-10-12T01:00:00" },
        ...range,
      ),
    ).toBe(true);
  });
  it("includes both dates of a custom range", () => {
    const matches = filterEvents(events, {
      ...initialState,
      scope: "custom",
      from: "2026-10-06",
      to: "2026-10-07",
    });
    expect(matches).toHaveLength(9);
    expect(
      matches.every(
        (e) =>
          e.start.slice(0, 10) >= "2026-10-06" &&
          e.start.slice(0, 10) <= "2026-10-07",
      ),
    ).toBe(true);
  });
  it("uses date proximity, with no operational alert flags", () => {
    const matches = sortEvents(
      filterEvents(events, initialState),
      initialState,
    );
    expect(
      matches.slice(0, 2).every((e) => eventGroup(e) === "Happening now"),
    ).toBe(true);
    expect(matches.at(-1)?.status).toBe("Cancelled");
    expect(timingLabel(events.find((e) => e.id === "maya-chen")!)).toBe(
      "Today",
    );
    expect(
      timingLabel(events.find((e) => e.id === "bilingual-maplewood")!),
    ).toBe("Tomorrow");
    expect(timingLabel({ ...events[0], status: "Cancelled" })).toBeNull();
    expect(timingLabel({ ...events[0], status: "Completed" })).toBeNull();
  });
  it("sorts purely historical date ranges chronologically", () => {
    const state: BrowseState = {
      ...initialState,
      scope: "custom",
      from: "2026-01-01",
      to: "2026-01-31",
    };
    const matches = sortEvents(filterEvents(events, state), state);
    expect(matches.map((e) => e.start)).toEqual(
      matches.map((e) => e.start).sort(),
    );
  });
  it("allows chronological sorting in either direction without hiding records", () => {
    const data = filterEvents(events, initialState);
    const ascending = sortEvents(data, { ...initialState, sort: "date-asc" });
    const descending = sortEvents(data, { ...initialState, sort: "date-desc" });
    expect(ascending.map((e) => e.start)).toEqual(
      data.map((e) => e.start).sort(),
    );
    expect(descending.map((e) => e.start)).toEqual(
      data
        .map((e) => e.start)
        .sort()
        .reverse(),
    );
    expect(new Set(descending.map((e) => e.id))).toEqual(
      new Set(data.map((e) => e.id)),
    );
  });
  it("navigates to historical matches independently of table sort", () => {
    const state: BrowseState = {
      ...initialState,
      scope: "all",
      branches: ["riverside"],
      query: "watercolors",
      statuses: ["Completed"],
      sort: "date-desc",
    };
    const matches = sortEvents(filterEvents(events, state), state);
    expect(firstMatchingCalendarDate(matches, state)).toBe("2026-01-01");
    expect(firstMatchingCalendarDate([], state)).toBeNull();
  });
  it("keeps a boundary-spanning matching event inside the selected date range", () => {
    const state: BrowseState = {
      ...initialState,
      scope: "custom",
      from: "2026-03-01",
      to: "2026-03-31",
    };
    const data = [
      {
        ...events[0],
        start: "2026-02-28T23:00:00",
        end: "2026-03-01T01:00:00",
      },
    ];
    expect(firstMatchingCalendarDate(filterEvents(data, state), state)).toBe(
      "2026-03-01",
    );
  });
  it("opens the first matching week when current-week results are absent", () => {
    const state: BrowseState = {
      ...initialState,
      scope: "custom",
      from: "2026-01-01",
      to: "2026-01-31",
    };
    expect(relevantWeek(filterEvents(events, state), state)).toBe("2025-12-29");
    expect(
      relevantWeek([], {
        ...initialState,
        scope: "custom",
        from: "2027-01-04",
        to: "2027-01-04",
      }),
    ).toBe("2027-01-04");
  });
  it("keeps sample records internally consistent across the full year", () => {
    expect(new Set(events.map((e) => e.id)).size).toBe(events.length);
    expect(events.length).toBeGreaterThan(200);
    expect(
      events.every(
        (e) =>
          branches.some((b) => b.id === e.branchId) &&
          parseISO(e.end) > parseISO(e.start),
      ),
    ).toBe(true);
  });
  it("labels both periods for events spanning noon", () => {
    expect(timeRange(events.find((e) => e.id === "makers-hillcrest")!)).toBe(
      "10:30 AM–12:00 PM",
    );
    expect(timeRange(events[0])).toBe("10:00–11:00 AM");
  });
  it("uses a month calendar for month scope while retaining the filtered dataset", () => {
    const state = {
      ...initialState,
      scope: "month" as const,
      calendarDate: "2026-10-01",
      statuses: ["Draft" as const],
    };
    const matches = filterEvents(events, state);
    expect(calendarGranularity(state)).toBe("month");
    expect(calendarWindow(state)[0].getMonth()).toBe(9);
    expect(calendarEvents(matches, state)).toEqual(matches);
  });
  it("uses a week calendar for default scope and applies filters before rendering", () => {
    const state = { ...initialState, statuses: ["Draft" as const] };
    const matches = filterEvents(events, state);
    expect(calendarGranularity(state)).toBe("week");
    expect(calendarEvents(matches, state)).toEqual(matches);
  });
});
