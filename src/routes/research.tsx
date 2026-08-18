import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Download, Eraser } from "lucide-react";
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
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | Workmate AI" },
      {
        name: "description",
        content:
          "Ask a research question and get key insights, a concise summary and follow-up recommendations.",
      },
      { property: "og:title", content: "AI Research Assistant | Workmate AI" },
      {
        property: "og:description",
        content: "Insights, summary and next steps for any work topic.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const mutation = useMutation({ mutationFn: () => fn({ data: { topic } }) });
  const result = mutation.data;
  const valid = topic.trim().length >= 3;

  const fullText = result
    ? [
        `TOPIC: ${topic}`,
        `\nKEY INSIGHTS\n${result.insights.map((i) => `- ${i}`).join("\n")}`,
        `\nSUMMARY\n${result.summary}`,
        `\nRECOMMENDATIONS\n${result.recommendations.map((r) => `- ${r}`).join("\n")}`,
      ].join("\n")
    : "";

  const download = () => {
    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `research-${topic.slice(0, 30).replace(/\W+/g, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <PageHeader
        title="AI Research Assistant"
        description="Ask a question or name a topic — get the insights that matter and what to do next."
      />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle className="font-display text-base">Research topic</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) mutation.mutate();
            }}
          >
            <div className="flex-1 space-y-2">
              <Label htmlFor="topic">Topic or question *</Label>
              <Input
                id="topic"
                required
                maxLength={300}
                placeholder="AI adoption in mid-size professional services firms"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={!valid || mutation.isPending}>
                {mutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                Research
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setTopic("");
                  mutation.reset();
                }}
              >
                <Eraser className="size-4" aria-hidden /> Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 max-w-3xl space-y-4">
        {mutation.isError ? (
          <ErrorState message="We couldn't research that topic. Try again in a moment." />
        ) : mutation.isPending ? (
          <EmptyState>Gathering insights…</EmptyState>
        ) : !result ? (
          <EmptyState>Insights, summary and recommendations will appear here.</EmptyState>
        ) : (
          <>
            <div className="flex flex-wrap justify-end gap-2">
              <CopyButton value={fullText} label="Copy all" />
              <Button type="button" variant="outline" size="sm" onClick={download}>
                <Download className="size-3.5" aria-hidden /> Export .txt
              </Button>
            </div>

            <Card>
              <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
                <CardTitle className="font-display text-base">Key insights</CardTitle>
                <CopyButton value={result.insights.join("\n")} />
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-sm">
                  {result.insights.map((i, idx) => (
                    <li key={idx}>{i}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">Summary</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed">{result.summary}</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-display text-base">Recommended next steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal space-y-2 pl-5 text-sm">
                  {result.recommendations.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <AiDisclaimer />
          </>
        )}
      </div>
    </AppShell>
  );
}
