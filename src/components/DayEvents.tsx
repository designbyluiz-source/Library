import { format } from "date-fns";
import type { ReactNode } from "react";
import type { LibraryEvent } from "../types/event";
import { branchById } from "../data/events";
import { timeRange } from "../lib/events";
import { EventIcon, StatusBadge } from "./EventPresentation";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function DayEvents({
  day,
  events,
  onOpen,
  label,
  children,
  triggerClassName,
  triggerLabel,
}: {
  day: Date;
  events: LibraryEvent[];
  onOpen: (id: string) => void;
  label?: string;
  children?: ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          data-event-ids={events.map((event) => event.id).join(" ")}
          className={triggerClassName ?? "day-events-trigger"}
          aria-label={
            triggerLabel ??
            `View ${events.length} ${events.length === 1 ? "event" : "events"} on ${format(day, "EEEE, MMMM d")}`
          }
        >
          {children ??
            label ??
            `${events.length} ${events.length === 1 ? "event" : "events"}`}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="day-dialog-title">
          {format(day, "EEEE, MMMM d")}
        </DialogTitle>
        <DialogDescription className="day-dialog-description">
          {events.length} matching {events.length === 1 ? "event" : "events"} ·
          All times Eastern
        </DialogDescription>
        <div className="day-event-list">
          {[...events]
            .sort((a, b) => a.start.localeCompare(b.start))
            .map((event) => (
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
                      {timeRange(event)} · {branchById[event.branchId].name}
                    </span>
                  </span>
                  <StatusBadge status={event.status} />
                </a>
              </DialogClose>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
