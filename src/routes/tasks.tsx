import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  AiDisclaimer,
  CopyButton,
  EmptyState,
  ErrorState,
  PageHeader,
} from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | Workmate AI" },
      {
        name: "description",
        content:
          "Turn a goal into a prioritized, time-boxed task plan with estimates and a day-by-day schedule.",
      },
      { property: "og:title", content: "AI Task Planner | Workmate AI" },
      {
        property: "og:description",
        content: "Prioritized schedules built around the hours you actually have.",
      },
    ],
  }),
  component: TasksPage,
});

const priorityVariant = {
  High: "destructive",
  Medium: "default",
  Low: "secondary",
} as const;

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [goal, setGoal] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState(4);
  const [deadline, setDeadline] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});

  const mutation = useMutation({
    mutationFn: () => fn({ data: { goal, hoursPerDay, deadline } }),
    onSuccess: () => setDone({}),
  });
  const result = mutation.data;
  const valid = goal.trim().length >= 3;

  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        description="Describe the goal and how much time you have each day. Get an ordered plan you can actually follow."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Plan inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (valid) mutation.mutate();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="goal">Goal or project *</Label>
                <Textarea
                  id="goal"
                  rows={4}
                  required
                  maxLength={500}
                  placeholder="Launch the new pricing page"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Available hours per day</Label>
                <Input
                  id="hours"
                  type="number"
                  min={1}
                  max={16}
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline (optional)</Label>
                <Input
                  id="deadline"
                  maxLength={40}
                  placeholder="Friday, 12 June"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={!valid || mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                {mutation.isPending ? "Planning…" : "Build my plan"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {mutation.isError ? (
            <ErrorState message="We couldn't build that plan. Try again in a moment." />
          ) : mutation.isPending ? (
            <EmptyState>Sequencing your tasks…</EmptyState>
          ) : !result ? (
            <EmptyState>Your prioritized plan will appear here.</EmptyState>
          ) : (
            <Card>
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="font-display text-base">
                  {result.days} day plan · {result.totalHours}h total
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => mutation.mutate()}
                  >
                    <RefreshCw className="size-3.5" aria-hidden /> Regenerate
                  </Button>
                  <CopyButton
                    value={result.tasks
                      .map((t) => `${t.day} · ${t.priority} · ${t.hours}h — ${t.title}`)
                      .join("\n")}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{result.deadlineNote}</p>
                <ul className="divide-y divide-border">
                  {result.tasks.map((t) => (
                    <li key={t.id} className="flex items-start gap-3 py-3">
                      <Checkbox
                        id={t.id}
                        checked={!!done[t.id]}
                        onCheckedChange={(c) =>
                          setDone((d) => ({ ...d, [t.id]: c === true }))
                        }
                        aria-label={`Mark ${t.title} complete`}
                      />
                      <div className="min-w-0 flex-1">
                        <Label
                          htmlFor={t.id}
                          className={
                            done[t.id]
                              ? "block text-sm line-through opacity-60"
                              : "block text-sm"
                          }
                        >
                          {t.title}
                        </Label>
                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant={priorityVariant[t.priority]}>{t.priority}</Badge>
                          <span>{t.day}</span>
                          <span>·</span>
                          <span>{t.hours}h</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <AiDisclaimer />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
