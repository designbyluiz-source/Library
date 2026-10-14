import { BookOpen, Palette, Mic2, UsersRound } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { BrowseState, EventType, LibraryEvent } from "../types/event";
import { branchById } from "../data/events";
import { eventGroup, timeRange, timingLabel } from "../lib/events";
import { cn } from "../lib/utils";
import { EventNotes } from "./EventNotes";

export const typeStyles: Record<
  EventType,
  { icon: typeof BookOpen; className: string }
> = {
  "Story hour": { icon: BookOpen, className: "story" },
  Workshop: { icon: Palette, className: "workshop" },
  "Author talk": { icon: Mic2, className: "author" },
  "Community meeting": { icon: UsersRound, className: "community" },
};
export function EventIcon({
  type,
  large = false,
}: {
  type: EventType;
  large?: boolean;
}) {
  const { icon: Icon, className } = typeStyles[type];
  return (
    <span className={cn("event-icon", className, large && "large")}>
      <Icon size={large ? 26 : 18} strokeWidth={1.7} aria-hidden="true" />
    </span>
  );
}
export function StatusBadge({ status }: { status: LibraryEvent["status"] }) {
  return (
    <span className={cn("status-badge", status.toLowerCase())}>
      <span aria-hidden="true" />
      {status}
    </span>
  );
}
export function Timing({ event }: { event: LibraryEvent }) {
  const timing = timingLabel(event);
  return timing ? (
    <span className={cn("timing", timing === "Happening now" && "live")}>
      <span aria-hidden="true" />
      {timing}
    </span>
  ) : null;
}

export function EventTable({
  events,
  state,
  onOpen,
}: {
  events: LibraryEvent[];
  state: BrowseState;
  onOpen: (id: string) => void;
}) {
  return (
    <div className="table-scroll distributed-table-scroll" role="region" aria-label="Event results" tabIndex={0}>
      <table className="event-table distributed-event-table">
        <caption className="sr-only">Events matching your branch, dates, search, and filters</caption>
        <thead><tr>
          <th scope="col">Event</th><th scope="col">Branch</th>
          <th scope="col">Date &amp; time</th><th scope="col">Status</th>
          <th scope="col">Created by</th><th scope="col">Notes</th>
        </tr></thead>
        <tbody>{events.map((event) => (
          <tr key={event.id} className={cn("event-row", eventGroup(event) === "Happening now" && "is-now")}>
            <td><div className="event-title-cell"><EventIcon type={event.type} /><div>
              <a className="event-link" data-event-id={event.id} href={`#event/${event.id}`} onClick={() => onOpen(event.id)}>{event.title}</a>
              <span className="event-type">{event.type}</span>
            </div></div></td>
            <td><span className="branch-name">{branchById[event.branchId].name}</span></td>
            <td><div className="when-date">{format(parseISO(event.start), state.scope === "week" ? "EEE, MMM d" : "EEE, MMM d, yyyy")}<Timing event={event} /></div><span className="event-time">{timeRange(event)}</span></td>
            <td><StatusBadge status={event.status} /></td>
            <td className="event-creator-cell">{event.createdBy}</td>
            <td className="event-notes-cell"><EventNotes event={event} /></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}
