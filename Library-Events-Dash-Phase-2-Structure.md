# Library Events Dash — Phase 2 structure

Status: proposed low-fidelity structure for review. No implementation or validation has occurred.

Authority: the Agent Brief defines scope and locked decisions; the Design Process supplies supporting reasoning; the current conversation defines phase gates. This document supplements those sources without changing them.

## 1. Experience and hierarchy

One Events workspace supports all branches, selected branches, and a single branch. These are scopes of the same workspace, not separate product areas.

The hierarchy is:

1. Identify the workspace and the branches currently included.
2. See the time scope and identify what is happening now and coming up soon.
3. Narrow events through search and filters.
4. Inspect the same matching events in Table or Calendar.
5. Open a lightweight event destination and return without losing context.
6. Broaden the date scope to retrieve historical work.

No generic metric cards, separate analytics dashboard, or navigation to unbuilt product areas. A permanent sidebar is not necessary for this single-workspace scope. This is a proposal, not a locked decision.

## 2. Shared workspace shell

Proposed first visit: All branches / This week / Table, with no search or status filter. These defaults are assumptions for prototype review; there is no account or inferred home branch.

Low-fidelity layout, with illustrative values only:

```text
LIBRARY EVENTS DASH

Events                                   Branches: All branches [v]

Dates: This week [v]                      Exact start – end dates

[Search event title or description...............................]
[Status: Any v]  [Event type: Any v]
Active filters, when present: [Workshop ×]             Clear filters

N matching events                         [Table selected | Calendar]
-------------------------------------------------------------------
EVENT                 BRANCH       WHEN            STATUS / TIMING
Event title →         Branch name  Date, start–end Status text
Event type                                        Happening now / Today
-------------------------------------------------------------------
Event title →         Branch name  Date, start–end Status text
Event type
-------------------------------------------------------------------

Historical retrieval: choose All dates or a custom date range above.
```

Attention is expressed through temporal hierarchy and explicit timing labels within the results. There is no separate Needs attention filter, alert count, or readiness indicator.

Proposed current-work ordering: happening-now events first, followed by upcoming events in ascending start-time order, with earlier events in a clearly labeled group below. This makes approaching events prominent while preserving access to the entire matching set. Historical-only ranges remain chronological. Cancelled events stay accessible but do not receive happening-now or upcoming emphasis. These ordering details are proposals for prototype review.

## 3. Branch selection

One labeled control opens a multiple-selection list of the approximately 12 branches.

- All branches is an explicit option.
- Checking individual branches creates a draft selection; Apply commits it, and Cancel discards it.
- Apply requires at least one branch. An accidental empty selection must not become an unexplained empty dataset.
- The collapsed control reads All branches, the single branch name, or an explicit count such as 3 branches. Selected names remain available when reopened.
- Search, dates, filters, and representation persist when branch scope changes.
- No per-branch dashboard or comparison mode is introduced.

Keyboard behavior: the trigger opens the selector; native checkbox semantics expose selections; Escape cancels and returns focus to the trigger.

## 4. Time, history, search, and filtering

### Date scope

Proposed options: This week, This month, Custom range, and All dates. Only the importance of This week comes directly from the brief; the remaining choices are prototype assumptions. Today and This year are not required for the initial structure.

Show exact dates alongside relative labels. Custom ranges include both boundary dates. For events crossing a date boundary, inclusion follows overlap with the selected range, rather than start date alone.

Historical access uses this same control, avoiding a separate archive with different search behavior. All dates includes past and future events. Completed and cancelled records remain discoverable through status filtering.

Proposal: do not silently exclude cancelled events from a selected period. Show them with an explicit status and subdued treatment. The default current-week scope keeps the all-time history from dominating; if current-week cancellations overwhelm the interface, revisit this during prototype review.

### Search

Search narrows the current scope and matches event title and description. The label or helper text identifies that boundary. Branch and type are handled by their explicit controls.

