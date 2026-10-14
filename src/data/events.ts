import { addDays, format, set } from "date-fns";
import type { EventType, LibraryEvent } from "../types/event";

// Mock library wall-clock times. The review clock is deliberately fixed so the
// same events demonstrate "now", upcoming, and history on any review date.
export const DEMO_NOW = new Date(2026, 9, 6, 10, 30);
export const DEMO_TIME_LABEL = "Oct 6, 2026 · 10:30 AM Eastern";
export const branches = [
  {
    id: "central",
    name: "Central Library",
    short: "Central",
    color: "#37725b",
  },
  { id: "riverside", name: "Riverside", short: "Riverside", color: "#607ca5" },
  { id: "maplewood", name: "Maplewood", short: "Maplewood", color: "#a27a50" },
  { id: "northgate", name: "Northgate", short: "Northgate", color: "#8970a0" },
  { id: "oak-park", name: "Oak Park", short: "Oak Park", color: "#738454" },
  { id: "hillcrest", name: "Hillcrest", short: "Hillcrest", color: "#a26770" },
  { id: "eastside", name: "Eastside", short: "Eastside", color: "#488087" },
  { id: "west-end", name: "West End", short: "West End", color: "#7c7097" },
  {
    id: "brookfield",
    name: "Brookfield",
    short: "Brookfield",
    color: "#938056",
  },
  { id: "lakeside", name: "Lakeside", short: "Lakeside", color: "#60849c" },
  {
    id: "cedar-grove",
    name: "Cedar Grove",
    short: "Cedar Grove",
    color: "#648267",
  },
  { id: "southbank", name: "Southbank", short: "Southbank", color: "#a26d53" },
];
export const branchById = Object.fromEntries(
  branches.map((branch) => [branch.id, branch]),
);

const templates: { title: string; type: EventType; description: string }[] = [
  {
    title: "Little readers, big adventures",
    type: "Story hour",
    description:
      "Stories, songs, and a little imagination for children ages 3–5 and their caregivers. A welcoming introduction to the joy of reading.",
  },
  {
    title: "Getting started with watercolors",
    type: "Workshop",
    description:
      "Explore color, brushwork, and simple watercolor techniques in a relaxed, hands-on session. Materials are provided.",
  },
  {
    title: "An evening with Maya Chen",
    type: "Author talk",
    description:
      "Local author Maya Chen discusses her new collection, The Places We Call Home, followed by a conversation with readers.",
  },
  {
    title: "Neighborhood voices",
    type: "Community meeting",
    description:
      "An open conversation for neighbors to share ideas and connect around community projects.",
  },
  {
    title: "Tech help: your digital essentials",
    type: "Workshop",
    description:
      "A friendly introduction to email, online forms, and everyday digital tools. Bring a device or use a library computer.",
  },
  {
    title: "Saturday stories & songs",
    type: "Story hour",
    description:
      "A lively morning of picture books, music, and movement for young children and their families.",
  },
  {
    title: "The art of everyday writing",
    type: "Workshop",
    description:
      "Try short writing exercises and learn ways to build a creative writing habit. Open to new and experienced writers.",
  },
  {
    title: "Meet the author: James Porter",
    type: "Author talk",
    description:
      "Join historian James Porter for a discussion of local stories, archival discoveries, and his latest book.",
  },
  {
    title: "Friends of the library",
    type: "Community meeting",
    description:
      "The monthly gathering of library supporters, sharing plans for volunteer activities and upcoming community programs.",
  },
  {
    title: "Build something brilliant",
    type: "Workshop",
    description:
      "A hands-on building session for curious young makers. Explore design and problem-solving using everyday materials.",
  },
  {
    title: "Bilingual storytime",
    type: "Story hour",
    description:
      "Enjoy stories and songs in English and Spanish. All families are welcome, whether learning a new language or celebrating a familiar one.",
  },
  {
    title: "Poetry in the neighborhood",
    type: "Author talk",
    description:
      "Local poets share new work and discuss how community and place shape their writing.",
  },
  {
    title: "Seed swap & garden circle",
    type: "Community meeting",
    description:
      "Meet fellow gardeners, exchange seeds, and share practical ideas for growing in small spaces.",
  },
  {
    title: "Make your first zine",
    type: "Workshop",
    description:
      "Fold, draw, and write your own small publication in this welcoming introduction to zine-making.",
  },
  {
    title: "Bedtime books & blankets",
    type: "Story hour",
    description:
      "Wind down with gentle stories and songs. Children are welcome to bring a favorite blanket or stuffed animal.",
  },
  {
    title: "Community reading circle",
    type: "Community meeting",
    description:
      "Bring your current read and join neighbors for a relaxed conversation about books and ideas.",
  },
];

// Fictional staff and annotations for evaluating the local prototype.
const staff = [
  "Emma Wilson",
  "James Carter",
  "Sofia Garcia",
  "Noah Brooks",
  "Olivia Reed",
  "Liam Foster",
];
const noteByType: Record<EventType, string> = {
  Workshop:
    "Materials are provided; participants may also bring their own supplies.",
  "Story hour": "Caregivers are welcome to stay for the session.",
  "Author talk": "Audience questions follow the reading.",
  "Community meeting": "Seating is arranged in a circle.",
};

