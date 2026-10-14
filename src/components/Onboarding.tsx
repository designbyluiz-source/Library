import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Compass, X } from "lucide-react";
import { Button } from "./ui/button";

const steps = [
  {
    title: "Welcome to your events workspace",
    text: "Take a quick tour of the calendar, search, and filters. You can skip the tour at any time.",
    target: "",
  },
  {
    title: "Navigate between views",
    text: "Use the sidebar to open Calendar or Events. On larger screens, hover over the sidebar or focus its controls to reveal the labels. On smaller screens, use the menu button.",
    target: ".sidebar-navigation, .sidebar-toggle",
  },
  {
    title: "Choose your branches",
    text: "Select all branches, one branch, or a group. Choose your branches and use Apply to update the events shown in both views.",
    target: ".heading-actions .branch-trigger",
  },
  {
    title: "Choose a time period",
    text: "Browse this week or this month, set a custom range, or choose All dates to find past and future events.",
    target: ".scope-bar",
  },
  {
    title: "Find an event",
    text: "Search event titles and descriptions within your current branches and dates. You can also press / to focus search when no window is open.",
    target: ".search-field",
  },
  {
    title: "Narrow your results",
    text: "Filter by status and event type. Filters apply to both Calendar and Table; remove individual filters or use Clear filters to broaden the results.",
    target: ".filter-controls",
  },
  {
    title: "One set of events, two views",
    text: "Calendar shows dates, times, and overlapping events. Table makes attributes and statuses easy to scan. Switching views keeps your search, branches, and filters.",
    target: ".view-switch",
  },
  {
    title: "Explore the schedule",
    text: "In Calendar, use the arrows to move through the selected period. Expand the calendar for more space while keeping search and filters available; click the button again to return. Colors identify event types, and the line marks the current time.",
    target: ".calendar-toolbar, .view-switch",
  },
  {
    title: "Open event details",
    text: "Select an event in either view to see its time, branch, room, and description in a window. Close it or press Escape to return without losing your place.",
    target: ".calendar-scroll, .table-scroll, .empty-state",
  },
  {
    title: "You’re ready to explore",
    text: "Your profile and Log out controls are at the bottom of the sidebar. Criar novo evento is not available yet. Start by choosing your branches and time period.",
    target: ".sidebar-account, .sidebar-toggle",
  },
] as const;

type Bounds = { left: number; top: number; width: number; height: number };

