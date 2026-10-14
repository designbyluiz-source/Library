# Library Events Dash — AI Design & Prototype Brief

## 1. Purpose of this document

This document is the working brief for the AI-assisted design and implementation of **Library Events Dash**.

Use it as the source of truth for the prototype phase. Read the entire document before writing code or proposing interface changes.

The workflow is intentionally sequential:

1. **Build the running prototype first.**
2. I will review, test, and iterate on that prototype.
3. **Only after the prototype is approved, reconstruct the approved solution in Figma** using the connected Figma workflow.
4. After the Figma reconstruction, I will provide a separate process/decision document. Use that document to help organize and document my decisions in Figma for easier presentation and delivery.

Do **not** jump ahead to Figma while the prototype is still being explored unless I explicitly ask you to.

---

## 2. The challenge

A regional public library system runs events across approximately **12 branches**. Events include author talks, children's story hours, workshops, community meetings, and similar programming.

The system runs several hundred events each year. At any given time, there may be dozens of events in different states: being planned, upcoming, happening soon, completed, or cancelled.

Today, coordinators work from a **single flat list containing everything ever scheduled**. This makes common tasks unnecessarily difficult.

The primary design challenge is:

> Design how an event coordinator browses, understands, filters, and navigates event work without having to scan a massive flat list.

The solution should make the most relevant work easy to discover while preserving access to historical events and supporting both branch-specific and system-wide workflows.

---

## 3. Primary users

The primary user is an **event coordinator**.

There is not enough research to define rigid personas, so treat the following as **different usage patterns and levels of system familiarity**, not separate personas.

### Branch-focused coordinators

Some coordinators primarily manage events for a single library branch.

They need to quickly understand what is happening in their branch and what requires attention.

### System-wide coordinators

Other coordinators oversee events across several branches or across the entire library system.

They need to move easily between system-wide and branch-specific views and may need to compare activity across branches.

### Different levels of product familiarity

Some users have worked with the legacy flat-list system for years and rely heavily on established habits and muscle memory.

Others are more accustomed to modern productivity tools and expect fast search, filtering, keyboard navigation, and shortcuts.

Some users may rely on screen readers or keyboard-only navigation, and some may use older shared computers at library branches.

The interface therefore needs to balance **discoverability, efficiency, accessibility, and performance**.

---

## 4. Core user problems

The solution must address these problems first.

### 4.1 Find what needs attention

Users need to quickly understand what is active, upcoming, or requires attention without scrolling through hundreds of irrelevant historical events.

The source brief specifically identifies **what needs attention this week** as an important job.

### 4.2 Change organizational scope

Users need to move naturally between:

**All branches → Selected branches → Single branch → Event**

The system should work for someone responsible for one branch as well as someone responsible for many.

### 4.3 Search and filter event work

Users need efficient ways to narrow a large dataset and find relevant events without losing context.

### 4.4 Understand events temporally

Events are inherently tied to dates and times. Users need to understand both event data and how events are distributed over time.

### 4.5 Retrieve historical events

Past or cancelled events should remain easy to find when users need to reference or reuse them.

Historical information should remain accessible without competing with current work for attention.

---

## 5. Product prioritization

Use the following hierarchy when making implementation decisions.

### CORE — must be designed and implemented in the running prototype

The primary interactive experience must support:

**Browse → Find what needs attention → Change branch scope → Search / Filter → Switch representation → Reach an event**

The prototype should demonstrate these behaviors rather than merely displaying static controls.

Core interactions include:

- Landing/browse experience
- Clear visibility of relevant/current event work
- Branch scope selection
- Search
- Useful filters
- Table view
- Calendar view
- Switching between Table and Calendar without changing the underlying dataset/context
- Selecting/reaching an event from the browse experience
- Access to past/cancelled events when relevant
- Relevant loading, empty, dense, or no-result states where they materially affect the primary experience

### SUPPORTING — implement when it strengthens the core experience without expanding scope significantly

- Easy access to historical events
- A lightweight reuse/duplicate/template affordance for a past event, if appropriate
- Keyboard efficiency for important existing actions
- Sensible multi-select/bulk behavior only where clearly useful

Supporting functionality must not distract from the primary browse/navigation problem.

### LATER / WOULD EXPLORE — wireframe or represent conceptually, but do not spend prototype scope building these deeply

- Advanced branch-comparison workflows
- Dedicated keyboard-shortcuts overview/help surface
- Contextual shortcut-learning tips
- Sophisticated bulk-action workflows
- Advanced personalization
- Complex reporting or analytics