A visible Search all dates action is offered when an active date scope may hide a sought event, including in no-results states. It changes only the date scope and preserves branch, query, and filters. Searching does not silently broaden scope.

### Filters

- Status: proposed mock categories Planning, Scheduled, Completed, Cancelled. This vocabulary is an assumption, not a confirmed lifecycle.
- Event type: categories grounded in the brief, such as author talk, story hour, workshop, and community meeting.

Branch, dates, query, and different filter categories intersect. Multiple selections within one category match any selected value. Active filters can be removed individually. Clear filters resets status and type; it does not reset branch scope, dates, or search. Search has its own clear control.

### Attention semantics: clarified by the user

The user clarified after the initial Phase 2 proposal that attention primarily means **time-based relevance**: events become more prominent as their scheduled date approaches, helping coordinators identify what is happening now and what is coming up soon. This is a design decision for the exercise, not a validated research finding.

Use scheduled dates and times to establish that relevance. Remove the initial proposal for mock operational attention reasons. Do not introduce readiness rules, alert flags, severity scores, task resolution, or inferred scheduling conflicts.

Proposed expressions are Happening now, Today, and an explicit upcoming date/time. Happening now means the current reference time falls within a non-cancelled event's scheduled start/end interval; Today follows the chosen library-system timezone. Upcoming events are ordered by proximity. An exact cutoff for a broader Soon category has not been established; avoid inventing one or requiring it for the structure.

Temporal emphasis does not broaden the selected date scope or change which events match. The calendar preserves chronological placement and communicates relevance through a current-time/day marker and readable timing labels. Historical views retain clear dates and statuses without urgency treatment.

## 5. Table representation

Proposed columns: Event, Branch, Date and time, Status / timing.

- Event title is the primary navigation link; event type is secondary text.
- Branch remains visible, including in single-branch scope, to keep the structure predictable.
- Dates and start/end times support scanning and comparison.
- Status and temporal relevance use words; color is supplementary.
- No row-selection checkboxes or bulk toolbar in the first prototype unless a useful in-scope action is established.
- Use a semantic table with header associations. Do not make every cell a keyboard stop or rely on clicking an entire row.
- On narrow screens, preserve access to every field through an appropriately labeled scroll region or a readable stacked representation; do not simply hide essential information.

## 6. Calendar representation and shared context

The calendar answers when events occur. Proposal: a weekly time grid with event duration, simultaneous events, and a clearly labeled visible week. Other calendar granularities are not required for the first prototype.

```text
Same Events header, branch scope, date scope, search, and filters

N matching events                         [Table | Calendar selected]
Visible week: exact start – end dates           [Previous] [Next]
M of N matches in this week                 [Next week with matches]
-------------------------------------------------------------------
TIME       MON       TUE       WED       THU       FRI       SAT  SUN
09:00      [Event]
           [time ]             [Event]
10:00                          [time ]
                     [Event A][Event B]
11:00                [overlapping times]
-------------------------------------------------------------------
Event cards: title, time, branch, status and temporal relevance when applicable.
```

There are two distinct concepts: the result date scope and the visible calendar week. The first filters the dataset; the second is a window into it. Label both explicitly.

- Switching Table / Calendar never changes branch, query, filters, or result date scope.
- With a bounded result range, calendar paging moves through weeks intersecting that range. Dates outside the range remain clearly outside scope.
- With All dates, calendar paging can move through historical and future weeks without removing matches from the shared result set.
- Show the visible match count as well as the full result count whenever they differ.
- A visible Next week with matches action can skip empty weeks when another matching week exists. On first opening Calendar, choose the current week if it has matches; otherwise choose the first matching week within scope. Display its exact dates.
- If there are matches elsewhere but none in the visible week, say so and offer a jump to a matching week. This is different from no results for the entire query.
- Switching back to Table shows the full matching set, not only the currently visible calendar week.
- Changing date scope resets the calendar window to a relevant week. Branch/search/filter changes preserve the window and offer a jump if its matches disappear.

