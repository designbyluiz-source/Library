# Library Events Dash --- Design Process

## 1. Understanding the Problem Before Designing the Solution

My first step is to read the brief in full, understand the context, and
separate three things:

**What we know → What we can infer → What we still need to assume**

The exercise describes an event management environment used by
coordinators across a regional public library system with approximately
12 branches. The current experience relies on a single flat list
containing all scheduled events, making it difficult to identify what
needs attention, browse events by branch, compare activity across
branches, and return to previous events.

The goal is not to redesign the entire system. The scope is specifically
the **landing, browsing, and navigation experience across events,
branches, and the system-wide view**.

Event creation and the detailed internal experience of an individual
event are deliberately outside the scope.

------------------------------------------------------------------------

## 2. Identifying the Main Jobs to Be Done

From the brief, I identified three central needs.

### Find What Needs Attention

A coordinator should be able to enter the system and quickly understand:

-   What is happening?
-   What is coming up?
-   What needs my attention?

The brief specifically identifies finding active work that needs
attention during the current week as a pain point.

From that, I introduced a working assumption that progressively broader
time scopes may help users navigate the workload:

**Today → This Week → This Month → This Year**

**Assumption:** Coordinators may benefit from progressively broader time
scopes such as Today, This Week, and later periods. I would validate
which ranges actually map to their planning behavior.

This distinction is important: requirements coming directly from the
brief should remain separate from product assumptions that still need
validation.

### Navigate Across Organizational Levels

Some coordinators are responsible for a single branch, while others
oversee several branches or the entire system.

The experience therefore needs to support movement between different
scopes:

**All Branches → Selected Branches → Single Branch → Event**

This also creates a foundation for understanding and comparing activity
across locations.

### Return to Previous Work

Past events are not simply obsolete records.

Coordinators may need to:

-   Consult a previous event.
-   Reference how something was previously organized.
-   Return to cancelled or completed events.
-   Reuse a previous event as the basis for future work.

Historical information should remain easy to retrieve without competing
with the work that requires attention now.

------------------------------------------------------------------------

## 3. Different Usage Patterns

I do not assume two distinct personas without enough research to support
that conclusion.

Instead, the brief describes a **spectrum of familiarity and working
behaviors**.

Some coordinators have worked with the existing system for years and
rely on habits and muscle memory. Others are more accustomed to modern
software and expect fast search, filtering, and keyboard shortcuts.

Some users also rely on keyboard navigation or screen readers, and the
system may be accessed through older shared computers.

This led to two complementary interaction principles:

### Discoverability

Important actions should be visible, understandable, and usable without
prior knowledge of shortcuts or advanced behaviors.

### Efficiency

Users who want to work faster should have access to search, filters,
keyboard navigation, and shortcuts.

No essential action should depend on knowing a keyboard shortcut.

------------------------------------------------------------------------

## 4. Product Prioritization

To prevent every reasonable idea from becoming a requirement, I divided
the solution into three levels.

### Core

The primary experience must solve these tasks well:

**Browse → Find what needs attention → Change branch scope → Search /
Filter → Reach an event**

### Supporting

These capabilities strengthen the core experience:

-   Table / Calendar view switching.
-   Access to and reuse of past events.
-   Keyboard efficiency.

### Later / Would Explore

These are valid opportunities, but they should not compete with the
primary problem during this exercise:

-   Advanced branch comparison.
-   Progressive shortcut learning.
-   Sophisticated bulk actions.

This prioritization also acts as a scope-control mechanism for a
deliberately short exercise.

------------------------------------------------------------------------

## 5. Table View + Calendar View

One of the initial structural decisions is to allow two representations
of the same event dataset:

**Table \| Calendar**

I do not consider these views redundant because they answer different
questions.

### Table View

The table favors:

-   Scanning large amounts of information.
-   Search.
-   Filtering.
-   Comparing event properties.
-   Status visibility.
-   Operational actions.
-   Dense information display.

Its main question is:

**"Which events exist, and which ones need my attention?"**

### Calendar View

The calendar favors:

-   Temporal distribution.
-   Dates and times.
-   Concentration of events.
-   Simultaneous events.
-   Overlaps.
-   Understanding the schedule visually.

Its main question is:

**"When are things happening?"**

Both views represent the same underlying information while supporting
different tasks.

------------------------------------------------------------------------

## 6. Building a Conceptual Moodboard

Before searching for visual references, I extracted concepts and
interface patterns that were likely to matter to the experience.

The initial set included:

