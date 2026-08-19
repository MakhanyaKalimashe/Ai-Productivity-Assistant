import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Mail,
  NotebookPen,
  ListChecks,
  Telescope,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import heroImage from "@/assets/hero-ai-hands.jpg";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "Workmate AI — Where Human Ideas Meet AI" },
      {
        name: "description",
        content:
          "Workmate AI connects your thinking with AI speed: draft emails, summarise meetings, plan tasks and research faster in one dashboard.",
      },
      { property: "og:title", content: "Workmate AI — Where Human Ideas Meet AI" },
      {
        property: "og:description",
        content: "Human insight, machine speed. Five AI work tools in one dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Mail,
    title: "Smart Email Generator",
    body: "Turn a few bullet points into a polished email in the tone you need.",
    to: "/email",
  },
  {
    icon: NotebookPen,
    title: "Meeting Summarizer",
    body: "Raw notes become decisions, action items and deadlines instantly.",
    to: "/meetings",
  },
  {
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Break any goal into a prioritized, time-boxed schedule.",
    to: "/tasks",
  },
  {
    icon: Telescope,
    title: "Research Assistant",
    body: "Key insights, concise summaries and smart follow-up questions.",
    to: "/research",
  },
  {
    icon: MessagesSquare,
    title: "AI Chatbot",
    body: "Think out loud and iterate in a conversation built for work.",
    to: "/chat",
  },
  {
    icon: Sparkles,
    title: "One Dashboard",
    body: "Every tool in a single fast, responsive workspace — no tab juggling.",
    to: "/",
  },
] as const;

const stats = [
  { value: "5", label: "AI work tools" },
  { value: "10x", label: "Faster first drafts" },
  { value: "0", label: "Setup required" },
] as const;

function Landing() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link to="/landing" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-hero-gradient text-primary-foreground">
              <Sparkles className="size-4.5" aria-hidden />
            </span>
            <span className="font-display text-base font-semibold">Workmate AI</span>
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Open app
          </Link>
        </div>
      </header>

      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="A human hand and a robotic hand reaching toward each other over a glowing blue data landscape"
          width={1920}
          height={720}
          className="absolute inset-0 size-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20"
          aria-hidden
        />
        <div className="relative mx-auto flex min-h-[34rem] max-w-6xl flex-col justify-center px-4 py-32 sm:px-6 lg:min-h-[42rem]">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
            Human + Machine
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Where your ideas meet AI speed
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Workmate AI takes the writing, planning and research that fills your day and
            hands it back finished — so you stay on the thinking only you can do.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get started free <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-accent"
            >
              See the dashboard
            </Link>
          </div>

          <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-2xl font-semibold sm:text-3xl">
                  {value}
                </dd>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{label}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
          Built for the work that never ends
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
          Five focused tools, one consistent workspace. Each one takes messy input and
          returns something you can send, ship or act on.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, body, to }) => (
            <Link
              key={title}
              to={to}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open tool
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl bg-hero-gradient p-10 text-primary-foreground shadow-soft sm:p-14">
          <h2 className="max-w-xl font-display text-2xl font-semibold sm:text-3xl">
            Start with one email. Keep the whole day.
          </h2>
          <p className="mt-3 max-w-xl text-sm opacity-90 sm:text-base">
            No setup, no accounts, no configuration. Open a tool and get a usable draft in
            seconds.
          </p>
          <Link
            to="/email"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
          >
            Try the email generator <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Workmate AI</span>
          <span>Demo mode — AI responses are simulated.</span>
        </div>
      </footer>
    </div>
  );
}