export function Onboarding({
  open,
  onFinish,
}: {
  open: boolean;
  onFinish: () => void;
}) {
  const [step, setStep] = useState(0);
  const [bounds, setBounds] = useState<Bounds | null>(null);
  const [position, setPosition] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const mask = useId().replace(/:/g, "");
  const current = steps[step];

  useEffect(() => {
    if (!open) return;
    function measure() {
      const target = current.target
        ? Array.from(
            document.querySelectorAll<HTMLElement>(current.target),
          ).find((element) => {
            const r = element.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          })
        : null;
      const controls = target?.closest<HTMLElement>(".browse-controls");
      if (target && controls) {
        const targetRect = target.getBoundingClientRect();
        const viewportRect = controls.getBoundingClientRect();
        if (targetRect.top < viewportRect.top)
          controls.scrollTop += targetRect.top - viewportRect.top;
        else if (targetRect.bottom > viewportRect.bottom)
          controls.scrollTop += Math.min(
            targetRect.bottom - viewportRect.bottom,
            targetRect.top - viewportRect.top,
          );
      }
      const rect = target?.getBoundingClientRect();
      const controlRect = controls?.getBoundingClientRect();
      const width = window.innerWidth,
        height = window.innerHeight;
      const padding = 6;
      const left = Math.max(8, (rect?.left ?? 0) - padding);
      const top = Math.max(
        8,
        controlRect?.top ?? 0,
        (rect?.top ?? 0) - padding,
      );
      const right = Math.min(width - 8, (rect?.right ?? 0) + padding);
      const bottom = Math.min(
        height - 8,
        controlRect?.bottom ?? height,
        (rect?.bottom ?? 0) + padding,
      );
      const next =
        rect && right > left && bottom > top
          ? { left, top, width: right - left, height: bottom - top }
          : null;
      setBounds(next);
      const cardWidth = card.current?.offsetWidth ?? Math.min(400, width - 32);
      const cardHeight = card.current?.offsetHeight ?? 320;
      let x = (width - cardWidth) / 2,
        y = (height - cardHeight) / 2;
      if (next) {
        x = Math.max(16, Math.min(next.left, width - cardWidth - 16));
        if (next.left + next.width + cardWidth + 32 < width) {
          x = next.left + next.width + 16;
          y = next.top;
        } else if (next.top + next.height + cardHeight + 32 < height) {
          y = next.top + next.height + 16;
        } else if (next.top > cardHeight + 32) {
          y = next.top - cardHeight - 16;
        } else {
          y = height - cardHeight - 16;
        }
      }
      setPosition({
        left: Math.max(16, Math.min(x, width - cardWidth - 16)),
        top: Math.max(16, Math.min(y, height - cardHeight - 16)),
      });
    }
    measure();
    const frame = requestAnimationFrame(() => {
      measure();
      title.current?.focus({ preventScroll: true });
    });
    const observer = new ResizeObserver(measure);
    if (card.current) observer.observe(card.current);
    const main = document.getElementById("main");
    if (main) observer.observe(main);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [current, open]);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(value) => {
        if (!value) onFinish();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="onboarding-overlay">
          <svg
            className="onboarding-spotlight"
            aria-hidden="true"
            width="100%"
            height="100%"
          >
            <defs>
              <mask id={mask}>
                <rect width="100%" height="100%" fill="white" />
                {bounds && (
                  <rect
                    width={bounds.width}
                    height={bounds.height}
                    x={bounds.left}
                    y={bounds.top}
                    rx="10"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="#102b20"
              fillOpacity="0.62"
              mask={`url(#${mask})`}
            />
            {bounds && (
              <rect
                x={bounds.left}
                y={bounds.top}
                width={bounds.width}
                height={bounds.height}
                rx="10"
                fill="none"
                stroke="#c5dfad"
                strokeWidth="3"
              />
            )}
          </svg>
        </Dialog.Overlay>
        <Dialog.Content
          ref={card}
          className="onboarding-card"
          style={position ?? undefined}
          onPointerDownOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.stopPropagation()}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            document
              .getElementById("events-title")
              ?.focus({ preventScroll: true });
          }}
        >
          <div className="onboarding-topline">
            <Compass size={21} aria-hidden="true" />
            <span>
              QUICK TOUR · {step + 1} OF {steps.length}
            </span>
          </div>
          <Dialog.Close className="dialog-close" aria-label="Skip tour">
            <X size={18} aria-hidden="true" />
          </Dialog.Close>
          <div key={step} className="onboarding-copy">
            <Dialog.Title ref={title} tabIndex={-1}>
              {current.title}
            </Dialog.Title>
            <Dialog.Description>{current.text}</Dialog.Description>
          </div>
          <div className="onboarding-progress" aria-hidden="true">
            {steps.map((_, index) => (
              <span key={index} className={index <= step ? "complete" : ""} />
            ))}
          </div>
          <div className="onboarding-actions">
            <Button variant="ghost" onClick={onFinish}>
              Skip tour
            </Button>
            <div>
              {step > 0 && (
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous step"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                </Button>
              )}
              <Button
                onClick={() =>
                  step === steps.length - 1 ? onFinish() : setStep(step + 1)
                }
              >
                {step === steps.length - 1
                  ? "Start exploring"
                  : step === 0
                    ? "Show me around"
                    : "Next"}
                <ArrowRight size={17} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