-   Dashboard
-   Table
-   Calendar
-   Search
-   Filters
-   Bulk actions
-   Branch switching
-   Keyboard shortcuts
-   Legibility
-   Accessibility
-   Data-heavy interfaces

These terms became a guide for visual research rather than a predefined
component checklist.

------------------------------------------------------------------------

## 7. Visual Reference Research

No existing brand language, product interface, or design system was
provided with the exercise.

If an established foundation existed, I would use it as the primary
visual reference. In its absence, I needed to establish an initial
direction.

I researched visual references for:

-   Dashboards.
-   Calendars.
-   Tables.
-   Data-heavy interfaces.
-   Filtering patterns.
-   Navigation structures.
-   Information hierarchy.
-   Management systems.

The references are not intended as solutions to copy. They serve as a
visual library of patterns, behaviors, hierarchy, and interaction
possibilities that can be evaluated, adapted, or rejected.

------------------------------------------------------------------------

## 8. Preparing Context for AI

I created a dedicated project called:

**Library Events Dash**

The project folder contains the materials needed to establish context
before implementation, including:

-   The original brief.
-   A Markdown document describing the design context and direction.
-   Conceptual moodboard material.
-   Visual references.
-   Constraints.
-   Decisions already made.
-   Assumptions.
-   Expected deliverables.

When AI is used to help structure any of these materials, I review the
output before incorporating it into the project.

The intention is to give the implementation process a well-defined
starting point rather than asking an AI system to interpret an
unstructured problem from scratch.

------------------------------------------------------------------------

## 9. Structuring the Implementation Prompt

The main implementation prompt is organized into clear sections.

### Challenge / Scope

Defines the problem, the primary users, and where the exercise begins
and ends.

### Key Requirements

Defines the characteristics that are indispensable for the proposed
experience.

### Locked Decisions + Constraints

Documents decisions that have already been made and should not be
reinterpreted, as well as behaviors or directions that should
deliberately remain outside the solution.

### Deliverables

Defines what should be produced, where it should be produced, and the
expected fidelity of each artifact.

This structure reduces ambiguity and keeps implementation focused on the
intended problem.

------------------------------------------------------------------------

## 10. Documentation as an Input to AI-Assisted Work

Upfront documentation is intended to reduce implementation time and
improve the quality of the first generated result.

Instead of beginning with an open-ended request, the implementation
receives:

**Problem + Context + References + Decisions + Assumptions +
Constraints + Exclusions + Deliverables**

The principle guiding this approach is:

**AI rewards organization and documentation.**

The better the problem is structured before generation, the less time
needs to be spent correcting avoidable misunderstandings later.

AI can accelerate exploration and execution, while outputs are still
reviewed, accepted, rejected, and refined through design judgment.

------------------------------------------------------------------------

## 11. Model Selection

Because the project is intentionally short but requires careful
interpretation of documentation, context, references, and constraints, I
chose a model and reasoning level intended to balance quality with
speed.

The priority is not generating the largest possible amount of interface.
It is producing a sufficiently strong first implementation so that more
time can be spent evaluating, editing, and improving it.

------------------------------------------------------------------------

## 12. Wireframe → Running Prototype

Execution begins with structure rather than visual polish.

The first stage is:

**Low-fidelity wireframe / flow**

At this stage, the focus is on:

-   Information hierarchy.
-   Navigation.
-   Organization.
-   Branch scope.
-   Time scope.
-   Search.
-   Filters.
-   Table / Calendar switching.

Once the structure is coherent, the core experience moves into a
**high-fidelity running prototype**.

The prototype should prioritize the interactions that are relevant to
the primary browse experience rather than attempting to implement the
entire product.

------------------------------------------------------------------------

## 13. Prototype Architecture

The navigable prototype is the primary interactive artifact.

The intended implementation stack is:

-   React
-   TypeScript
-   Vite
-   Tailwind CSS
-   shadcn/ui
-   Lucide
-   date-fns
-   Local mocked TypeScript / JSON data
-   Git-based version control
-   Vercel for a publicly accessible live prototype

No backend, authentication system, database, or unnecessary production
infrastructure is required for the exercise.

The goal is a lightweight application where the main decisions can be
experienced rather than inferred from static screens.

Core interactions should behave meaningfully. For example:

-   Changing branch scope should affect the displayed events.
-   Search should work.
-   Relevant filters should work.
-   Table and Calendar should represent the same underlying data.
-   Time scopes should affect what is shown when applicable.
-   Events should be reachable from the browsing experience.

