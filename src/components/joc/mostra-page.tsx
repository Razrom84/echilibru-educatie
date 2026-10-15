"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MostraStage } from "@/components/joc/cezar-mostra";
import { JOC_COPY } from "@/lib/joc/copy";

export function MostraPage() {
  const [replayToken, setReplayToken] = useState(0);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h1 className="font-heading text-4xl">{JOC_COPY.sampleTitle}</h1>
        <p className="text-xl leading-snug">{JOC_COPY.samplePrompt}</p>
      </header>
      <MostraStage replayToken={replayToken} />
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          className="h-12 px-5 text-base"
          onClick={() => setReplayToken((token) => token + 1)}
        >
          {JOC_COPY.again}
        </Button>
        <Link
          href="/joc"
          className="inline-flex h-12 items-center rounded-lg border border-border bg-background px-5 text-base font-medium"
        >
          {JOC_COPY.ritualBack}
        </Link>
      </div>
    </div>
  );
}
