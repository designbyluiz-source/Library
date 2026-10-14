import { useState } from "react";
import {
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { branches } from "../data/events";
import type { BrowseState, DateScope } from "../types/event";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "../lib/utils";

export function BranchSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(selected);
  const all = selected.length === branches.length;
  const label = all
    ? "All branches"
    : selected.length === 1
      ? branches.find((b) => b.id === selected[0])!.name
      : `${selected.length} branches`;
  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) setDraft(selected);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" className="branch-trigger" aria-label={`Branch scope: ${label}`}>
          <Building2 size={17} aria-hidden="true" />
          <span>
            <span>{label}</span>
          </span>
          <ChevronDown size={15} aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="branch-popover"
        aria-label="Choose branches"
      >
        <div className="popover-heading">
          <h2>Choose branches</h2>
          <span>{draft.length} selected</span>
        </div>
        <p className="popover-description">Select one or more branches.</p>
        <label className="check-row all-check">
          <input
            type="checkbox"
            checked={draft.length === branches.length}
            onChange={(e) =>
              setDraft(e.target.checked ? branches.map((b) => b.id) : [])
            }
          />
          All branches
        </label>
        <div className="branch-options">
          {branches.map((b) => (
            <label className="check-row" key={b.id}>
              <input
                type="checkbox"
                checked={draft.includes(b.id)}
                onChange={(e) =>
                  setDraft(
                    e.target.checked
                      ? [...draft, b.id]
                      : draft.filter((id) => id !== b.id),
                  )
                }
              />
              <span
                className="branch-dot"
                style={{ backgroundColor: b.color }}
              />
              {b.name}
            </label>
          ))}
        </div>
        <div className="popover-actions">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!draft.length}
            onClick={() => {
              onChange(draft);
              setOpen(false);
            }}
          >
            Apply selection
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function MultiFilter<T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: readonly T[];
  selected: T[];
  onChange: (values: T[]) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("filter-trigger", selected.length > 0 && "has-filter")}
        >
          <SlidersHorizontal size={14} aria-hidden="true" />
          {label}
          {selected.length > 0 && (
            <span className="filter-count">{selected.length}</span>
          )}
          <ChevronDown size={13} aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        aria-label={`Filter by ${label.toLowerCase()}`}
        className="filter-popover"
      >
        <div className="popover-heading">
          <h2>{label}</h2>
          <button
            className="text-button"
            onClick={() => onChange([])}
            disabled={!selected.length}
          >
            Clear
          </button>
        </div>
        {options.map((option) => (
          <label className="check-row" key={option}>
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={(e) =>
                onChange(
                  e.target.checked
                    ? [...selected, option]
                    : selected.filter((v) => v !== option),
                )
              }
            />
            {option}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function DateControls({
  state,
  onChange,
}: {
  state: BrowseState;
  onChange: (scope: DateScope, from?: string, to?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(state.from);
  const [to, setTo] = useState(state.to);
  const invalid = !from || !to || from > to;
  return (
    <div className="date-controls" role="group" aria-label="Event date scope">
      {(
        [
          { id: "week", label: "This week" },
          { id: "month", label: "This month" },
          { id: "all", label: "All dates" },
        ] as const
      ).map((item) => (
        <button
          key={item.id}
          className={cn("date-tab", state.scope === item.id && "active")}
          aria-pressed={state.scope === item.id}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
      <span className="date-divider" />
      <Popover
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (v) {
            setFrom(state.from);
            setTo(state.to);
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            className={cn(
              "date-tab custom-date",
              state.scope === "custom" && "active",
            )}
            aria-pressed={state.scope === "custom"}
          >
            <CalendarDays size={15} aria-hidden="true" />
            Custom range
            <ChevronDown size={13} aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          aria-label="Choose a custom date range"
          className="date-popover"
        >
          <div className="popover-heading">
            <h2>Custom date range</h2>
          </div>
          <p className="popover-description">Include events on both dates.</p>
          <label className="date-field">
            From
            <input
              type="date"
              value={from}
              onInput={(e) => setFrom(e.currentTarget.value)}
              onChange={(e) => setFrom(e.target.value)}
            />
          </label>
          <label className="date-field">
            To
            <input
              type="date"
              value={to}
              min={from}
              onInput={(e) => setTo(e.currentTarget.value)}
              onChange={(e) => setTo(e.target.value)}
            />
          </label>
          {from && to && from > to && (
            <p className="form-error" role="alert">
              End date must be on or after the start date.
            </p>
          )}
          <div className="popover-actions">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={invalid}
              onClick={() => {
                onChange("custom", from, to);
                setOpen(false);
              }}
            >
              <Check size={15} aria-hidden="true" />
              Apply range
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      className="filter-chip"
      onClick={onRemove}
      aria-label={`Remove ${label} filter`}
    >
      {label}
      <X size={12} aria-hidden="true" />
    </button>
  );
}
