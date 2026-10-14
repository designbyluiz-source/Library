import {
  eachDayOfInterval,
  addWeeks,
  addMonths,
  endOfDay,
  endOfMonth,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  MoveRight,
  MapPin,
  ArrowUpRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { branchById, DEMO_NOW } from "../data/events";
import {
  dateRange,
  isoDay,
  overlaps,
  timeRange,
  timingLabel,
  weekEnd,
  weekStart,
} from "../lib/events";
import type { BrowseState, LibraryEvent } from "../types/event";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { EventIcon, StatusBadge, typeStyles } from "./EventPresentation";
import { DayEvents } from "./DayEvents";
import {
  calendarGranularity,
  calendarWindow,
  firstMatchingCalendarDate,
  overlappingGroups,
} from "../lib/calendar";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface PositionedEvent {
  event: LibraryEvent;
  start: number;
  end: number;
  lane: number;
  lanes: number;
}
function positionEvents(events: LibraryEvent[], day: Date): PositionedEvent[] {
  const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const positioned: PositionedEvent[] = events
    .map((event) => ({
      event,
      start: Math.max(
        0,
        (parseISO(event.start).getTime() - startOfDay.getTime()) / 3_600_000,
      ),
      end: Math.min(
        24,
        (parseISO(event.end).getTime() - startOfDay.getTime()) / 3_600_000,
      ),
      lane: 0,
      lanes: 1,
    }))
    .sort((a, b) => a.start - b.start || b.end - a.end);
  let cluster: PositionedEvent[] = [];
  let clusterEnd = -1;
  function assign() {
    const laneEnds: number[] = [];
    for (const item of cluster) {
      let lane = laneEnds.findIndex((end) => end <= item.start);
      if (lane === -1) lane = laneEnds.length;
      laneEnds[lane] = item.end;
      item.lane = lane;
    }
    cluster.forEach((item) => {
      item.lanes = laneEnds.length;
    });
  }
  for (const item of positioned) {
    if (item.start >= clusterEnd) {
      assign();
      cluster = [];
      clusterEnd = -1;
    }
    cluster.push(item);
    clusterEnd = Math.max(clusterEnd, item.end);
  }
  assign();
  return positioned;
}

function CalendarCardContent({ event }: { event: LibraryEvent }) {
  const Icon = typeStyles[event.type].icon;
  return (
    <div className="calendar-card-content">
      <div className="card-type">
        <Icon size={14} aria-hidden="true" />
        <span>{event.type}</span>
        <ArrowUpRight size={13} aria-hidden="true" />
      </div>
      <div className="card-time">{timeRange(event)}</div>
      <div className="card-compact-time" aria-hidden="true">
        {format(
          parseISO(event.start),
          parseISO(event.start).getMinutes() === 0 ? "ha" : "h:mm a",
        )}
      </div>
      <strong className="card-title">{event.title}</strong>
      <div className="card-location">
        <MapPin size={12} aria-hidden="true" />
        <span>{branchById[event.branchId].short}</span>
      </div>
      <div className="card-room">{event.room}</div>
      <div className="card-footer">
        <span>{event.status}</span>
        {timingLabel(event) && <span>{timingLabel(event)}</span>}
      </div>
    </div>
  );
}

export function Calendar({
  events,
  state,
  onWeekChange,
  onOpen,
}: {
  events: LibraryEvent[];
  state: BrowseState;
  onWeekChange: (week: string) => void;
  onOpen: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [compactWeek, setCompactWeek] = useState(
    () => window.matchMedia("(max-width: 1000px)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width: 1000px)");
    const update = () => setCompactWeek(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const expandButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const onEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !document.querySelector('[role="dialog"]')
      ) {
        setExpanded(false);
        expandButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [expanded]);
  const expandButtonElement = (
    <Button
      className="calendar-expand-toggle"
      ref={expandButton}
      variant="outline"
      size="icon"
      aria-label={expanded ? "Exit expanded calendar" : "Expand calendar"}
      title={expanded ? "Exit expanded calendar (Esc)" : "Expand calendar"}
      aria-pressed={expanded}
      onClick={() => setExpanded(!expanded)}
    >
      {expanded ? (
        <Minimize2 size={17} aria-hidden="true" />
      ) : (
        <Maximize2 size={17} aria-hidden="true" />
      )}
    </Button>
  );
  const actionSlot = document.getElementById("expanded-calendar-action");
  const expandControl =
    expanded && actionSlot
      ? createPortal(expandButtonElement, actionSlot)
      : expandButtonElement;
  if (!events.length) {
    return (
      <div
        className={cn(
          "calendar calendar-empty",
          expanded && "calendar-expanded",
        )}
      >
        <div className="calendar-toolbar">
          <div className="calendar-navigation">{expandControl}</div>
        </div>
        <p role="status">
          No events match the current filters. Try another branch, date range,
          or filter.
        </p>
      </div>
    );
  }
  const anchor = parseISO(state.calendarDate);
  const granularity = calendarGranularity(state);
  const [windowStart, windowEnd] = calendarWindow(state);
  const start =
    granularity === "month"
      ? startOfWeek(windowStart, { weekStartsOn: 1 })
      : windowStart;
  const end =
    granularity === "month"
      ? endOfWeek(windowEnd, { weekStartsOn: 1 })
      : windowEnd;
  const range = dateRange(state);
  const days = eachDayOfInterval({ start, end });
  const visible = events.filter((event) => overlaps(event, start, end));
  const inWindow = events.filter((event) =>
    overlaps(event, windowStart, windowEnd),
  );
  const firstMatch = firstMatchingCalendarDate(events, state);
  const matchingDatesNotice =
    !inWindow.length && firstMatch ? (
      <div className="matching-dates-notice" role="status">
        <span>
          No matches in this {granularity}. {events.length} matching{" "}
          {events.length === 1 ? "event is" : "events are"} available on other
          dates.
        </span>
        <Button
          variant="outline"
          onClick={() => {
            onWeekChange(firstMatch);
            requestAnimationFrame(() => {
              const scroller =
                document.querySelector<HTMLElement>(".calendar-scroll");
              if (scroller) {
                scroller.scrollTop = 0;
                scroller.focus({ preventScroll: true });
              }
            });
          }}
        >
          View matching dates
          <MoveRight size={14} aria-hidden="true" />
        </Button>
      </div>
    ) : null;
  const weeks = [
    ...new Set(events.map((e) => isoDay(weekStart(parseISO(e.start))))),
  ].sort();
  const laterMatch = weeks.find((w) => w > state.calendarDate);
  const nextMatch =
    laterMatch ?? [...weeks].reverse().find((w) => w < state.calendarDate);
  const previousAllowed =
    !range ||
    (granularity === "month"
      ? endOfMonth(addMonths(anchor, -1)) >= range[0]
      : weekEnd(addWeeks(anchor, -1)) >= range[0]);
  const nextAllowed =
    !range ||
    (granularity === "month"
      ? startOfMonth(addMonths(anchor, 1)) <= range[1]
      : addWeeks(anchor, 1) <= range[1]);
  const placements = days.map((day) =>
    positionEvents(
      visible.filter((e) => overlaps(e, day, endOfDay(day))),
      day,
    ),
  );
  const flat = placements.flat();
  const startHour = Math.min(
    9,
    Math.floor(Math.min(...flat.map((e) => e.start))),
  );
  const endHour = Math.max(20, Math.ceil(Math.max(...flat.map((e) => e.end))));
  const height = (endHour - startHour) * 88;
  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i,
  );
  if (granularity === "month") {
    return (
      <div
        className={cn(
          "calendar month-calendar",
          expanded && "calendar-expanded",
        )}
      >
        <div className="calendar-toolbar">
          <div>
            <h2>{format(anchor, "MMMM yyyy")}</h2>
            <p>
              {
                events.filter((event) =>
                  overlaps(event, windowStart, windowEnd),
                ).length
              }{" "}
              of {events.length} matching events in this month
            </p>
          </div>
          <div className="calendar-navigation">
            {expandControl}
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous calendar month"
              disabled={!previousAllowed}
              onClick={() =>
                onWeekChange(format(addMonths(anchor, -1), "yyyy-MM-dd"))
              }
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next calendar month"
              disabled={!nextAllowed}
              onClick={() =>
                onWeekChange(format(addMonths(anchor, 1), "yyyy-MM-dd"))
              }
            >
              <ChevronRight size={17} aria-hidden="true" />
            </Button>
          </div>
        </div>
        {matchingDatesNotice}
        <div
          className="calendar-scroll"
          tabIndex={0}
          role="region"
          aria-label="Monthly calendar"
        >
          <div
            className="month-grid"
            style={{ gridTemplateColumns: "repeat(7, minmax(130px, 1fr))" }}
          >
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div className="month-weekday" key={day}>
                {day}
              </div>
            ))}
            {days.map((day) => {
              const dayEvents = events.filter((event) =>
                overlaps(event, day, endOfDay(day)),
              );
              const inMonth = day.getMonth() === anchor.getMonth();
              return (
                <div
                  className={cn(
                    "month-cell",
                    !inMonth && "outside-month",
                    isSameDay(day, DEMO_NOW) && "today",
                  )}
                  key={day.toISOString()}
                >
                  <div className="month-date">
                    <strong>{format(day, "d")}</strong>
                    {isSameDay(day, DEMO_NOW) && <span>Today</span>}
                  </div>
                  {dayEvents.slice(0, 3).map((event) => (
                    <a
                      key={event.id}
                      className={cn(
                        "month-event",
                        typeStyles[event.type].className,
                        event.status === "Cancelled" && "cancelled",
                      )}
                      href={`#event/${event.id}`}
                      aria-label={`${event.title}, ${event.type}, ${timeRange(event)}, ${branchById[event.branchId].name}, ${event.room}, ${event.status}`}
                      onClick={() => onOpen(event.id)}
                    >
                      <CalendarCardContent event={event} />
                    </a>
                  ))}
                  {dayEvents.length > 3 && (
                    <DayEvents
                      day={day}
                      events={dayEvents}
                      onOpen={onOpen}
                      label={`+${dayEvents.length - 3} more`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="calendar-legend">
          {Object.entries(typeStyles).map(([name, value]) => (
            <span key={name}>
              <i className={value.className} aria-hidden="true" />
              {name}
            </span>
          ))}
          <span className="calendar-timezone">
            All times Eastern · Week starts Monday
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("calendar", expanded && "calendar-expanded")}>
      <div className="calendar-toolbar">
        <div>
          <h2>
            {format(start, "MMMM d")} – {format(end, "d, yyyy")}
          </h2>
          <p>
            {visible.length} of {events.length} matching events in this week
          </p>
        </div>
        <div className="calendar-navigation">
          {expandControl}
          {nextMatch && visible.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onWeekChange(nextMatch)}
            >
              {visible.length
                ? laterMatch
                  ? "Next week with events"
                  : "Previous week with events"
                : "Go to matching events"}
              <MoveRight size={14} aria-hidden="true" />
            </Button>
          )}
          <div className="arrow-buttons">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous calendar week"
              disabled={!previousAllowed}
              onClick={() => onWeekChange(isoDay(addWeeks(start, -1)))}
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next calendar week"
              disabled={!nextAllowed}
              onClick={() => onWeekChange(isoDay(addWeeks(start, 1)))}
            >
              <ChevronRight size={17} aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
      {matchingDatesNotice}
      {compactWeek ? (
        <div
          className="calendar-scroll week-agenda"
          role="region"
          aria-label="Weekly agenda, library time Eastern"
          tabIndex={0}
        >
          {days.map((day) => {
            const dayEvents = visible
              .filter((event) => overlaps(event, day, endOfDay(day)))
              .sort((a, b) => a.start.localeCompare(b.start));
            return (
              <section
                className={cn(
                  "agenda-day",
                  isSameDay(day, DEMO_NOW) && "today",
                )}
                key={day.toISOString()}
                aria-label={format(day, "EEEE, MMMM d")}
              >
                <div className="agenda-day-heading">
                  <h3>
                    {format(day, "EEEE, MMM d")}
                    {isSameDay(day, DEMO_NOW) && <span>Today</span>}
                  </h3>
                  {dayEvents.length > 0 && (
                    <DayEvents day={day} events={dayEvents} onOpen={onOpen} />
                  )}
                </div>
                {dayEvents.length ? (
                  dayEvents.map((event) => (
                    <a
                      key={event.id}
                      data-event-id={event.id}
                      href={`#event/${event.id}`}
                      className="agenda-event"
                      onClick={() => onOpen(event.id)}
                    >
                      <EventIcon type={event.type} />
                      <span className="agenda-event-info">
                        <strong>{event.title}</strong>
                        <span>
                          {timeRange(event)} · {branchById[event.branchId].name}
                        </span>
                      </span>
                      <StatusBadge status={event.status} />
                    </a>
                  ))
                ) : (
                  <p className="agenda-empty">No events</p>
                )}
              </section>
            );
          })}
        </div>
      ) : (
        <div
          className="calendar-scroll"
          role="region"
          aria-label="Weekly calendar, library time Eastern"
          tabIndex={0}
        >
          <div className="calendar-grid">
            <div className="calendar-time-heading">ET</div>
            {days.map((day, i) => (
              <div
                key={isoDay(day)}
                className={cn(
                  "calendar-day-heading",
                  isSameDay(day, DEMO_NOW) && "today",
                  range &&
                    (endOfDay(day) < range[0] || day > range[1]) &&
                    "outside-scope",
                )}
              >
                <span>{format(day, "EEE")}</span>
                <strong>{format(day, "d")}</strong>
                {range && (endOfDay(day) < range[0] || day > range[1]) ? (
                  <small>Outside scope</small>
                ) : (
                  placements[i].length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="day-events-trigger"
                          aria-label={`View ${placements[i].length} ${placements[i].length === 1 ? "event" : "events"} on ${format(day, "EEEE, MMMM d")}`}
                        >
                          {placements[i].length}{" "}
                          {placements[i].length === 1 ? "event" : "events"}
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle className="day-dialog-title">
                          {format(day, "EEEE, MMMM d")}
                        </DialogTitle>
                        <DialogDescription className="day-dialog-description">
                          {placements[i].length} matching events · All times
                          Eastern
                        </DialogDescription>
                        <div className="day-event-list">
                          {placements[i].map(({ event }) => (
                            <DialogClose asChild key={event.id}>
                              <a
                                key={event.id}
                                href={`#event/${event.id}`}
                                className="day-event-link"
                                onClick={() => onOpen(event.id)}
                              >
                                <EventIcon type={event.type} />
                                <span>
                                  <strong>{event.title}</strong>
                                  <span>
                                    {timeRange(event)} ·{" "}
                                    {branchById[event.branchId].name}
                                  </span>
                                </span>
                                <StatusBadge status={event.status} />
                              </a>
                            </DialogClose>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )
                )}
              </div>
            ))}
            <div className="calendar-hours" style={{ height }}>
              {hours.map((hour) => (
                <span key={hour} style={{ top: (hour - startHour) * 88 }}>
                  {format(new Date(2026, 0, 1, hour), "h a")}
                </span>
              ))}
            </div>
            {days.map((day, dayIndex) => (
              <div
                key={isoDay(day)}
                className={cn(
                  "calendar-day",
                  isSameDay(day, DEMO_NOW) && "today",
                  range &&
                    (endOfDay(day) < range[0] || day > range[1]) &&
                    "outside-scope",
                )}
                style={{ height }}
                aria-label={format(day, "EEEE, MMMM d")}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="hour-line"
                    style={{ top: (hour - startHour) * 88 }}
                  />
                ))}
                {overlappingGroups(
                  placements[dayIndex].map((item) => item.event),
                )
                  .filter((group) => group.length > 1)
                  .map((group) => {
                    const items = placements[dayIndex].filter((item) =>
                      group.some((event) => event.id === item.event.id),
                    );
                    const begins = Math.min(...items.map((item) => item.start));
                    const ends = Math.max(...items.map((item) => item.end));
                    const lanes = Math.max(...items.map((item) => item.lanes));
                    const lastEnd = group.reduce(
                      (last, event) => (event.end > last ? event.end : last),
                      group[0].end,
                    );
                    return (
                      <div
                        key={group[0].id}
                        className={cn(
                          "calendar-cluster",
                          lanes > 2 ? "many" : "pair",
                        )}
                        style={{
                          top: (begins - startHour) * 88 + 2,
                          height: (ends - begins) * 88 - 4,
                        }}
                      >
                        <DayEvents
                          day={day}
                          events={group}
                          onOpen={onOpen}
                          triggerClassName="calendar-cluster-trigger"
                          triggerLabel={`View ${group.length} events at overlapping times on ${format(day, "EEEE, MMMM d")}`}
                        >
                          <span className="cluster-time">
                            {timeRange({ ...group[0], end: lastEnd })}
                          </span>
                          <strong>{group.length} events</strong>
                          <span className="cluster-branches">
                            {new Set(group.map((event) => event.branchId)).size}{" "}
                            {new Set(group.map((event) => event.branchId))
                              .size === 1
                              ? "branch"
                              : "branches"}
                          </span>
                          <span className="cluster-summaries">
                            {group.map((event) => (
                              <span key={event.id}>
                                <b>{event.title}</b>
                                <small>
                                  {branchById[event.branchId].name} ·{" "}
                                  {event.status}
                                </small>
                              </span>
                            ))}
                          </span>
                        </DayEvents>
                      </div>
                    );
                  })}
                {placements[dayIndex].map(
                  ({ event, start: begins, end: ends, lane, lanes }) => (
                    <a
                      key={event.id}
                      data-event-id={event.id}
                      title={`${event.title} · ${branchById[event.branchId].name} · ${timeRange(event)}`}
                      className={cn(
                        "calendar-event",
                        lanes > 2
                          ? "overlap-many"
                          : lanes > 1 && "overlap-pair",
                        typeStyles[event.type].className,
                        event.status === "Cancelled" && "cancelled",
                      )}
                      href={`#event/${event.id}`}
                      onClick={() => onOpen(event.id)}
                      style={{
                        top: (begins - startHour) * 88 + 2,
                        height: Math.max(40, (ends - begins) * 88 - 4),
                        left: `calc(${(lane / lanes) * 100}% + 4px)`,
                        width: `calc(${100 / lanes}% - 8px)`,
                      }}
                      aria-label={`${event.title}, ${branchById[event.branchId].name}, ${format(day, "EEEE MMMM d")}, ${timeRange(event)}, ${event.status}${timingLabel(event) ? `, ${timingLabel(event)}` : ""}`}
                    >
                      <CalendarCardContent event={event} />
                    </a>
                  ),
                )}
                {isSameDay(day, DEMO_NOW) && (
                  <div
                    className="now-line"
                    style={{ top: (10.5 - startHour) * 88 }}
                    aria-label="Current review time: 10:30 AM"
                  >
                    <span />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="calendar-legend">
        {Object.entries(typeStyles).map(([name, value]) => (
          <span key={name}>
            <i className={value.className} aria-hidden="true" />
            {name}
          </span>
        ))}
        <span className="calendar-timezone">
          All times Eastern · Week starts Monday
        </span>
      </div>
    </div>
  );
}
