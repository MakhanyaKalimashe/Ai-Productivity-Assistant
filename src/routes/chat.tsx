import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Plus } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { AiDisclaimer, CopyButton, PageHeader } from "@/components/ToolPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { chatReply } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | Workmate AI" },
      {
        name: "description",
        content:
          "Chat with Workmate AI about your work — drafting, planning, prioritising and problem-solving.",
      },
      { property: "og:title", content: "AI Chatbot | Workmate AI" },
      {
        property: "og:description",
        content: "A conversational assistant for everyday work questions.",
      },
    ],
  }),
  component: ChatPage,
});

type Message = { role: "user" | "assistant"; content: string };

const starters = [
  "Help me prioritise my week",
  "How do I say no to a meeting politely?",
  "Draft an agenda for a project kickoff",
  "Summarise how to run a good retrospective",
];

function ChatPage() {
  const fn = useServerFn(chatReply);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const mutation = useMutation({
    mutationFn: (message: string) => fn({ data: { message } }),
    onSuccess: (res) =>
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]),
    onError: () =>
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Something went wrong — please try again." },
      ]),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || mutation.isPending) return;
    setMessages((m) => [...m, { role: "user", content: value }]);
    setInput("");
    mutation.mutate(value);
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title="AI Chatbot"
          description="Ask anything about your work. Workmate keeps answers short and actionable."
        />
        <div className="flex shrink-0 gap-2">
          {lastAssistant ? (
            <CopyButton value={lastAssistant.content} label="Copy last reply" />
          ) : null}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMessages([]);
              mutation.reset();
            }}
          >
            <Plus className="size-3.5" aria-hidden /> New chat
          </Button>
        </div>
      </div>

      <Card className="flex h-[62vh] max-w-3xl flex-col overflow-hidden">
        <CardContent
          className="flex-1 space-y-4 overflow-y-auto p-4"
          role="log"
          aria-live="polite"
        >
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                Start with one of these, or type your own question.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {starters.map((s) => (
                  <Button key={s} variant="secondary" size="sm" onClick={() => send(s)}>
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "flex",
                  m.role === "user" ? "justify-end" : "justify-start",
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))
          )}
          {mutation.isPending ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden /> Workmate is typing…
            </div>
          ) : null}
          <div ref={endRef} />
        </CardContent>

        <form
          className="flex items-end gap-2 border-t border-border p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <Textarea
            aria-label="Message"
            rows={2}
            maxLength={2000}
            placeholder="Ask Workmate anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            className="min-h-11 resize-none"
          />
          <Button type="submit" disabled={!input.trim() || mutation.isPending} aria-label="Send message">
            <Send className="size-4" aria-hidden />
          </Button>
        </form>
      </Card>

      <div className="max-w-3xl">
        <AiDisclaimer />
      </div>
    </AppShell>
  );
}
