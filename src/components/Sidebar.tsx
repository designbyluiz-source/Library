import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  LayoutList,
  LogOut,
  PanelLeft,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { BrowseState } from "../types/event";
import { cn } from "../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function Sidebar({
  state,
  onViewChange,
  onStartTour,
}: {
  state: BrowseState;
  onViewChange: (view: BrowseState["view"]) => void;
  onStartTour: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [expanded]);
  return (
    <>
      {expanded && (
        <button
          className="sidebar-scrim"
          aria-label="Close sidebar"
          onClick={() => setExpanded(false)}
        />
      )}
      <aside
        className={cn("sidebar", expanded && "expanded")}
        aria-label="Library workspace navigation"
      >
        <div className="sidebar-brand">
          <span className="brand-mark">
            <BookOpen size={23} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <span className="sidebar-brand-name">
            Maple County<small>LIBRARY SYSTEM</small>
          </span>
        </div>
        <button
          ref={toggleRef}
          className="sidebar-toggle"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? (
            <X size={19} aria-hidden="true" />
          ) : (
            <PanelLeft size={19} aria-hidden="true" />
          )}
        </button>
        <nav aria-label="Event views" className="sidebar-navigation">
          <p className="sidebar-section-title">WORKSPACE</p>
          <button
            className={cn(
              "sidebar-nav-item",
              state.view === "calendar" && "selected",
            )}
            aria-pressed={state.view === "calendar"}
            title="Events calendar"
            aria-label="Events calendar"
            onClick={() => {
              onViewChange("calendar");
              setExpanded(false);
            }}
          >
            <CalendarDays size={19} aria-hidden="true" />
            <span>Calendar</span>
            {state.view === "calendar" && (
              <ChevronRight
                className="nav-chevron"
                size={14}
                aria-hidden="true"
              />
            )}
          </button>
          <button
            className={cn(
              "sidebar-nav-item",
              state.view === "table" && "selected",
            )}
            aria-pressed={state.view === "table"}
            title="Events table"
            aria-label="Events table"
            onClick={() => {
              onViewChange("table");
              setExpanded(false);
            }}
          >
            <LayoutList size={19} aria-hidden="true" />
            <span>Events</span>
            {state.view === "table" && (
              <ChevronRight
                className="nav-chevron"
                size={14}
                aria-hidden="true"
              />
            )}
          </button>
        </nav>
        <div className="sidebar-account" role="group" aria-label="Account">
          <Popover open={profileOpen} onOpenChange={setProfileOpen}>
            <PopoverTrigger asChild>
              <button
                className="sidebar-account-button"
                aria-label="Profile"
                title="Profile"
              >
                <span className="sidebar-profile-icon" aria-hidden="true">
                  <UserRound size={19} />
                </span>
                <span className="sidebar-account-label">Profile</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="sidebar-account-popover"
              side="right"
              align="end"
            >
              <h2>Profile</h2>
              <p>Event coordinator</p>
              <p>Maple County Library System</p>
              <button
                className="button button-outline profile-tour-button"
                onClick={() => {
                  setProfileOpen(false);
                  setExpanded(false);
                  onStartTour();
                }}
              >
                Take a tour
              </button>
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="sidebar-account-button"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={19} aria-hidden="true" />
                <span className="sidebar-account-label">Log out</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="sidebar-account-popover"
              side="right"
              align="end"
            >
              <h2>Log out</h2>
              <p>This prototype has no active sign-in session.</p>
            </PopoverContent>
          </Popover>
        </div>
      </aside>
    </>
  );
}
