import { format, parseISO } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { branchById } from "../data/events";
import { timeRange } from "../lib/events";
import type { LibraryEvent } from "../types/event";
import { EventIcon, StatusBadge, Timing } from "./EventPresentation";
import { DialogDescription, DialogTitle } from "./ui/dialog";

export function EventDetails({ event }: { event: LibraryEvent }) {
  return (
    <>
      <div className="detail-topline">
        <EventIcon type={event.type} large />
        <StatusBadge status={event.status} />
      </div>
      <p className="eyebrow">{event.type}</p>
      <DialogTitle className="event-detail-title">{event.title}</DialogTitle>
      <div className="detail-timing">
        <Timing event={event} />
      </div>
      <div className="detail-facts">
        <div>
          <CalendarDays size={20} aria-hidden="true" />
          <span>
            <small>Date & time</small>
            <strong>
              {format(parseISO(event.start), "EEEE, MMMM d, yyyy")}
            </strong>
            <span>{timeRange(event)} · Eastern time</span>
          </span>
        </div>
        <div>
          <MapPin size={20} aria-hidden="true" />
          <span>
            <small>Location</small>
            <strong>{branchById[event.branchId].name}</strong>
            <span>{event.room}</span>
          </span>
        </div>
      </div>
      <section className="detail-description">
        <h3>About this event</h3>
        <DialogDescription>{event.description}</DialogDescription>
      </section>
    </>
  );
}