function makeEvent(
  id: string,
  template: number,
  branch: number,
  day: string,
  hour: number,
  minute = 0,
  duration = 60,
  status: LibraryEvent["status"] = "Scheduled",
): LibraryEvent {
  const start = new Date(`${day}T00:00:00`);
  const begins = set(start, { hours: hour, minutes: minute });
  const ends = new Date(begins.getTime() + duration * 60_000);
  return {
    id,
    ...templates[template],
    branchId: branches[branch].id,
    start: format(begins, "yyyy-MM-dd'T'HH:mm:ss"),
    end: format(ends, "yyyy-MM-dd'T'HH:mm:ss"),
    status,
    createdBy: staff[branch % staff.length],
    notes:
      (branch + template) % 3 === 0
        ? []
        : [
            {
              id: `${id}-note-1`,
              body: noteByType[templates[template].type],
              author: staff[branch % staff.length],
              createdAt: format(addDays(begins, -10), "yyyy-MM-dd'T'HH:mm:ss"),
            },
            ...(template % 4 === 1
              ? [
                  {
                    id: `${id}-note-2`,
                    body: "Use the learning studio tables for this session.",
                    author: staff[(branch + 1) % staff.length],
                    createdAt: format(
                      addDays(begins, -7),
                      "yyyy-MM-dd'T'HH:mm:ss",
                    ),
                  },
                ]
              : []),
          ],
    room:
      template % 4 === 0
        ? "Children’s room"
        : template % 4 === 1
          ? "Learning studio"
          : "Community room",
  };
}

const thisWeek: LibraryEvent[] = [
  makeEvent("little-readers-central", 0, 0, "2026-10-06", 10, 0, 60),
  makeEvent("watercolors-riverside", 1, 1, "2026-10-06", 10, 0, 90),
  makeEvent("digital-essentials", 4, 3, "2026-10-06", 14, 0, 90),
  makeEvent("maya-chen", 2, 0, "2026-10-06", 18, 0, 90),
  makeEvent("garden-circle", 12, 4, "2026-10-07", 10, 0, 60),
  makeEvent("bilingual-maplewood", 10, 2, "2026-10-07", 10, 0, 60),
  makeEvent("makers-hillcrest", 9, 5, "2026-10-07", 10, 30, 90),
  makeEvent("writing-central", 6, 0, "2026-10-07", 14, 0, 90),
  makeEvent("neighbors-eastside", 3, 6, "2026-10-07", 18, 0, 60),
  makeEvent("little-readers-lakeside", 0, 9, "2026-10-08", 10, 0, 60),
  makeEvent("zine-west-end", 13, 7, "2026-10-08", 15, 0, 90),
  makeEvent("porter-brookfield", 7, 8, "2026-10-08", 18, 0, 90),
  makeEvent("reading-cedar", 15, 10, "2026-10-09", 11, 0, 60),
  makeEvent(
    "watercolors-southbank",
    1,
    11,
    "2026-10-09",
    14,
    0,
    120,
    "Draft",
  ),
  makeEvent("poetry-riverside", 11, 1, "2026-10-09", 18, 0, 90),
  makeEvent("saturday-central", 5, 0, "2026-10-10", 10, 0, 60),
  makeEvent("saturday-northgate", 5, 3, "2026-10-10", 10, 0, 60),
  makeEvent("zine-maplewood", 13, 2, "2026-10-10", 13, 0, 90),
  makeEvent("friends-central", 8, 0, "2026-10-11", 14, 0, 60),
  makeEvent("monday-stories", 0, 4, "2026-10-05", 10, 0, 60, "Completed"),
  makeEvent("monday-tech", 4, 6, "2026-10-05", 14, 0, 90, "Completed"),
  makeEvent("cancelled-writing", 6, 7, "2026-10-08", 14, 0, 90, "Cancelled"),
];

const restOfYear: LibraryEvent[] = [];
for (let day = 0; day < 365; day += 1) {
  const date = addDays(new Date(2026, 0, 1), day);
  const iso = format(date, "yyyy-MM-dd");
  if (iso >= "2026-10-05" && iso <= "2026-10-11") continue;
  if (day % 3 === 0) continue;
  const status =
    day % 19 === 0
      ? "Cancelled"
      : date < DEMO_NOW
        ? "Completed"
        : day % 7 === 0
          ? "Draft"
          : "Scheduled";
  restOfYear.push(
    makeEvent(
      `event-${day}`,
      day % templates.length,
      (day * 5) % branches.length,
      iso,
      [10, 14, 16, 18][day % 4],
      0,
      [60, 90, 120][day % 3],
      status,
    ),
  );
  if (day % 5 === 0)
    restOfYear.push(
      makeEvent(
        `event-${day}-b`,
        (day + 3) % templates.length,
        (day + 2) % branches.length,
        iso,
        11,
        0,
        60,
        status,
      ),
    );
}
export const events = [...thisWeek, ...restOfYear];