------------------------------------------------------------------------

## 14. Role of Figma

Figma is not the source of truth for the interactive prototype.

The running prototype is built and iterated first.

After the prototype has been reviewed and refined, the approved
experience can be reconstructed in Figma using the connected workflow.

The Figma artifact can include:

-   Wireframes.
-   Final interface screens.
-   Auto Layout.
-   Reusable components.
-   Relevant foundations.
-   Supporting documentation.

Its main purpose in this exercise is to provide an organized visual
artifact that can support documentation, inspection, and a future
presentation if necessary.

This prevents manual Figma polish from competing with the quality of the
actual interactive prototype during the limited exercise window.

------------------------------------------------------------------------

## 15. Keyboard Shortcuts

Keyboard shortcuts support both efficiency and accessibility, but they
follow one important rule:

**A shortcut enhances an action. It never replaces its visible
interface.**

All essential actions should remain discoverable and usable through the
interface.

A keyboard shortcut overview, inspired by patterns such as Figma's
shortcut map, can be represented as a future-facing wireframe rather
than treated as a core high-fidelity screen.

A later opportunity is **progressive shortcut discovery**.

For example, after a user performs an action through the interface, the
system could unobtrusively indicate that the same action has a shortcut.

This could gradually help users develop new muscle memory without
requiring external training or interrupting their normal workflow.

For the current exercise, this remains a **Later / Would Explore**
concept.

------------------------------------------------------------------------

## 16. Research Before Building

With access to real coordinators, I would complement the supplied brief
by investigating three dimensions of their work.

### Frequency

Which actions do coordinators perform most often?

### Importance

Which actions are most important to successfully completing their work?

### Urgency

Which actions have the greatest consequence if they are not noticed or
completed quickly?

I would use:

**Frequency × Importance × Urgency**

as an input into the hierarchy of the landing experience.

Frequency alone should not determine prominence. A rare action may still
require immediate visibility if failing to notice it has significant
consequences.

------------------------------------------------------------------------

## 17. Post-Prototype Validation

After building the prototype, I would conduct task-based usability
testing.

Without explaining where each feature is located, I would ask
coordinators to complete representative tasks such as:

-   Find something that needs attention this week.
-   Navigate to a specific branch.
-   Change the branch scope.
-   Find a particular event using search or filtering.
-   Understand the same schedule through another view.
-   Find a previous event.
-   Return to the broader system view.

I would observe:

-   Navigation difficulties.
-   Time and paths taken.
-   Points of hesitation.
-   Information that is difficult to locate.
-   Actions that require unnecessary steps.
-   Opportunities revealed through user behavior.
-   Differences across levels of system familiarity.

------------------------------------------------------------------------

## 18. Accessibility as Behavior

Accessibility validation should not be limited to color contrast or
visual presentation.

The experience should remain operable and understandable across
different ways of interacting with the system.

This includes:

-   Keyboard navigation.
-   Focus order.
-   Screen reader semantics.
-   Discoverability.
-   Legibility.
-   Operation without a mouse.
-   Clear actions and labels.
-   Reasonable behavior on older hardware.

The central question is:

**Does the experience remain understandable and efficient regardless of
how the user needs or prefers to navigate it?**

------------------------------------------------------------------------

## 19. Iteration

A single round of testing does not automatically make the solution
production-ready.

The intended cycle is:

**Initial Solution → Running Prototype → Usability Validation → Findings
→ Prioritization → Iteration → Refined Solution**

Validation is not intended to prove that the initial solution was
correct.

Its purpose is to identify where assumptions were wrong, incomplete, or
insufficiently prioritized and use those findings to improve the
experience.

------------------------------------------------------------------------

## 20. Process Overview

The overall process can be summarized as:

### Understand

**Brief → Problem → Users → Known facts**

### Frame

**Jobs → Assumptions → Constraints → Scope → Priorities**

### Explore

**Moodboard → References → Patterns**

### Prepare

**Documentation → Context → Locked decisions → Exclusions →
Deliverables**

### Structure

**Information architecture → Flow → Low-fidelity wireframe**

### Build

**Running prototype → Core interactions → Relevant states**

### Inspect

**Design judgment → Accessibility → Keep / Reject / Iterate**

### Validate

**Frequency × Importance × Urgency → Usability testing → Navigation and
accessibility**

### Refine

**Findings → Prioritization → Iteration**

### Document

**Decisions → Assumptions → Trade-offs → AI usage → What was kept → What
was rejected → Why**