This separation is a proposed solution to the All dates / finite calendar tension. Its clarity needs testing in the running prototype.

Each calendar event is a real focusable link with an accessible name containing its title, branch, date/time, and status. Reading order follows date and time. Dense days must not silently hide events; any overflow control must reveal them. No drag-and-drop scheduling or automatic conflict detection.

## 7. Reaching an event and returning

Proposal: use a lightweight event page with an explicit Back to events link. Browser Back also returns to the previous browse state.

```text
← Back to events

Event title
Event type                         Status

Branch                             Full date and start–end time
Description
Timing label, when applicable (for example, Happening now)

Prototype boundary: event creation and editing are outside this exercise.
```

Preserve branch, date scope, search, filters, selected representation, and calendar week on return. Restore focus to the opening event link and retain scroll position where practical. Do not add decorative Edit, Publish, or Create controls.

## 8. Relevant states

| State | Required behavior |
| --- | --- |
| First visit | Explicit proposed default scope; realistic current events |
| One / several / all branches | Scope label and both representations agree |
| No events in a date/branch scope | Explain the scope and offer a relevant date or branch change |
| Search/filter yields zero | Preserve the user's inputs; offer specific removal or Search all dates |
| No current or upcoming events in scope | Keep historical/cancelled matches visible when present; explain the timing and offer a relevant date-scope change |
| Calendar week empty, results elsewhere | Distinguish viewport emptiness from zero matches and offer a jump |
| Dense week / simultaneous events | Keep events readable and reachable; no inferred conflict warnings |
| Historical / cancelled result | Clearly communicate date and status; allow the same lightweight event navigation |
| Returning from an event | Restore browse context and sensible focus |

Local data does not require artificial loading delays. Add loading feedback only if an actual operation warrants it.

## 9. Accessibility and performance foundations

- Semantic header, main region, headings, form controls, table, and links.
- Visible labels, focus indicators, logical focus order, and adequate interactive targets.
- Accessible names and selected states for the representation switch and filters.
- Predictable focus handling for branch/filter popovers and event navigation.
- Concise result-count announcements after changes, avoiding an announcement on every keystroke.
- Text communicates status and temporal relevance independently of color.
- Calendar labels convey the information available visually; Table provides an additional representation without excusing inaccessible calendar controls.
- No custom arrow-key grid unless its full interaction model is implemented and checked.
- Modest dependencies and motion; straightforward local filtering for hundreds of events.
- Working assumptions to settle for mock data: one library-system timezone, a clearly stated week-start convention, and a consistent demo date so the review dataset remains useful.

## 10. Later concepts — deliberately lower fidelity

These are conceptual sketches only, separate from the core workspace and not represented by nonfunctional production-looking controls.

| Concept | Low-fidelity shape | Boundary |
| --- | --- | --- |
| Shortcut overview | Help surface with grouped action / key pairs and a close action | No dedicated help implementation now |
| Contextual shortcut learning | Small dismissible hint adjacent to an action already performed | No learning or personalization system |
| Branch comparison | Shared date/filter controls above parallel branch summaries | Comparison measures remain undefined; no analytics build |
| Bulk actions | Selection count and an action bar after selecting events | Actions require a justified operational need; no invented workflow |

The first prototype can omit historical duplication and shortcuts if they do not strengthen the core. Standard keyboard accessibility remains required.

## 11. Review boundary and proposed next step

Phase 2 delivers this proposed information architecture, low-fidelity layouts, interaction rules, and state map. It does not validate the assumptions or approve a visual direction.

Review priorities: the single Events workspace, first-visit defaults, the proposed expression of time-based relevance, historical retrieval in the same workspace, and the separation between calendar window and result date scope.

After approval to begin Phase 3, build the first coherent running prototype with the prescribed lightweight stack. Stop for review before Figma or final design documentation. This file is a working structural proposal, not a retrospective or final decision record.
