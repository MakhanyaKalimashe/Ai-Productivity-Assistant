import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Eraser } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | Workmate AI" },
      {
        name: "description",
        content:
          "Generate a professional, friendly or urgent email with a subject line from a few key points.",
      },
      { property: "og:title", content: "Smart Email Generator | Workmate AI" },
      {
        property: "og:description",
        content: "Draft, edit and copy work emails in seconds.",
      },
    ],
  }),
  component: EmailPage,
});

type Tone = "professional" | "friendly" | "urgent";

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<Tone>("professional");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const mutation = useMutation({
    mutationFn: () => fn({ data: { recipient, purpose, keyPoints, tone } }),
  });

  useEffect(() => {
    if (mutation.data) {
      setSubject(mutation.data.subject);
      setBody(mutation.data.body);
    }
  }, [mutation.data]);

  const valid = recipient.trim() && purpose.trim();

  return (
    <AppShell>
      <PageHeader
        title="Smart Email Generator"
        description="Give the recipient, your goal and a few key points — get a ready-to-send draft."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Email details</CardTitle>
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
                <Label htmlFor="recipient">Recipient *</Label>
                <Input
                  id="recipient"
                  required
                  maxLength={120}
                  placeholder="Maya, Head of Ops"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose / goal *</Label>
                <Input
                  id="purpose"
                  required
                  maxLength={300}
                  placeholder="rescheduling the Q3 planning workshop"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Key points</Label>
                <Textarea
                  id="points"
                  rows={5}
                  maxLength={2000}
                  placeholder={"One point per line\nthe venue changed\nwe need slides by Friday"}
                  value={keyPoints}
                  onChange={(e) => setKeyPoints(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {keyPoints.length}/2000 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={!valid || mutation.isPending}>
                  {mutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                  ) : null}
                  {mutation.isPending ? "Generating…" : "Generate email"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setRecipient("");
                    setPurpose("");
                    setKeyPoints("");
                    setSubject("");
                    setBody("");
                    mutation.reset();
                  }}
                >
                  <Eraser className="size-4" aria-hidden /> Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="font-display text-base">Draft</CardTitle>
            {body ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!valid || mutation.isPending}
                  onClick={() => mutation.mutate()}
                >
                  <RefreshCw className="size-3.5" aria-hidden /> Regenerate
                </Button>
                <CopyButton value={`Subject: ${subject}\n\n${body}`} />
              </div>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-3">
            {mutation.isError ? (
              <ErrorState message="We couldn't generate that email. Try again in a moment." />
            ) : mutation.isPending ? (
              <EmptyState>Writing your draft…</EmptyState>
            ) : body ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyText">Body</Label>
                  <Textarea
                    id="bodyText"
                    rows={16}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </div>
                <AiDisclaimer />
              </>
            ) : (
              <EmptyState>Your generated email will appear here.</EmptyState>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
