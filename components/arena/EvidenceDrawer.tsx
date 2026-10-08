"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, AlertCircle, FileCode, CheckCircle2 } from "lucide-react";
import type { Evidence, RoastCard } from "@/types";

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  roast: RoastCard | null;
  evidenceList: Evidence[];
}

export function EvidenceDrawer({
  isOpen,
  onClose,
  roast,
  evidenceList,
}: EvidenceDrawerProps) {
  if (!roast) return null;

  // Filter evidence items corresponding to this roast card
  const linkedEvidence = evidenceList.filter((e) => roast.evidenceIds.includes(e.id));

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        {/* Backdrop overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Modal content dialog */}
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl"
          aria-describedby="evidence-description"
        >
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-bold text-foreground">
                  Why am I getting roasted?
                </Dialog.Title>
                <Dialog.Description id="evidence-description" className="text-xs text-muted-foreground">
                  Grounded findings & GitHub measurements for &ldquo;{roast.title}&rdquo;
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Close evidence drawer"
            >
              <X className="w-5 h-5" />
            </Dialog.Close>
          </div>

          {/* Evidence Cards */}
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {linkedEvidence.length > 0 ? (
              linkedEvidence.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl bg-secondary/50 border border-border/80 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Source: {ev.source}
                    </span>
                    <span className="text-xs text-primary font-medium">ID: {ev.id}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{ev.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{ev.observed}</p>
                  </div>

                  {ev.threshold && (
                    <div className="text-xs px-2.5 py-1.5 rounded-lg bg-background/80 border border-border text-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>Benchmark: {ev.threshold}</span>
                    </div>
                  )}

                  {ev.repoNames.length > 0 && (
                    <div className="pt-2 border-t border-border/60">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-primary" />
                        Relevant Repositories ({ev.repoNames.length}):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {ev.repoNames.map((repo) => (
                          <span
                            key={repo}
                            className="text-xs px-2 py-0.5 rounded bg-background border border-border text-foreground font-mono"
                          >
                            {repo}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No specific repository evidence attached to this card.
              </p>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              Got it, close evidence
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
