import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Eraser } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { summarizeMeeting } from "@/lib/ai.functions";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | Workmate AI" },
      {
        name: "description",
        content:
          "Paste raw meeting notes and get a summary, key decisions, owned action items and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | Workmate AI" },
      {
        property: "og:description",
        content: "Turn messy notes into decisions, actions and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const fn = useServerFn(summarizeMeeting);
  const [notes, setNotes] = useState("");
  const mutation = useMutation({ mutationFn: () => fn({ data: { notes } }) });
  const result = mutation.data;
  const valid = notes.trim().length >= 20;

  const fullText = result
    ? [
        `SUMMARY\n${result.summary}`,
        `DECISIONS\n${result.decisions.map((d) => `- ${d}`).join("\n") || "- none"}`,
        `ACTION ITEMS\n${
          result.actionItems.map((a) => `- ${a.task} (${a.owner})`).join("\n") || "- none"
        }`,
        `DEADLINES\n${
          result.deadlines.map((d) => `- ${d.item} → ${d.due}`).join("\n") || "- none"
        }`,
      ].join("\n\n")
    : "";

  return (
    <AppShell>
      <PageHeader
        title="Meeting Notes Summarizer"
        description="Paste your raw notes — get a clean summary, the decisions made, who owns what, and the dates that matter."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Raw notes</CardTitle>
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
                <Label htmlFor="notes">Meeting notes *</Label>
                <Textarea
                  id="notes"
                  rows={16}
                  maxLength={8000}
                  required
                  placeholder="We agreed to move launch to 12/03. Sam will prepare the pricing deck by Friday…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {notes.length}/8000 characters — minimum 20.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={!valid || mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  {mutation.isPending ? "Summarizing…" : "Summarize notes"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setNotes("");
                    mutation.reset();
                  }}
                >
                  <Eraser className="size-4" aria-hidden /> Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {mutation.isError ? (
            <ErrorState message="We couldn't summarize those notes. Try again in a moment." />
          ) : mutation.isPending ? (
            <EmptyState>Reading your notes…</EmptyState>
          ) : !result ? (
            <EmptyState>Your structured summary will appear here.</EmptyState>
          ) : (
            <>
              <div className="flex justify-end">
                <CopyButton value={fullText} label="Copy all" />
              </div>

              <Card>
                <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                  <CardTitle className="font-display text-base">Summary</CardTitle>
                  <CopyButton value={result.summary} />
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">
                  {result.summary}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                  <CardTitle className="font-display text-base">Key decisions</CardTitle>
                  <CopyButton value={result.decisions.join("\n")} />
                </CardHeader>
                <CardContent>
                  {result.decisions.length ? (
                    <ul className="list-disc space-y-1.5 pl-5 text-sm">
                      {result.decisions.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No decisions detected.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                  <CardTitle className="font-display text-base">Action items</CardTitle>
                  <CopyButton
                    value={result.actionItems.map((a) => `${a.task} (${a.owner})`).join("\n")}
                  />
                </CardHeader>
                <CardContent>
                  {result.actionItems.length ? (
                    <ul className="space-y-2 text-sm">
                      {result.actionItems.map((a, i) => (
                        <li key={i} className="flex items-start justify-between gap-3">
                          <span>{a.task}</span>
                          <Badge variant="secondary">{a.owner}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No action items detected.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                  <CardTitle className="font-display text-base">Deadlines</CardTitle>
                  <CopyButton
                    value={result.deadlines.map((d) => `${d.item} → ${d.due}`).join("\n")}
                  />
                </CardHeader>
                <CardContent>
                  {result.deadlines.length ? (
                    <ul className="space-y-2 text-sm">
                      {result.deadlines.map((d, i) => (
                        <li key={i} className="flex items-start justify-between gap-3">
                          <span>{d.item}</span>
                          <Badge>{d.due}</Badge>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No dates detected.</p>
                  )}
                </CardContent>
              </Card>

              <AiDisclaimer />
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
