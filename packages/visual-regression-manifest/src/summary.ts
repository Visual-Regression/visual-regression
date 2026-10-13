import { MANIFEST_STATUSES, needsHuman } from './constants';
import type { ManifestEntry, ManifestStatus, ManifestSummary } from './types';

export const countByStatus = (
  entries: readonly ManifestEntry[],
): Record<ManifestStatus, number> => {
  const counts = Object.fromEntries(
    MANIFEST_STATUSES.map((status) => [status, 0]),
  ) as Record<ManifestStatus, number>;
  for (const entry of entries) counts[entry.status] += 1;
  return counts;
};

/** The `summary` block of a manifest, computed from its entries. */
export const summarize = (
  entries: readonly ManifestEntry[],
): ManifestSummary => {
  const counts = countByStatus(entries);
  return {
    entries: entries.length,
    passed: counts.passed,
    failed: counts.failed,
    missingBaseline: counts['missing-baseline'],
    created: counts.created,
    updated: counts.updated,
    approved: counts.approved,
    needsHuman: entries.filter((entry) => needsHuman(entry.status)).length,
  };
};
