import { useEffect, useMemo, useRef, useState } from "react";
import { parseISO } from "date-fns";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LayoutList,
  Plus,
  Search,
  SearchX,
  X,
} from "lucide-react";
import { branches, branchById, events } from "./data/events";
import {
  dateRange,
  filterEvents,
  eventGroup,
  initialState,
  scopeLabel,
  sortEvents,
} from "./lib/events";
import type { BrowseState, DateScope, EventSort } from "./types/event";
import { eventTypes, statuses } from "./types/event";
import { Button } from "./components/ui/button";
import {
  BranchSelector,
  DateControls,
  FilterChip,
  MultiFilter,
} from "./components/Controls";
import { EventTable, typeStyles } from "./components/EventPresentation";
import { Calendar } from "./components/Calendar";
import { Sidebar } from "./components/Sidebar";
import { relevantCalendarDate } from "./lib/calendar";
import { cn } from "./lib/utils";
import { EventDetails } from "./components/EventDetails";
import { Onboarding } from "./components/Onboarding";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./components/ui/dialog";

const PAGE_SIZE = 20;
const STORAGE_KEY = "library-events-browse-v1";
const TOUR_KEY = "library-events-tour-v1";
function shouldShowTour() {
  try {
    return localStorage.getItem(TOUR_KEY) !== "seen";
  } catch {
    return true;
  }
}
function readBrowseState(): BrowseState {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "null");
    if (saved && Array.isArray(saved.statuses))
      saved.statuses = saved.statuses.map((status: string) =>
        status === "Planning" ? "Draft" : status,
      );
    if (saved && !saved.calendarDate) saved.calendarDate = saved.calendarWeek;
    if (
      !saved ||
      !Array.isArray(saved.branches) ||
      !saved.branches.length ||
      !saved.branches.every((id: string) =>
        branches.some((b) => b.id === id),
      ) ||
      !["week", "month", "all", "custom"].includes(saved.scope) ||
      !Array.isArray(saved.statuses) ||
      !saved.statuses.every((s: never) => statuses.includes(s)) ||
      !Array.isArray(saved.types) ||
      !saved.types.every((t: never) => eventTypes.includes(t)) ||
      typeof saved.query !== "string" ||
      !["table", "calendar"].includes(saved.view) ||
      ![saved.from, saved.to, saved.calendarDate].every(
        (d) =>
          typeof d === "string" &&
          /^\d{4}-\d{2}-\d{2}$/.test(d) &&
          !Number.isNaN(parseISO(d).getTime()),
      ) ||
      saved.from > saved.to
    )
      return initialState;
    return {
      ...initialState,
      ...saved,
      page: Math.max(1, Number(saved.page) || 1),
      sort: ["relevance", "date-asc", "date-desc"].includes(saved.sort)
        ? saved.sort
        : "relevance",
      summary: ["all", "now", "upcoming", "drafts"].includes(saved.summary)
        ? saved.summary
        : "all",
    };
  } catch {
    return initialState;
  }
}
function routeId() {
  return window.location.hash.startsWith("#event/")
    ? window.location.hash.slice(7)
    : null;
}
function eventReturnTarget(id: string): HTMLElement | undefined {
  const visible = (element: HTMLElement) => element.getClientRects().length > 0;
  const link = Array.from(
    document.querySelectorAll<HTMLElement>("[data-event-id]"),
  ).find((element) => element.dataset.eventId === id && visible(element));
  if (link) return link;
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      ".calendar-cluster [data-event-ids], .calendar-day-heading [data-event-ids]",
    ),
  ).find(
    (element) =>
      element.dataset.eventIds?.split(" ").includes(id) && visible(element),
  );
}

