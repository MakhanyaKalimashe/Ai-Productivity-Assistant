import type { ReactNode } from "react";
import { Copy, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <header className="mb-6 max-w-2xl">
      <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>
    </header>
  );
}

export function AiDisclaimer() {
  return (
    <p className="mt-4 flex items-start gap-2 rounded-lg border border-border bg-muted/60 p-3 text-xs text-muted-foreground">
      <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
      AI-generated content in demo mode using simulated responses. Always review before
      sending or acting on it.
    </p>
  );
}

export function copyText(text: string, label = "Copied to clipboard") {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success(label))
    .catch(() => toast.error("Couldn't copy — check browser permissions"));
}

export function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => copyText(value)}
      aria-label={label}
    >
      <Copy className="size-3.5" aria-hidden />
      {label}
    </Button>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
    >
      {message}
    </div>
  );
}
