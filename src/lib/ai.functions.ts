import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * DEMO AI LAYER
 * -------------
 * Each handler below returns a deterministic, context-aware mock response.
 * To go live, replace the mock body with a call to your LLM provider using
 * the prompt template documented above each function.
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const titleCase = (s: string) =>
  s.trim().replace(/\s+/g, " ").replace(/^./, (c) => c.toUpperCase());

const sentences = (text: string) =>
  text
    .split(/[\n.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

/* PROMPT TEMPLATE
 * "Write a {tone} email to {recipient} about {purpose}. Key points: {points}.
 *  Return a subject line and body. Keep it under 200 words." */
export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        recipient: z.string().min(1).max(120),
        purpose: z.string().min(1).max(300),
        keyPoints: z.string().max(2000).default(""),
        tone: z.enum(["professional", "friendly", "urgent"]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await delay(700);
    const points = sentences(data.keyPoints);
    const openers = {
      professional: `Dear ${data.recipient},`,
      friendly: `Hi ${data.recipient},`,
      urgent: `${data.recipient} — quick but important:`,
    } as const;
    const closers = {
      professional: "Kind regards,\nYour name",
      friendly: "Thanks so much,\nYour name",
      urgent: "Appreciate a reply today,\nYour name",
    } as const;
    const lead = {
      professional: `I'm writing regarding ${data.purpose}.`,
      friendly: `Wanted to reach out about ${data.purpose}.`,
      urgent: `We need to move on ${data.purpose} as soon as possible.`,
    } as const;

    const body = [
      openers[data.tone],
      "",
      lead[data.tone],
      "",
      points.length
        ? points.map((p) => `• ${titleCase(p)}`).join("\n")
        : "• Sharing context and next steps below.",
      "",
      data.tone === "urgent"
        ? "Could you confirm by end of day so we stay on schedule?"
        : "Let me know if you'd like to discuss any of this further.",
      "",
      closers[data.tone],
    ].join("\n");

    return {
      subject: `${titleCase(data.purpose).slice(0, 70)}${
        data.tone === "urgent" ? " — action needed" : ""
      }`,
      body,
    };
  });

/* PROMPT TEMPLATE
 * "Summarize these meeting notes. Return: summary, key decisions,
 *  action items with owners, deadlines. Notes: {notes}" */
export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ notes: z.string().min(20).max(8000) }).parse(data),
  )
  .handler(async ({ data }) => {
    await delay(700);
    const lines = sentences(data.notes);
    const decisionWords = /(decid|agree|approv|chose|will go with|confirm)/i;
    const actionWords = /(will|to do|action|follow up|send|prepare|review|owner|assign)/i;
    const dateWords =
      /(\b\d{1,2}[\/-]\d{1,2}([\/-]\d{2,4})?\b|monday|tuesday|wednesday|thursday|friday|next week|end of (day|week|month)|q[1-4]|by \w+)/i;

    const owners = ["Alex", "Priya", "Sam", "Jordan"];

    return {
      summary:
        lines.slice(0, 3).map(titleCase).join(". ") +
        (lines.length ? "." : "No substantive discussion detected."),
      decisions: lines.filter((l) => decisionWords.test(l)).slice(0, 5).map(titleCase),
      actionItems: lines
        .filter((l) => actionWords.test(l))
        .slice(0, 6)
        .map((l, i) => ({ task: titleCase(l), owner: owners[i % owners.length] })),
      deadlines: lines
        .filter((l) => dateWords.test(l))
        .slice(0, 5)
        .map((l) => ({ item: titleCase(l), due: (l.match(dateWords)?.[0] ?? "TBD").toString() })),
    };
  });

/* PROMPT TEMPLATE
 * "Break {goal} into a prioritized plan given {hoursPerDay}h/day and
 *  deadline {deadline}. Return ordered tasks with estimates and day slots." */
export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        goal: z.string().min(3).max(500),
        hoursPerDay: z.number().min(1).max(16),
        deadline: z.string().max(40).default(""),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    await delay(700);
    const stages = [
      { name: "Clarify scope and success criteria", priority: "High", hours: 1 },
      { name: "Research and gather inputs", priority: "High", hours: 2 },
      { name: "Draft the first version", priority: "High", hours: 3 },
      { name: "Review and gather feedback", priority: "Medium", hours: 2 },
      { name: "Refine and polish", priority: "Medium", hours: 2 },
      { name: "Final QA and hand-off", priority: "Low", hours: 1 },
    ];
    let cursor = 0;
    let day = 1;
    const tasks = stages.map((s, i) => {
      if (cursor + s.hours > data.hoursPerDay) {
        day += 1;
        cursor = 0;
      }
      cursor += s.hours;
      return {
        id: `t${i}`,
        title: `${s.name} — ${data.goal}`,
        priority: s.priority as "High" | "Medium" | "Low",
        hours: s.hours,
        day: `Day ${day}`,
      };
    });
    return {
      tasks,
      totalHours: stages.reduce((a, s) => a + s.hours, 0),
      days: day,
      deadlineNote: data.deadline
        ? `Plan targets your ${data.deadline} deadline with buffer on the final day.`
        : "No deadline set — schedule assumes consecutive working days.",
    };
  });

/* PROMPT TEMPLATE
 * "Research {topic}. Return 3-5 key insights, a short summary, and
 *  follow-up recommendations." */
export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ topic: z.string().min(3).max(300) }).parse(data),
  )
  .handler(async ({ data }) => {
    await delay(700);
    const t = data.topic.trim();
    return {
      insights: [
        `${titleCase(t)} is maturing quickly — adoption is being driven more by workflow fit than raw capability.`,
        `Cost and reliability are the two constraints teams cite most when evaluating ${t}.`,
        `Early adopters report the biggest gains where ${t} removes repetitive manual steps.`,
        `Governance and data handling remain the most common blockers to wider rollout of ${t}.`,
      ],
      summary: `${titleCase(t)} is best approached as an incremental capability: start with one narrow, high-frequency workflow, measure time saved, then expand. Success depends more on process design and clear ownership than on tool choice.`,
      recommendations: [
        `Run a two-week pilot of ${t} with a single team and a clear success metric.`,
        `Document data-handling rules before rollout.`,
        `Compare at least two providers on cost per outcome, not per request.`,
      ],
    };
  });

/* PROMPT TEMPLATE
 * "You are Workmate, a concise workplace productivity assistant.
 *  Answer: {message}" */
export const chatReply = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ message: z.string().min(1).max(2000) }).parse(data),
  )
  .handler(async ({ data }) => {
    await delay(600);
    const m = data.message.trim();
    return {
      reply: [
        `Here's how I'd approach "${m.slice(0, 120)}":`,
        "",
        "1. Define the outcome you want in one sentence.",
        "2. List the two or three inputs you already have.",
        "3. Draft fast, then refine — don't optimise the first pass.",
        "",
        "Want me to turn this into an email, a task plan, or a research brief?",
      ].join("\n"),
    };
  });
