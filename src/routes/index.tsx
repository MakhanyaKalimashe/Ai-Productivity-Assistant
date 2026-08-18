import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, NotebookPen, ListChecks, Telescope, MessagesSquare } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workmate AI — AI Productivity Dashboard" },
      {
        name: "description",
        content:
          "Workmate AI bundles an email generator, meeting summarizer, task planner, research assistant and chatbot into one dashboard.",
      },
      { property: "og:title", content: "Workmate AI — AI Productivity Dashboard" },
      {
        property: "og:description",
        content: "Five AI work tools in one clean, responsive dashboard.",
      },
    ],
  }),
  component: Index,
});

const tools = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    body: "Draft professional, friendly or urgent emails from a few key points.",
  },
  {
    to: "/meetings",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    body: "Turn raw notes into a summary, decisions, action items and deadlines.",
  },
  {
    to: "/tasks",
    icon: ListChecks,
    title: "AI Task Planner",
    body: "Break a goal into a prioritized, time-boxed schedule you can work through.",
  },
  {
    to: "/research",
    icon: Telescope,
    title: "Research Assistant",
    body: "Get key insights, a concise summary and follow-up recommendations.",
  },
  {
    to: "/chat",
    icon: MessagesSquare,
    title: "AI Chatbot",
    body: "Ask anything about your work and iterate in a conversation thread.",
  },
] as const;

function Index() {
  return (
    <AppShell>
      <section className="overflow-hidden rounded-2xl bg-hero-gradient p-8 text-primary-foreground shadow-soft sm:p-12">
        <p className="text-xs font-medium uppercase tracking-[0.2em] opacity-80">
          Workmate AI
        </p>
        <h1 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Your AI-powered work companion
        </h1>
        <p className="mt-3 max-w-xl text-sm opacity-90 sm:text-base">
          Five focused AI tools for the writing, planning and research work that fills your
          day — all in one dashboard.
        </p>
        <Link
          to="/email"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-opacity hover:opacity-90"
        >
          Start with an email <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>

      <h2 className="mt-10 font-display text-lg font-semibold">Your tools</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, body }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-soft">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-5" aria-hidden />
                </span>
                <CardTitle className="mt-3 font-display text-base">{title}</CardTitle>
                <CardDescription>{body}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm font-medium text-primary">
                Open tool <ArrowRight className="ml-1 inline size-3.5" aria-hidden />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