export default function App() {
  const [state, setState] = useState<BrowseState>(readBrowseState);
  const [eventId, setEventId] = useState<string | null>(routeId);
  const [announcement, setAnnouncement] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [tourOpen, setTourOpen] = useState(shouldShowTour);
  const openedFromBrowse = useRef(false);
  const hasOpenedCalendar = useRef(state.view === "calendar");
  const returnPosition = useRef({
    id: "",
    scroll: 0,
    innerTop: 0,
    innerLeft: 0,
  });
  const previousId = useRef<string | null>(eventId);
  const summaryEvents = useMemo(
    () => filterEvents(events, { ...state, summary: "all" }),
    [state],
  );
  const results = useMemo(
    () => sortEvents(filterEvents(events, state), state),
    [state],
  );
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(state.page, pageCount);
  const paged = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectedEvent = events.find((e) => e.id === eventId);
  const branchLabel =
    state.branches.length === branches.length
      ? "All 12 branches"
      : state.branches.length === 1
        ? branchById[state.branches[0]].name
        : `${state.branches.length} selected branches`;
  const activeFilters = state.statuses.length + state.types.length;
  const range = dateRange(state);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* Browsing remains usable when storage is unavailable. */
    }
  }, [state]);
  useEffect(() => {
    const timer = window.setTimeout(
      () =>
        setAnnouncement(
          `${results.length} matching ${results.length === 1 ? "event" : "events"}. ${branchLabel}. ${scopeLabel(state)}.`,
        ),
      400,
    );
    return () => window.clearTimeout(timer);
  }, [results.length, branchLabel, state.scope, state.from, state.to]);
  useEffect(() => {
    const route = () => setEventId(routeId());
    window.addEventListener("hashchange", route);
    return () => window.removeEventListener("hashchange", route);
  }, []);
  useEffect(() => {
    document.title = selectedEvent
      ? `${selectedEvent.title} · Maple County Libraries`
      : "Events · Maple County Libraries";
    if (!eventId && previousId.current) {
      const id = returnPosition.current.id;
      requestAnimationFrame(() => {
        eventReturnTarget(id)?.focus({ preventScroll: true });
        const scroller = document.querySelector(
          ".calendar-scroll, .table-scroll",
        );
        if (scroller) {
          scroller.scrollTop = returnPosition.current.innerTop;
          scroller.scrollLeft = returnPosition.current.innerLeft;
        }
        window.scrollTo(0, returnPosition.current.scroll);
      });
    }
    previousId.current = eventId;
  }, [eventId, selectedEvent]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === "/" &&
        !eventId &&
        !tourOpen &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) &&
        !target.isContentEditable &&
        !document.querySelector("[data-radix-popper-content-wrapper]")
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [eventId, tourOpen]);

  function update(patch: Partial<BrowseState>) {
    setState((current) => ({ ...current, ...patch, page: 1 }));
  }
  function changeDate(scope: DateScope, from = state.from, to = state.to) {
    setState((current) => {
      const next = { ...current, scope, from, to, page: 1 };
      return {
        ...next,
        calendarDate: relevantCalendarDate(filterEvents(events, next), next),
      };
    });
  }
  function changeView(view: BrowseState["view"]) {
    const firstCalendarVisit =
      view === "calendar" && !hasOpenedCalendar.current;
    if (view === "calendar") hasOpenedCalendar.current = true;
    setState((current) => ({
      ...current,
      view,
      calendarDate: firstCalendarVisit
        ? relevantCalendarDate(results, current)
        : current.calendarDate,
    }));
  }
  function onOpen(id: string) {
    openedFromBrowse.current = true;
    const scroller = document.querySelector(".calendar-scroll, .table-scroll");
    returnPosition.current = {
      id,
      scroll: window.scrollY,
      innerTop: scroller?.scrollTop ?? 0,
      innerLeft: scroller?.scrollLeft ?? 0,
    };
  }
  function backToBrowse() {
    if (openedFromBrowse.current) window.history.back();
    else {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
      setEventId(null);
    }
  }

  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        Skip to content
      </a>
      <Sidebar
        state={state}
        onStartTour={() => setTourOpen(true)}
        onViewChange={(view) => {
          changeView(view);
          if (eventId) {
            window.history.replaceState(null, "", window.location.pathname);
            setEventId(null);
          }
        }}
      />
      <div className="app-content">
        <main
          id="main"
          className={cn(
            "main-shell",
            state.view === "table" && "table-overview",
          )}
          tabIndex={-1}
        >
          <section className="page-heading" aria-labelledby="events-title">
            <div>
              <h1 id="events-title" tabIndex={-1}>
                {state.view === "table" ? "Events overview" : "Events"}
              </h1>
              {state.view === "table" && (
                <p className="overview-scope">
                  {branchLabel} ·{" "}
                  {state.scope === "week"
                    ? "This week"
                    : state.scope === "month"
                      ? "This month"
                      : scopeLabel(state)}
                </p>
              )}
            </div>
            <div className="heading-actions">
              <BranchSelector
                selected={state.branches}
                onChange={(ids) => update({ branches: ids })}
              />
              <Button type="button">
                <Plus size={17} aria-hidden="true" />
                Criar novo evento
              </Button>
            </div>
          </section>
          <section className="workspace" aria-label="Browse library events">
            <div
              className="browse-controls"
              role="region"
              aria-label="Event browsing controls"
              tabIndex={0}
            >
              <div
                className="overview-summary"
                aria-label="Summary of matching events"
              >
                {([
                  ["now", "Happening now", summaryEvents.filter((event) => eventGroup(event) === "Happening now").length],
                  ["upcoming", "Upcoming", summaryEvents.filter((event) => eventGroup(event) === "Coming up").length],
                  ["drafts", "Drafts", summaryEvents.filter((event) => event.status === "Draft").length],
                ] as const).map(([key, label, count]) => (
                  <button key={key} className="summary-button" aria-pressed={state.summary === key}
                    aria-label={`Show ${count} ${label.toLowerCase()} events`}
                    onClick={() => {
                      const next = { ...state, summary: state.summary === key ? "all" : key } as BrowseState;
                      update({ summary: next.summary, calendarDate: relevantCalendarDate(filterEvents(events, next), next) });
                    }}>
                    <span className="summary-count">{String(count).padStart(2, "0")}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              <div className="scope-bar">
                <DateControls state={state} onChange={changeDate} />
                <span className="scope-dates">
                  <CalendarDays size={15} aria-hidden="true" />
                  {scopeLabel(state)}
                </span>
              </div>
              <div className="controls-body">
                <div className="toolbar">
                  <div className="search-field">
                    <Search size={18} aria-hidden="true" />
                    <input
                      ref={searchRef}
                      aria-label="Search event titles and descriptions"
                      aria-describedby="search-context"
                      placeholder="Search events…"
                      value={state.query}
                      onChange={(e) => update({ query: e.target.value })}
                    />
                    {state.query ? (
                      <button
                        aria-label="Clear search"
                        onClick={() => {
                          update({ query: "" });
                          searchRef.current?.focus();
                        }}
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    ) : (
                      <kbd aria-hidden="true">/</kbd>
                    )}
                  </div>
                  <div className="filter-controls">
                    <div className="expanded-branch-filter">
                      <BranchSelector
                        selected={state.branches}
                        onChange={(ids) => update({ branches: ids })}
                      />
                    </div>
                    <MultiFilter
                      label="Status"
                      options={statuses}
                      selected={state.statuses}
                      onChange={(values) => update({ statuses: values })}
                    />
                    <MultiFilter
                      label="Event type"
                      options={eventTypes}
                      selected={state.types}
                      onChange={(values) => update({ types: values })}
                    />
                  </div>
                  <div id="expanded-calendar-action" />
                  <div
                    className="view-switch"
                    role="group"
                    aria-label="Event representation"
                  >
                    <button
                      aria-pressed={state.view === "calendar"}
                      onClick={() => changeView("calendar")}
                      className={cn(state.view === "calendar" && "active")}
                    >
                      <CalendarDays size={16} aria-hidden="true" />
                      Calendar
                    </button>
                    <button
                      aria-pressed={state.view === "table"}
                      onClick={() => changeView("table")}
                      className={cn(state.view === "table" && "active")}
                    >
                      <LayoutList size={16} aria-hidden="true" />
                      Table
                    </button>
                  </div>
                </div>
                <div
                  id="search-context"
                  className={cn("search-context", !state.query && "sr-only")}
                >
                  Search matches titles and descriptions within the selected
                  scope.
                  {state.query && state.scope !== "all" && (
                    <button
                      className="text-button"
                      onClick={() => changeDate("all")}
                    >
                      Search all dates
                      <ArrowRight size={13} aria-hidden="true" />
                    </button>
                  )}
                </div>
                {(activeFilters > 0 || state.summary !== "all") && (
                  <div className="active-filters">
                    <span>Filtered by</span>
                    {state.summary !== "all" && <FilterChip
                      label={{ now: "Happening now", upcoming: "Upcoming", drafts: "Drafts" }[state.summary]}
                      onRemove={() => update({ summary: "all" })}
                    />}
                    {state.statuses.map((status) => (
                      <FilterChip
                        key={status}
                        label={status}
                        onRemove={() =>
                          update({
                            statuses: state.statuses.filter(
                              (s) => s !== status,
                            ),
                          })
                        }
                      />
                    ))}
                    {state.types.map((type) => (
                      <FilterChip
                        key={type}
                        label={type}
                        onRemove={() =>
                          update({
                            types: state.types.filter((t) => t !== type),
                          })
                        }
                      />
                    ))}
                    <button
                      className="text-button muted"
                      onClick={() => update({ statuses: [], types: [], summary: "all" })}
                    >
                      Clear filters
                    </button>
                  </div>
                )}
                <div className="results-bar">
                  <div>
                    {state.view === "table" && (
                      <h2 className="overview-results-title">Events</h2>
                    )}
                    <strong>
                      {results.length}{" "}
                      {results.length === 1 ? "event" : "events"}
                    </strong>
                    <span className="result-separator" aria-hidden="true">
                      /
                    </span>
                    <span>{branchLabel}</span>
                  </div>
                  <span className="sort-label">
                    {state.view === "table" ? (
                      <>
                        <ArrowDownWideNarrow size={14} aria-hidden="true" />
                        <select
                          aria-label="Sort events"
                          value={state.sort}
                          onChange={(event) =>
                            update({ sort: event.target.value as EventSort })
                          }
                        >
                          <option value="relevance">
                            {range && range[1] < new Date(2026, 9, 6)
                              ? "Chronological order"
                              : "Current & upcoming first"}
                          </option>
                          <option value="date-asc">Date: earliest first</option>
                          <option value="date-desc">Date: latest first</option>
                        </select>
                      </>
                    ) : (
                      <>
                        <Clock3 size={14} aria-hidden="true" />
                        Library time · Eastern
                      </>
                    )}
                  </span>
                </div>
                <div
                  className="sr-only"
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {announcement}
                </div>
              </div>
            </div>
            <div className="workspace-body">
              {results.length || state.view === "calendar" ? (
                state.view === "table" ? (
                  <>
                    <EventTable events={paged} state={state} onOpen={onOpen} />
                    <div className="table-footer">
                      <span>
                        Showing {(page - 1) * PAGE_SIZE + 1}–
                        {Math.min(page * PAGE_SIZE, results.length)} of{" "}
                        {results.length}{" "}
                        {results.length === 1 ? "event" : "events"}
                      </span>
                      <div className="pagination">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Previous results page"
                          disabled={page === 1}
                          onClick={() => {
                            setState((s) => ({ ...s, page: page - 1 }));
                            document
                              .querySelector(".results-bar")
                              ?.scrollIntoView({ block: "start" });
                          }}
                        >
                          <ChevronLeft size={16} aria-hidden="true" />
                        </Button>
                        <span>
                          Page {page} of {pageCount}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Next results page"
                          disabled={page === pageCount}
                          onClick={() => {
                            setState((s) => ({ ...s, page: page + 1 }));
                            document
                              .querySelector(".results-bar")
                              ?.scrollIntoView({ block: "start" });
                          }}
                        >
                          <ChevronRight size={16} aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Calendar
                    events={results}
                    state={state}
                    onWeekChange={(calendarDate) =>
                      setState((current) => ({ ...current, calendarDate }))
                    }
                    onOpen={onOpen}
                  />
                )
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">
                    <SearchX size={28} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h2>
                    {state.query || activeFilters
                      ? "No matching events"
                      : "No events in this period"}
                  </h2>
                  <p>
                    {state.query
                      ? `We couldn’t find “${state.query}” in this scope.`
                      : "There are no events in the selected branches and date range."}
                    <br />
                    Try another date range, branch, or filter.
                  </p>
                  <div className="empty-actions">
                    {state.query && (
                      <Button
                        variant="outline"
                        onClick={() => update({ query: "" })}
                      >
                        Clear search
                      </Button>
                    )}
                    {activeFilters > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => update({ statuses: [], types: [] })}
                      >
                        Clear filters
                      </Button>
                    )}
                    {state.scope !== "all" && (
                      <Button onClick={() => changeDate("all")}>
                        Search all dates
                        <ArrowRight size={15} aria-hidden="true" />
                      </Button>
                    )}
                    {state.branches.length !== branches.length && (
                      <Button
                        variant="outline"
                        onClick={() =>
                          update({ branches: branches.map((b) => b.id) })
                        }
                      >
                        View all branches
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
        <div className="event-color-legend" aria-label="Event type colors">
          {Object.entries(typeStyles).map(([name, value]) => (
            <span key={name}>
              <i className={value.className} aria-hidden="true" />
              {name}
            </span>
          ))}
        </div>
      </div>
      <Dialog
        open={!!eventId && !tourOpen}
        onOpenChange={(open) => {
          if (!open) backToBrowse();
        }}
      >
        <DialogContent
          className="event-detail-modal"
          closeLabel="Close event details"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const target = eventReturnTarget(returnPosition.current.id);
            (target ?? document.getElementById("events-title"))?.focus({
              preventScroll: true,
            });
          }}
        >
          {selectedEvent ? (
            <EventDetails event={selectedEvent} />
          ) : (
            <>
              <DialogTitle>Event not found</DialogTitle>
              <DialogDescription>
                This event could not be found. Close this window to return to
                events.
              </DialogDescription>
            </>
          )}
        </DialogContent>
      </Dialog>
      {tourOpen && (
        <Onboarding
          open
          onFinish={() => {
            try {
              localStorage.setItem(TOUR_KEY, "seen");
            } catch {
              /* The tour can still be dismissed without storage. */
            }
            setTourOpen(false);
          }}
        />
      )}
    </>
  );
}
