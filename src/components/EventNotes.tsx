import { format, parseISO } from "date-fns";
import { MessageSquareText, X } from "lucide-react";
import type { LibraryEvent } from "../types/event";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";

export function EventNotes({ event }: { event: LibraryEvent }) {
  if (!event.notes.length)
    return (
      <span className="no-event-notes" aria-label="No notes">
        No notes
      </span>
    );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="event-notes-trigger"
          variant="ghost"
          aria-label={`View ${event.notes.length} ${event.notes.length === 1 ? "note" : "notes"} for ${event.title}`}
        >
          <MessageSquareText size={16} aria-hidden="true" />
          <span>{event.notes.length}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="event-notes-popover"
        align="end"
        aria-label={`Notes for ${event.title}`}
      >
        <div className="event-notes-heading">
          <h2>Event notes</h2>
          <PopoverClose asChild>
            <Button size="icon" variant="ghost" aria-label="Close event notes">
              <X size={18} aria-hidden="true" />
            </Button>
          </PopoverClose>
        </div>
        <p className="notes-event-title">{event.title}</p>
        <ul>
          {event.notes.map((note) => (
            <li key={note.id}>
              <p>{note.body}</p>
              <span>
                {note.author} ·{" "}
                {format(parseISO(note.createdAt), "MMM d, yyyy")}
              </span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