These concepts may appear as **low-fidelity wireframes or lightweight future-state concepts** when useful. They should not become the center of the running prototype.

---

## 6. Locked design decisions

The following decisions are already made. Treat them as constraints unless I explicitly change them.

### 6.1 Table and Calendar are complementary views

The same event dataset should be available through two primary representations:

**Table | Calendar**

They solve different problems and should not be treated as redundant.

#### Table view is optimized for

- Scanning large amounts of information
- Comparing event attributes
- Status visibility
- Search and filtering
- Operational/event-management tasks
- Efficient navigation through data-heavy content

The table primarily answers:

> What events exist, and which ones require my attention?

#### Calendar view is optimized for

- Temporal distribution
- Dates and times
- Concentration of events
- Simultaneous events
- Potential overlaps
- Understanding the schedule visually

The calendar primarily answers:

> When are things happening?

Switching between Table and Calendar should preserve the user's current context whenever possible, including relevant branch scope, search, and filters.

### 6.2 Visible controls first, shortcuts second

Important actions must remain discoverable and usable through the visible interface.

Keyboard shortcuts are an **efficiency layer**, not a replacement for visible navigation.

A user should never need to know a shortcut to complete an essential task.

### 6.3 Historical events remain accessible

Past and cancelled events should not dominate the default current-work experience, but they must remain searchable and accessible for reference or reuse.

### 6.4 Figma is not the prototype source of truth during exploration

Build and iterate the running prototype first.

Only after I approve the prototype should the approved interface be reconstructed in Figma.

The Figma file is primarily useful for:

- Visual documentation
- Presentation
- Inspecting structure
- Auto Layout
- Components
- Design-system organization
- Communicating decisions

Do not spend prototype exploration time trying to keep Figma synchronized before the solution is approved.

---

## 7. Explicit assumptions

The brief intentionally leaves important details undefined. Do not present assumptions as validated user facts.

When an assumption materially influences the design, keep it identifiable as an assumption.

### Time scopes

A possible model is:

**Today → This Week → This Month → This Year**

The brief directly supports the importance of **This Week**. The other ranges are reasonable product hypotheses, not validated requirements.

Assumption:

> Coordinators may benefit from progressively broader time scopes such as Today, This Week, and later periods. Real research should validate which ranges map to their actual planning behavior.

Do not overbuild the information architecture around these exact four ranges if a simpler solution works better.

### Branch comparison

The brief supports comparing branches, but the exact comparison mechanism is unspecified.

The prototype should make multi-branch/system-wide work understandable without turning advanced comparison into a separate analytics product.

### Event data

Create realistic mock data as necessary to make the prototype believable and testable. Keep it internally consistent and representative of a regional public-library event system.

---

## 8. What this project IS

This project is:

- A focused event-management browse experience
- A data-heavy operational interface
- A navigation and information-hierarchy problem
- A system for finding current work quickly
- A way to move between system-wide and branch-specific context
- A way to search and filter events
- A way to understand event work in both tabular and temporal forms
- An accessible, keyboard-friendly interface
- A real interactive prototype suitable for usability feedback
- A deliberately scoped design exercise

---

## 9. What this project IS NOT

Do **not** expand the project into:

- A full library-management platform
- A full event-creation flow
- A complete event-editing workflow
- A detailed event-management interior/product area
- A CRM
- A ticketing platform
- A public event-discovery website
- A consumer-facing library app
- A reporting/BI product
- A complex analytics dashboard
- A full permissions/admin system
- A backend implementation
- A real authentication system
- A production database
- A comprehensive notification system
- A full design system created for its own sake

Do not invent large new product areas because they are common in event-management software.

The exercise is about **landing, browsing, navigation, hierarchy, and finding what matters**.

---

## 10. Information hierarchy principles

Prioritize information based on the user's ability to answer:

1. **What needs my attention?**
2. **What is happening in the scope I am responsible for?**
3. **How do I narrow this information?**
4. **When are these events happening?**
5. **How do I reach a specific event?**
6. **How do I retrieve something from the past?**

Avoid filling the landing experience with generic dashboard metrics simply because dashboards often contain cards and charts.

Every prominent element should have a clear operational purpose.

---

## 11. Accessibility and interaction principles

Accessibility should be part of the interaction architecture from the beginning.

Account for:

- Keyboard navigation
- Logical focus order
- Visible focus states
- Semantic HTML
- Screen-reader-friendly labels and structure
- Adequate contrast
- Legibility
- Clear status communication that does not rely on color alone
- Large enough interactive targets
- Predictable navigation
- Reasonable performance on older/shared computers

Do not interpret accessibility only as visual contrast compliance.

The product should remain understandable and operable through different navigation methods.

---

## 12. Keyboard shortcut direction

Keyboard shortcuts are relevant because some users expect them and keyboard navigation is part of the usage context.

For the running prototype, implement shortcuts only where they naturally improve an existing core action and do not create unnecessary complexity.

Potential examples may include search, filters, or switching views, but choose shortcuts carefully and avoid conflicts with browser/OS conventions.

### Future concept: shortcut overview

A dedicated keyboard-shortcuts/help view may be explored as a **low-fidelity future-state wireframe**.

The supplied Figma keyboard-shortcuts reference can inform this concept.

### Future concept: progressive shortcut discovery

The system could eventually teach shortcuts contextually after users perform an action through the visible UI.

Example concept:

> Filter — shortcut: F

The intention would be to help users gradually develop new muscle memory without interrupting their normal workflow.

Do not make this a central prototype feature. Treat it as a future exploration unless I explicitly promote it into scope.

---

## 13. Visual direction

Use the supplied reference images as **visual and interaction inspiration**, not as layouts to copy literally.

The references suggest qualities such as:

- Strong information hierarchy
- Clean data-heavy layouts
- Clear tables
- Useful calendar patterns
- Controlled density
- Professional SaaS/product-tool aesthetics
- Strong legibility
- Restrained visual decoration
- Clear selected/active states

There is no supplied brand system or existing design system for this hypothetical product.

Therefore, establish a coherent lightweight visual foundation suitable for a professional library-system operational tool.

Do not spend excessive time inventing a large brand identity.

Prefer clarity, craft, consistency, and usability over decorative branding.

---

## 14. Prototype technology stack

Build the prototype using:

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn/ui** where appropriate
- **Lucide** for icons where appropriate
- **date-fns** for date manipulation where useful
- Local TypeScript/JSON mock data

The prototype should be suitable for deployment to **Vercel** and versioning in **Git/GitHub**.

### Do not add unnecessary infrastructure

Do not introduce unless explicitly requested:

- Next.js
- Database
- Backend API
- Authentication provider
- Complex global state management
- CMS
- External event APIs
- Unnecessary dependencies

Keep the architecture intentionally small, readable, and easy to iterate with AI-assisted coding.

---

## 15. Suggested project organization

Keep the repository understandable and convention-driven. A structure similar to this is appropriate:

```text
library-events-dash/
├── docs/
│   ├── brief.md
│   ├── design-context.md
│   └── decisions.md
│
├── references/
│   ├── ...reference images
│
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── types/
│   ├── lib/
│   └── App.tsx
│
├── README.md
└── package.json
```

Adapt this if there is a clear technical reason, but keep the project easy to inspect and modify.

---

## 16. Prototype behavior requirements

This should feel like a **real prototype**, not a static mockup implemented in code.

Where a control is part of the core experience, it should generally work.

For example:

- Search should actually narrow events.
- Branch selection should actually change scope.
- Relevant filters should actually affect results.
- Table/Calendar switching should actually change representation.
- Time-related controls should affect the visible dataset if included.
- Selecting an event should demonstrate the next navigation level.
- Empty/no-results states should appear when the user's actions can realistically produce them.

Do not create fake controls that look interactive but do nothing unless they are explicitly presented as out-of-scope/future concepts.

---

## 17. Event detail boundary

Users need to be able to **reach an event**, because navigation between the browse experience and an individual event is part of the hierarchy.

However, designing the full inside of an event is outside scope.

If needed, use a lightweight destination/state that proves the navigation model without designing an entire event-management product.

Do not let event-detail design consume the exercise.

---

## 18. Low-fidelity / future-state deliverables

In addition to the primary running prototype, create lightweight wireframes/concepts for relevant future ideas where useful.

These may include:

- Keyboard shortcuts overview/help
- Contextual shortcut education
- Advanced branch comparison
- More sophisticated bulk actions

These should remain visibly lower fidelity than the approved primary experience and should not require deep implementation.

Their purpose is to communicate that the architecture can evolve, not to pretend those features have been fully validated.

---

## 19. Figma phase — DO NOT START UNTIL REQUESTED

