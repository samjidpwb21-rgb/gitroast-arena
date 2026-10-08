"use client";

import React from "react";
import type { RoastCard, Evidence, Severity } from "@/types";
import { ROAST_CATEGORIES } from "@/config/roasts";
import { Flame, Sparkles, AlertTriangle, ShieldAlert, ExternalLink } from "lucide-react";

interface RoastDeckProps {
  roasts: RoastCard[];
  evidenceList: Evidence[];
  onOpenEvidence: (roast: RoastCard) => void;
}

const SEVERITY_STYLES: Record<
  Severity,
  { label: string; badge: string; border: string; icon: React.ElementType }
> = {
  mild: {
    label: "Mild Roast",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    icon: Sparkles,
  },
  medium: {
    label: "Medium Heat",
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    border: "border-amber-500/20 hover:border-amber-500/40",
    icon: Flame,
  },
  sharp: {
    label: "Sharp Burn",
    badge: "bg-orange-500/10 text-orange-500 border-orange-500/30",
    border: "border-orange-500/20 hover:border-orange-500/40",
    icon: AlertTriangle,
  },
  savage: {
    label: "Savage Roast",
    badge: "bg-rose-500/10 text-rose-500 border-rose-500/30",
    border: "border-rose-500/20 hover:border-rose-500/40",
    icon: ShieldAlert,
  },
};

export const RoastDeck: React.FC<RoastDeckProps> = ({ roasts, onOpenEvidence }) => {
  if (!roasts || roasts.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-2xl p-8">
        <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold text-lg text-foreground">Clean Bill of Health</h3>
        <p className="text-sm text-muted-foreground mt-1">
          No critical roasts triggered for this profile snapshot. Your repo hygiene is spotless!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6" role="region" aria-label="Roast Cards">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" />
            The Roast Deck
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Brutally honest code reviews backed by verifiable evidence extracted from your profile.
          </p>
        </div>
        <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary text-muted-foreground">
          {roasts.length} {roasts.length === 1 ? "card" : "cards"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roasts.map((card) => {
          const sev = SEVERITY_STYLES[card.severity] ?? SEVERITY_STYLES.medium;
          const SevIcon = sev.icon;
          const catMeta = ROAST_CATEGORIES[card.category];
          const categoryTitle = catMeta?.name ?? card.category.replace(/_/g, " ");

          return (
            <div
              key={card.id}
              className={`bg-card/70 backdrop-blur-sm border rounded-xl p-5 flex flex-col justify-between gap-4 transition-all shadow-sm ${sev.border}`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${sev.badge}`}
                  >
                    <SevIcon className="w-3 h-3" />
                    {sev.label}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground font-mono">
                    {categoryTitle}
                  </span>
                </div>

                {card.source === "ai" && (
                  <span className="text-[10px] font-mono text-primary bg-primary/10 px-1.5 py-0.5 rounded uppercase font-semibold">
                    AI Enhanced
                  </span>
                )}
              </div>

              {/* Roast Body */}
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-1">{card.title}</h3>
                <blockquote className="text-foreground/90 font-medium text-base sm:text-lg leading-snug italic border-l-2 border-primary/40 pl-3.5 my-1">
                  &ldquo;{card.text}&rdquo;
                </blockquote>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Rule: {card.category}
                </span>

                <button
                  onClick={() => onOpenEvidence(card)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors py-1 px-2 rounded-lg hover:bg-primary/10"
                  aria-label={`View evidence for ${categoryTitle}`}
                >
                  Why am I roasted?
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
