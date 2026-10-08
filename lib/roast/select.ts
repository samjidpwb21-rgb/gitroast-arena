import type {
  CalculatedFacts,
  GitHubSnapshot,
  Evidence,
  RoastCard,
  RoastLevel,
} from "@/types";
import { RoastCardSchema } from "@/types";
import { ROAST_TEMPLATE_BANK } from "./templates";
import { ROAST_CATEGORIES } from "@/config/roasts";
import { SeededRNG, createRoastSeed } from "./rng";

export interface SelectRoastsOptions {
  facts: CalculatedFacts;
  snapshot: GitHubSnapshot;
  evidence: Evidence[];
  roastLevel: RoastLevel;
  maxCards?: number;
}

function injectPlaceholders(
  template: string,
  facts: CalculatedFacts,
  snapshot: GitHubSnapshot,
  evidenceItem?: Evidence
): string {
  const sampleRepo =
    evidenceItem?.repoNames[0] ||
    snapshot.repositories.find((r) => r.isFlagship)?.name ||
    snapshot.repositories[0]?.name ||
    "your project";

  const topLang =
    snapshot.repositories.find((r) => r.primaryLanguage)?.primaryLanguage || "code";

  return template
    .replace(/{inactiveCount}/g, facts.inactiveRepositories.toString())
    .replace(/{origCount}/g, facts.originalRepositories.toString())
    .replace(/{inactivePercent}/g, Math.round(facts.inactiveRatio * 100).toString())
    .replace(/{weakDocCount}/g, facts.flagshipWeakReadmes.toString())
    .replace(/{missingDemoCount}/g, facts.flagshipMissingDemo.toString())
    .replace(/{forkCount}/g, facts.forkedRepositories.toString())
    .replace(/{forkRatio}/g, Math.round(facts.forkRatio * 100).toString())
    .replace(/{noisePercent}/g, Math.round(facts.portfolioNoiseRatio * 100).toString())
    .replace(/{noDescCount}/g, facts.reposWithoutDescription.toString())
    .replace(/{noTopicCount}/g, facts.flagshipMissingTopics.toString())
    .replace(/{topLang}/g, topLang)
    .replace(/{sharePct}/g, Math.round(facts.topLanguageShare * 100).toString())
    .replace(/{noLicenseCount}/g, facts.flagshipMissingLicense.toString())
    .replace(/{noScreenshotCount}/g, facts.flagshipMissingScreenshots.toString())
    .replace(/{daysAgo}/g, (facts.lastPushDaysAgo ?? 180).toString())
    .replace(/{recentCount}/g, facts.recentPushCount90d.toString())
    .replace(/{flagshipCount}/g, facts.flagshipCount.toString())
    .replace(/{sampleRepo}/g, sampleRepo);
}

/**
 * Deterministically selects and formats evidence-grounded roast cards.
 */
export function selectRoastCards(options: SelectRoastsOptions): RoastCard[] {
  const { facts, snapshot, evidence, roastLevel, maxCards = 6 } = options;

  if (facts.insufficientData || evidence.length === 0) {
    return [
      {
        id: "roast_insufficient_data",
        category: "inactiveRepositories",
        title: "Not Enough Ammunition",
        text: `Found only ${facts.originalRepositories} original repositories. We need at least 3 active projects before the arena can properly evaluate your portfolio.`,
        severity: "mild",
        evidenceIds: ["ev_insufficient_data"],
        source: "template",
      },
    ];
  }

  // Generate deterministic seed for this user, date bucket, and roast level
  const seed = createRoastSeed(snapshot.profile.login, snapshot.fetchedAt, roastLevel);
  const rng = new SeededRNG(seed);

  // Group evidence by category
  const evidenceByCategory = new Map<string, Evidence[]>();
  for (const ev of evidence) {
    const list = evidenceByCategory.get(ev.factKey) ?? [];
    list.push(ev);
    evidenceByCategory.set(ev.factKey, list);
  }

  const selectedCards: RoastCard[] = [];
  const usedCategories = new Set<string>();

  // Identify positive vs negative evidence categories
  const positiveCategories: string[] = [];
  const negativeCategories: string[] = [];

  for (const category of evidenceByCategory.keys()) {
    if (ROAST_TEMPLATE_BANK[category]) {
      const isPositive = ROAST_CATEGORIES[category]?.isPositive;
      if (isPositive) {
        positiveCategories.push(category);
      } else {
        negativeCategories.push(category);
      }
    }
  }

  // Shuffle categories deterministically
  const shuffledNegative = rng.shuffle(negativeCategories);
  const shuffledPositive = rng.shuffle(positiveCategories);

  // 1. Always include one positive card if available
  if (shuffledPositive.length > 0) {
    const posCat = shuffledPositive[0]!;
    const variants = ROAST_TEMPLATE_BANK[posCat]?.[roastLevel] ?? [];
    if (variants.length > 0) {
      const variant = rng.pick(variants);
      const evList = evidenceByCategory.get(posCat) ?? [];
      const primaryEv = evList[0];
      const text = injectPlaceholders(variant.template, facts, snapshot, primaryEv);
      selectedCards.push({
        id: `roast_${posCat}_${rng.int(100, 999)}`,
        category: posCat,
        title: variant.title,
        text,
        severity: variant.severity,
        evidenceIds: evList.map((e) => e.id),
        source: "template",
      });
      usedCategories.add(posCat);
    }
  }

  // 2. Fill remaining cards from negative diagnostic evidence
  for (const cat of shuffledNegative) {
    if (selectedCards.length >= maxCards) break;
    if (usedCategories.has(cat)) continue;

    const variants = ROAST_TEMPLATE_BANK[cat]?.[roastLevel] ?? [];
    if (variants.length === 0) continue;

    const variant = rng.pick(variants);
    const evList = evidenceByCategory.get(cat) ?? [];
    if (evList.length === 0) continue; // Invariant: must carry >=1 valid evidenceIds

    const primaryEv = evList[0];
    const text = injectPlaceholders(variant.template, facts, snapshot, primaryEv);

    selectedCards.push({
      id: `roast_${cat}_${rng.int(100, 999)}`,
      category: cat,
      title: variant.title,
      text,
      severity: variant.severity,
      evidenceIds: evList.map((e) => e.id),
      source: "template",
    });
    usedCategories.add(cat);
  }

  // Validate all selected cards with Zod schema
  return selectedCards.map((card) => RoastCardSchema.parse(card));
}