After I review and approve the running prototype, I will explicitly tell you to begin the Figma phase.

At that point:

1. Treat the **approved prototype** as the current design source.
2. Reconstruct the relevant approved screens in Figma.
3. Use Auto Layout correctly.
4. Create reusable components where repetition justifies them.
5. Use sensible variants and component properties.
6. Maintain consistent spacing, typography, states, and tokens.
7. Include the low-fidelity/future-state concepts in an appropriate separate area.
8. Keep the Figma file organized enough for review and presentation.

Do not redesign the approved prototype during reconstruction unless you identify a genuine issue. If you identify one, flag it instead of silently changing the product decision.

---

## 20. Documentation phase — DO NOT START UNTIL REQUESTED

After the prototype and Figma work are complete, I will provide a separate process/decision document.

Only then should you help convert that material into presentation-friendly documentation inside Figma.

When doing so:

- Preserve my actual reasoning.
- Clearly distinguish facts from assumptions.
- Document important trade-offs.
- Do not invent research that did not happen.
- Do not invent metrics.
- Do not retroactively claim that a design decision was validated if it was only assumed.
- Keep the documentation concise and easy to present.

The purpose of this phase is to make my existing process easier to communicate, not to rewrite the history of the project.

---

## 21. Validation model to keep in mind

Do not conduct fictional research, but design the solution so it could be meaningfully validated later.

### Before design, with real users, I would want to understand

**Frequency × Importance × Urgency**

- Which actions happen most often?
- Which actions are most important?
- Which actions have the greatest consequence if missed or delayed?

This would help validate the landing-page hierarchy.

### After prototyping, I would test task-based navigation

Examples include asking users to:

- Find something that needs attention this week.
- View the work for a specific branch.
- Change from a branch-specific to a broader scope.
- Narrow the event list using search or filters.
- Understand when events are happening.
- Find a previous event for reference.
- Navigate to a specific event.

I would observe navigation difficulties, hesitation, unnecessary steps, discoverability issues, and accessibility/navigation problems across different levels of system familiarity.

This validation model should inform design judgment, but do not fabricate test results.

---

## 22. Working rules for AI-generated output

While working on this project:

1. **Read before generating.** Use the brief, references, and project files before proposing major changes.
2. **Respect locked decisions.** Do not repeatedly reopen decisions already marked as locked.
3. **Do not confuse assumptions with facts.**
4. **Prefer a small coherent product over a broad incomplete one.**
5. **Do not add dashboard conventions without a user/problem reason.**
6. **Keep core interactions functional.**
7. **Use references for direction, not copying.**
8. **Prioritize information hierarchy and interaction before decoration.**
9. **Maintain accessibility in implementation, not as a later visual checklist.**
10. **Avoid unnecessary technical complexity.**
11. **If a requested change conflicts with a locked decision, flag the conflict before changing it.**
12. **If something is ambiguous but non-critical, make a reasonable assumption and state it rather than blocking progress.**
13. **If something would materially change the product direction, ask before making that decision.**

---

## 23. First-phase deliverables

For the first phase, focus on delivering:

### A. Low-fidelity structure

A concise wireframe/flow showing the proposed information architecture and primary navigation.

### B. Running high-fidelity prototype

A polished, interactive implementation of the **primary browse experience**, including the core interactions defined in this document.

### C. Relevant states

Include enough realistic states to demonstrate that the solution works beyond a single ideal screenshot. Prioritize states that materially affect browsing/navigation rather than trying to cover every theoretical edge case.

### D. Lightweight future wireframes

Where useful, include low-fidelity concepts for the features explicitly categorized as **Later / Would Explore**, such as keyboard-shortcut help and progressive shortcut education.

### E. Clean implementation

Keep components, mock data, types, and UI structure understandable enough that I can inspect and iterate on them quickly.

---

## 24. Definition of success for this phase

The first phase is successful when I can open the running prototype and meaningfully evaluate:

- Whether I immediately understand what needs attention.
- Whether branch/system scope is clear.
- Whether search and filtering are useful and understandable.
- Whether Table and Calendar each provide distinct value.
- Whether I can find current and historical events without fighting the interface.
- Whether navigation to an event is understandable.
- Whether keyboard interaction and focus behavior are sensible.
- Whether the interface remains readable at realistic data density.
- Whether the solution feels coherent rather than like a collection of dashboard widgets.

Do not optimize for the number of screens produced. Optimize for the quality and testability of the primary experience.
