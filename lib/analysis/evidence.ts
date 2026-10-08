import type { CalculatedFacts, GitHubSnapshot, Evidence } from "@/types";
import { RULE_TABLE } from "@/config/scoring";

/**
 * Evaluates all rules against calculated facts and snapshot to generate deterministic Evidence objects.
 * Every Evidence object carries a stable ID and verifiable observed data.
 */
export function generateEvidence(
  facts: CalculatedFacts,
  snapshot: GitHubSnapshot
): Evidence[] {
  if (facts.insufficientData) {
    return [
      {
        id: "ev_insufficient_data",
        factKey: "insufficientData",
        label: "Insufficient repository data",
        observed: `Found ${facts.originalRepositories} original repositories (minimum required: 3)`,
        threshold: "Minimum 3 original non-fork repositories required for full analysis",
        source: "repository",
        repoNames: snapshot.repositories.filter((r) => !r.isFork).map((r) => r.name),
      },
    ];
  }

  const evidenceList: Evidence[] = [];

  for (const rule of RULE_TABLE) {
    if (rule.trigger(facts)) {
      const details = rule.evidenceBuilder(facts, snapshot);
      evidenceList.push({
        id: `ev_${rule.id}`,
        factKey: rule.category,
        label: details.label,
        observed: details.observed,
        threshold: details.threshold,
        source: rule.source,
        repoNames: details.repoNames.slice(0, 10),
      });
    }
  }

  return evidenceList;
}
